<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once __DIR__.'/../config/db.php'; // defines $pdo

require_once __DIR__.'/../lib/Security.php';
require_once __DIR__.'/../lib/ApiClient.php';
Security::csrfCheck();

$data = json_decode(file_get_contents("php://input"),true);
$email = $data['email'] ?? '';

if(!$email){
    echo json_encode(['success'=>false,'message'=>'Email required']);
    exit;
}

/* Optional: Rate limit resend per IP/email here */

$responseJson = ApiClient::post('resend-verification',['email'=>$email]);
//echo $response;

$response = json_decode($responseJson, true);

if (isset($response['message']) && $response['message'] === 'user not found or already verified') {

    // known logical failure
    echo json_encode([
        'success' => false,
        'message' => $response['message']
    ]);

} elseif (isset($response['message']) && $response['message'] === 'sent') {
    // 👆 change this string to EXACT success message your API sends

    echo json_encode([
        'success' => true,
        'message' => 'Verification email resent successfully'
    ]);

} else {

    // general / unexpected error
    echo json_encode([
        'success' => false,
        'message' => 'Something went wrong. Please try again later.'
    ]);
}
