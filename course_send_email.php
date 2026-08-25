<?php
header('Content-Type: application/json');
ini_set('display_errors', 1);
error_reporting(E_ALL);

require __DIR__ . '/config/db.php';

$logFile = __DIR__ . '/debug_enquiry.log';

// Read JSON input
$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

if (!is_array($data)) {
    echo json_encode(['success'=>false,'message'=>'Invalid JSON input']);
    exit;
}

/* ===============================
   RECAPTCHA VERIFICATION
================================ */

$recaptchaToken = $data['recaptcha_token'] ?? '';

if (!$recaptchaToken) {
    echo json_encode(['success'=>false,'message'=>'Missing reCAPTCHA token']);
    exit;
}

$secretKey = "6LcVCIIsAAAAAPCaE2pC0KOURE2tHRCOntWJvipb";

$verifyUrl = "https://www.google.com/recaptcha/api/siteverify";

$response = file_get_contents(
    $verifyUrl . "?secret=" . $secretKey . "&response=" . $recaptchaToken
);

$captchaResult = json_decode($response, true);

if (
    !$captchaResult['success'] ||
    $captchaResult['score'] < 0.5 ||
    $captchaResult['action'] !== 'form_submit'
) {

    file_put_contents(
        $logFile,
        "[" . date('Y-m-d H:i:s') . "] RECAPTCHA FAILED: " .
        json_encode($captchaResult) . PHP_EOL,
        FILE_APPEND | LOCK_EX
    );

    echo json_encode([
        'success'=>false,
        'message'=>'Spam protection verification failed'
    ]);

    exit;
}



// Sanitize inputs
$name     = trim($data['name'] ?? '');
$contact  = trim($data['contact'] ?? '');
$email    = filter_var(trim($data['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$level    = trim($data['level'] ?? '');
$field    = trim($data['field'] ?? '');
$program  = trim($data['program'] ?? '');
$province = trim($data['province'] ?? '');
$city     = trim($data['city'] ?? '');
$notes    = trim($data['notes'] ?? '');


// 🔹 Debug logging
$logData = "[" . date('Y-m-d H:i:s') . "] Course Enquiry INPUT: " . json_encode([
    'name' => $name,
    'contact' => $contact,
    'email' => $email,
    'level' => $level,
    'field' => $field,
    'program' => $program,
    'province' => $province,
    'city' => $city,
    'notes' => $notes
]) . PHP_EOL;

file_put_contents($logFile, $logData, FILE_APPEND | LOCK_EX);


// Validation
if (!$name || !$email || !$level || !$field || !$program) {

    $msg = 'Missing required fields';

    file_put_contents(
        $logFile,
        "[" . date('Y-m-d H:i:s') . "] ERROR: $msg" . PHP_EOL,
        FILE_APPEND | LOCK_EX
    );

    echo json_encode(['success'=>false,'message'=>$msg]);
    exit;
}

try {

    $pdo->beginTransaction();

    // Insert into database
    $stmt = $pdo->prepare("
        INSERT INTO course_enquiries
        (name, contact, email, level, field, program, province, city, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");

    $stmt->execute([
        $name,
        $contact,
        $email,
        $level,
        $field,
        $program,
        $province,
        $city,
        $notes
    ]);

    $enquiryId = $pdo->lastInsertId();

    $pdo->commit();


    // 🔹 Email to company
    $companyEmail = 'info@skysailimmigration.com';

    $subject = "Course Enquiry from $name";

    $message = "
    <html>
    <body>
        <h2>New Course Enquiry Received</h2>
        <p><strong>Name:</strong> $name</p>
        <p><strong>Contact:</strong> $contact</p>
        <p><strong>Email:</strong> $email</p>
        <p><strong>Program Level:</strong> $level</p>
        <p><strong>Field:</strong> $field</p>
        <p><strong>Program:</strong> $program</p>
        <p><strong>Province:</strong> $province</p>
        <p><strong>City:</strong> $city</p>
        <p><strong>Message:</strong><br>$notes</p>
        <p><em>Submitted on ".date('Y-m-d H:i:s')."</em></p>
    </body>
    </html>
    ";

    $headers  = "MIME-Version: 1.0\r\n";
    $headers .= "Content-type: text/html; charset=UTF-8\r\n";
    $headers .= "From: $email\r\n";
    $headers .= "Reply-To: $email\r\n";


    if(mail($companyEmail, $subject, $message, $headers)){
        file_put_contents(
            $logFile,
            "[" . date('Y-m-d H:i:s') . "] EMAIL SENT SUCCESS" . PHP_EOL,
            FILE_APPEND | LOCK_EX
        );
    } else {
        file_put_contents(
            $logFile,
            "[" . date('Y-m-d H:i:s') . "] EMAIL FAILED TO SEND" . PHP_EOL,
            FILE_APPEND | LOCK_EX
        );
    }

    echo json_encode(['status' => 'success']);

} catch (PDOException $e) {

    $pdo->rollBack();

    $errorMsg = $e->getMessage();

    file_put_contents(
        $logFile,
        "[" . date('Y-m-d H:i:s') . "] DB ERROR: $errorMsg" . PHP_EOL,
        FILE_APPEND | LOCK_EX
    );

    http_response_code(500);

    echo json_encode([
        'success'=>false,
        'message'=>'Failed to submit enquiry',
        'error'=>$errorMsg
    ]);
}
?>