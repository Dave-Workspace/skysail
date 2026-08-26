<?php

header('Content-Type: application/json; charset=utf-8');

ini_set('display_errors', 1);
error_reporting(E_ALL);

require __DIR__ . '/config/db.php';

$logFile = __DIR__ . '/debug_enquiry.log';


/* =========================================================
   READ JSON INPUT
========================================================= */

$rawInput = file_get_contents('php://input');

file_put_contents(
    $logFile,
    "[" . date('Y-m-d H:i:s') . "] Travel Insurance Raw INPUT: " .
    $rawInput . PHP_EOL,
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
| IMPORTANT
|--------------------------------------------------------------------------
| SITE KEY:
| 6Ld2KkIsAAAAAIrAS8iRsiPZUS0Wqe5Qc8CmpuhY
|
| SECRET KEY:
| 6Ld2KkIsAAAAAHsG3IP50w1OPPHlJS3cTaTD1cSw
|
| Site key is used in JavaScript.
| Secret key is used ONLY here on the PHP server.
*/

$secretKey = '6Ld2KkIsAAAAAHsG3IP50w1OPPHlJS3cTaTD1cSw';

$verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';


/* =========================================================
   SEND VERIFICATION REQUEST TO GOOGLE
========================================================= */

$postData = http_build_query([
    'secret'   => $secretKey,
    'response' => $recaptchaToken
]);


/*
 * Use cURL for server-side verification.
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


/* =========================================================
   CURL ERROR
========================================================= */

if ($response === false || $response === '') {

    file_put_contents(
        $logFile,
        "[" . date('Y-m-d H:i:s') .
        "] RECAPTCHA CURL ERROR: " .
        $curlError .
        " | HTTP: " .
        $httpCode .
        PHP_EOL,
        FILE_APPEND | LOCK_EX
    );

    echo json_encode([
        'success' => false,
        'message' => 'Unable to contact reCAPTCHA verification service'
    ]);

    exit;
}


/* =========================================================
   READ GOOGLE RESPONSE
========================================================= */

$captchaResult = json_decode($response, true);

file_put_contents(
    $logFile,
    "[" . date('Y-m-d H:i:s') .
    "] CAPTCHA RESPONSE: " .
    $response .
    PHP_EOL,
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
   RECAPTCHA SUCCESS CHECK
========================================================= */

if (empty($captchaResult['success'])) {

    echo json_encode([
        'success' => false,
        'message' => 'Spam protection verification failed',
        'debug' => [
            'error_codes' =>
                $captchaResult['error-codes'] ?? []
        ]
    ]);

    exit;
}


/* =========================================================
   RECAPTCHA ACTION CHECK
========================================================= */

if (($captchaResult['action'] ?? '') !== 'form_submit') {

    echo json_encode([
        'success' => false,
        'message' => 'reCAPTCHA action mismatch',
        'debug' => [
            'action' =>
                $captchaResult['action'] ?? null
        ]
    ]);

    exit;
}


/* =========================================================
   RECAPTCHA SCORE CHECK
========================================================= */

$score = (float)($captchaResult['score'] ?? 0);

if ($score < 0.5) {

    echo json_encode([
        'success' => false,
        'message' => 'Spam protection verification failed',
        'debug' => [
            'score' =>
                $captchaResult['score'] ?? null,

            'action' =>
                $captchaResult['action'] ?? null,

            'hostname' =>
                $captchaResult['hostname'] ?? null
        ]
    ]);

    exit;
}


/* =========================================================
   READ FORM DATA
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
   VALIDATION
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
        INSERT INTO travel_insurance_enquiries
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
        $id .
        PHP_EOL,
        FILE_APPEND | LOCK_EX
    );


    /* =====================================================
       COMPANY EMAIL
    ===================================================== */

    $companyEmail = 'info@skysailimmigration.com';

    $subject =
        'Travel Insurance Enquiry from ' . $name;


    $message = '
    <html>
    <head>
        <meta charset="UTF-8">
        <title>New Travel Insurance Enquiry</title>
    </head>

    <body>

        <h2>New Travel Insurance Enquiry Received</h2>

        <p>
            <strong>Name:</strong>
            ' .
            htmlspecialchars(
                $name,
                ENT_QUOTES,
                'UTF-8'
            ) .
            '
        </p>

        <p>
            <strong>Contact:</strong>
            ' .
            htmlspecialchars(
                $contact,
                ENT_QUOTES,
                'UTF-8'
            ) .
            '
        </p>

        <p>
            <strong>Email:</strong>
            ' .
            htmlspecialchars(
                $email,
                ENT_QUOTES,
                'UTF-8'
            ) .
            '
        </p>

        <p>
            <strong>Age:</strong>
            ' .
            htmlspecialchars(
                $age,
                ENT_QUOTES,
                'UTF-8'
            ) .
            '
        </p>

        <p>
            <strong>Notes / Message:</strong><br>
            ' .
            nl2br(
                htmlspecialchars(
                    $notes,
                    ENT_QUOTES,
                    'UTF-8'
                )
            ) .
            '
        </p>

        <p>
            <em>
                Submitted on ' .
                date('Y-m-d H:i:s') .
                '
            </em>
        </p>

    </body>
    </html>
    ';


    /* =====================================================
       EMAIL HEADERS
    ===================================================== */

    $headers  = "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";

    /*
     * Use your website email as From address.
     * This is safer and more reliable on hosting.
     */

    $headers .=
        "From: SkySail Immigration <info@skysailimmigration.com>\r\n";

    $headers .=
        "Reply-To: " . $email . "\r\n";


    /* =====================================================
       SEND EMAIL
    ===================================================== */

    $emailSent = mail(
        $companyEmail,
        $subject,
        $message,
        $headers
    );


    if ($emailSent) {

        file_put_contents(
            $logFile,
            "[" . date('Y-m-d H:i:s') .
            "] EMAIL SENT SUCCESS to " .
            $companyEmail .
            PHP_EOL,
            FILE_APPEND | LOCK_EX
        );

    } else {

        file_put_contents(
            $logFile,
            "[" . date('Y-m-d H:i:s') .
            "] EMAIL FAILED TO SEND to " .
            $companyEmail .
            PHP_EOL,
            FILE_APPEND | LOCK_EX
        );
    }


    /* =====================================================
       SUCCESS RESPONSE
    ===================================================== */

    echo json_encode([
        'success' => true,
        'status'  => 'success',
        'message' => 'Travel Insurance enquiry submitted successfully',
        'id'      => $id
    ]);

    exit;


} catch (PDOException $e) {


    /* =====================================================
       DATABASE ERROR
    ===================================================== */

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
?>