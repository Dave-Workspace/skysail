<?php
header('Content-Type: application/json');
ini_set('display_errors', 1);
error_reporting(E_ALL);


require __DIR__ . '/config/db.php';

$logFile = __DIR__ . '/debug_enquiry.log';



// Read JSON input
$rawInput = file_get_contents('php://input');
file_put_contents($logFile, "[".date('Y-m-d H:i:s')."] Travel Insurance Raw INPUT: $rawInput".PHP_EOL, FILE_APPEND | LOCK_EX);

$data = json_decode($rawInput, true);
if (!is_array($data)) {
   file_put_contents($logFile, "[".date('Y-m-d H:i:s')."] ERROR: Invalid JSON".PHP_EOL, FILE_APPEND | LOCK_EX);
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

file_put_contents($logFile,  "[".date('Y-m-d H:i:s')."] CAPTCHA RESPONSE: " . $response . PHP_EOL, FILE_APPEND);

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


$name    = trim($data['name'] ?? '');
$contact = trim($data['contact'] ?? '');
$email   = filter_var(trim($data['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$age     = trim($data['age'] ?? '');
$notes   = trim($data['notes'] ?? '');


// 4️⃣ Validate required fields
if (!$name || !$email) {
    $msg = 'Name and Email are required';
    file_put_contents($logFile, "[".date('Y-m-d H:i:s')."] ERROR: $msg".PHP_EOL, FILE_APPEND | LOCK_EX);
    echo json_encode(['success'=>false,'message'=>$msg]);
    exit;
}

try {
    // Begin transaction
    $pdo->beginTransaction();

    $stmt = $pdo->prepare("INSERT INTO travel_insurance_enquiries (name, contact, email, age, notes) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$name, $contact, $email, $age, $notes]);
    $id = $pdo->lastInsertId();

     $pdo->commit();
    
    //file_put_contents($logFile, "[".date('Y-m-d H:i:s')."] INSERT SUCCESS ID: $id".PHP_EOL, FILE_APPEND | LOCK_EX);


// 🔹 2️⃣ Send email to company (Travel Insurance)
$companyEmail = 'info@canboards.com';
$subject = "Travel Insurance Enquiry from $name";

$message = "
<html>
<head><title>New Travel Insurance Enquiry</title></head>
<body>
    <h2>New Travel Insurance Enquiry Received</h2>
    <p><strong>Name:</strong> $name</p>
    <p><strong>Contact:</strong> $contact</p>
    <p><strong>Email:</strong> $email</p>
    <p><strong>Age:</strong> $age</p>
    <p><strong>Notes / Message:</strong><br>$notes</p>
    <p><em>Submitted on " . date('Y-m-d H:i:s') . "</em></p>
</body>
</html>
";

// Headers for HTML email
$headers  = "MIME-Version: 1.0\r\n";
$headers .= "Content-type: text/html; charset=UTF-8\r\n";
$headers .= "From: $email\r\n";
$headers .= "Reply-To: $email\r\n";

// Send email and log result
if (mail($companyEmail, $subject, $message, $headers)) {
    file_put_contents($logFile, "[" . date('Y-m-d H:i:s') . "] EMAIL SENT SUCCESS to $companyEmail" . PHP_EOL, FILE_APPEND | LOCK_EX);
} else {
    file_put_contents($logFile, "[" . date('Y-m-d H:i:s') . "] EMAIL FAILED TO SEND to $companyEmail" . PHP_EOL, FILE_APPEND | LOCK_EX);
}


    echo json_encode(['status' => 'success']);

} catch (PDOException $e) {
     $pdo->rollBack();
    file_put_contents($logFile, "[".date('Y-m-d H:i:s')."] DB ERROR: ".$e->getMessage().PHP_EOL, FILE_APPEND | LOCK_EX);
    echo json_encode(['success'=>false,'error'=>$e->getMessage()]);
}