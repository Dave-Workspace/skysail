<?php

header('Content-Type: application/json; charset=utf-8');

ini_set('display_errors', 1);
error_reporting(E_ALL);

require __DIR__ . '/config/db.php';

$logFile = __DIR__ . '/debug_supervisa.log';


/* =========================================================
   READ JSON INPUT
========================================================= */

$rawInput = file_get_contents('php://input');

file_put_contents(
    $logFile,
    "[" . date('Y-m-d H:i:s') . "] RAW INPUT: " . $rawInput . PHP_EOL,
    FILE_APPEND | LOCK_EX
);

$data = json_decode($rawInput, true);

if (!is_array($data)) {

    echo json_encode([
        'success' => false,
        'message' => 'Invalid JSON input'
    ]);

    exit;
}


/* =========================================================
   RECAPTCHA VERIFICATION
========================================================= */

$recaptchaToken = trim($data['recaptcha_token'] ?? '');

if ($recaptchaToken === '') {

    echo json_encode([
        'success' => false,
        'message' => 'Missing reCAPTCHA token'
    ]);

    exit;
}


/*
|--------------------------------------------------------------------------
| RECAPTCHA KEYS
|--------------------------------------------------------------------------
| Site Key is used in HTML/JavaScript.
| Secret Key is used ONLY on the PHP server.
*/

$secretKey = '6Ld2KkIsAAAAAHsG3IP50w1OPPHlJS3cTaTD1cSw';

$verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';


/* =========================================================
   VERIFY WITH GOOGLE USING POST
========================================================= */

$postData = http_build_query([
    'secret'   => $secretKey,
    'response' => $recaptchaToken
]);


/*
 * Use cURL when available.
 * This is more reliable than putting the token
 * directly into the verification URL.
 */

$ch = curl_init($verifyUrl);

curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => $postData,
    CURLOPT_HTTPHEADER     => [
        'Content-Type: application/x-www-form-urlencoded'
    ],
    CURLOPT_TIMEOUT        => 15,
    CURLOPT_SSL_VERIFYPEER => true,
    CURLOPT_SSL_VERIFYHOST => 2
]);

$response = curl_exec($ch);

$curlError = curl_error($ch);
$httpCode  = curl_getinfo($ch, CURLINFO_HTTP_CODE);

curl_close($ch);


if ($response === false || $response === '') {

    file_put_contents(
        $logFile,
        "[" . date('Y-m-d H:i:s') . "] RECAPTCHA CURL ERROR: " .
        $curlError . PHP_EOL,
        FILE_APPEND | LOCK_EX
    );

    echo json_encode([
        'success' => false,
        'message' => 'Unable to contact reCAPTCHA verification service',
        'http_code' => $httpCode
    ]);

    exit;
}


/* =========================================================
   PARSE GOOGLE RESPONSE
========================================================= */

$captchaResult = json_decode($response, true);

file_put_contents(
    $logFile,
    "[" . date('Y-m-d H:i:s') . "] RECAPTCHA RESPONSE: " .
    json_encode($captchaResult) . PHP_EOL,
    FILE_APPEND | LOCK_EX
);


if (!is_array($captchaResult)) {

    echo json_encode([
        'success' => false,
        'message' => 'Invalid reCAPTCHA server response'
    ]);

    exit;
}


/* =========================================================
   RECAPTCHA RESULT VALIDATION
========================================================= */

if (empty($captchaResult['success'])) {

    echo json_encode([
        'success' => false,
        'message' => 'Spam protection verification failed',
        'debug' => [
            'error_codes' => $captchaResult['error-codes'] ?? []
        ]
    ]);

    exit;
}


/*
 * reCAPTCHA v3 action check
 */

if (($captchaResult['action'] ?? '') !== 'form_submit') {

    echo json_encode([
        'success' => false,
        'message' => 'reCAPTCHA action mismatch',
        'debug' => [
            'action' => $captchaResult['action'] ?? null
        ]
    ]);

    exit;
}


/*
 * Score check
 */

$score = (float)($captchaResult['score'] ?? 0);

if ($score < 0.5) {

    echo json_encode([
        'success' => false,
        'message' => 'Spam protection verification failed',
        'debug' => [
            'score' => $score,
            'action' => $captchaResult['action'] ?? null,
            'hostname' => $captchaResult['hostname'] ?? null
        ]
    ]);

    exit;
}


/* =========================================================
   FORM DATA
========================================================= */

$name = trim($data['name'] ?? '');

$contact = trim($data['contact'] ?? '');

$email = filter_var(
    trim($data['email'] ?? ''),
    FILTER_VALIDATE_EMAIL
);

$age = trim($data['age'] ?? '');

$notes = trim($data['notes'] ?? '');


/* =========================================================
   BASIC VALIDATION
========================================================= */

if ($name === '') {

    echo json_encode([
        'success' => false,
        'message' => 'Name is required'
    ]);

    exit;
}

if (!$email) {

    echo json_encode([
        'success' => false,
        'message' => 'Valid email is required'
    ]);

    exit;
}


/* =========================================================
   DATABASE INSERT
========================================================= */

try {

    $pdo->beginTransaction();

    $stmt = $pdo->prepare("
        INSERT INTO super_visa_enquiries
        (
            name,
            contact,
            email,
            age,
            notes
        )
        VALUES
        (
            :name,
            :contact,
            :email,
            :age,
            :notes
        )
    ");

    $stmt->execute([
        ':name'    => $name,
        ':contact' => $contact,
        ':email'   => $email,
        ':age'     => $age,
        ':notes'   => $notes
    ]);

    $id = $pdo->lastInsertId();

    $pdo->commit();


    file_put_contents(
        $logFile,
        "[" . date('Y-m-d H:i:s') .
        "] INSERT SUCCESS ID: " .
        $id . PHP_EOL,
        FILE_APPEND | LOCK_EX
    );


    /* =====================================================
       COMPANY EMAIL
    ===================================================== */

    $companyEmail = 'info@skysailimmigration.com';

    $subjectCompany =
        'Super Visa Health Insurance Enquiry from ' . $name;


    $messageCompany = '
    <html>
    <body>

        <h2>New Super Visa Insurance Enquiry</h2>

        <p>
            <strong>Name:</strong>
            ' . htmlspecialchars($name, ENT_QUOTES, 'UTF-8') . '
        </p>

        <p>
            <strong>Contact:</strong>
            ' . htmlspecialchars($contact, ENT_QUOTES, 'UTF-8') . '
        </p>

        <p>
            <strong>Email:</strong>
            ' . htmlspecialchars($email, ENT_QUOTES, 'UTF-8') . '
        </p>

        <p>
            <strong>Age:</strong>
            ' . htmlspecialchars($age, ENT_QUOTES, 'UTF-8') . '
        </p>

        <p>
            <strong>Notes:</strong><br>
            ' . nl2br(
                htmlspecialchars($notes, ENT_QUOTES, 'UTF-8')
            ) . '
        </p>

        <p>
            <em>
                Submitted on ' . date('Y-m-d H:i:s') . '
            </em>
        </p>

    </body>
    </html>
    ';


    $headers  = "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    $headers .= "From: SkySail Website <info@skysailimmigration.com>\r\n";
    $headers .= "Reply-To: " . $email . "\r\n";


    $emailSent = mail(
        $companyEmail,
        $subjectCompany,
        $messageCompany,
        $headers
    );


    file_put_contents(
        $logFile,
        "[" . date('Y-m-d H:i:s') .
        "] COMPANY EMAIL " .
        ($emailSent ? 'SENT' : 'FAILED') .
        PHP_EOL,
        FILE_APPEND | LOCK_EX
    );


    /* =====================================================
       SUCCESS RESPONSE
    ===================================================== */

    echo json_encode([
        'success' => true,
        'status'  => 'success',
        'message' => 'Enquiry submitted successfully',
        'id'      => $id
    ]);

    exit;


} catch (PDOException $e) {

    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    file_put_contents(
        $logFile,
        "[" . date('Y-m-d H:i:s') .
        "] DB ERROR: " .
        $e->getMessage() .
        PHP_EOL,
        FILE_APPEND | LOCK_EX
    );

    echo json_encode([
        'success' => false,
        'message' => 'Database error',
        'error'   => $e->getMessage()
    ]);

    exit;
}