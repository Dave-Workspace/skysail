<?php
require_once __DIR__. '/../config/db.php'; // defines $pdo
require_once __DIR__ . '/../lib/Security.php';
require_once __DIR__ . '/../lib/ApiClient.php';


Security::csrfCheck();

$data = json_decode(file_get_contents("php://input"), true);
$email = filter_var($data['email'], FILTER_VALIDATE_EMAIL);

if (!$email) {
    echo json_encode(['exists' => false]);
    exit;
}



// Set mode: 'real', 'dummy_positive', 'dummy_negative'
$mode = 'real'; // change this to test different scenarios

if ($mode === 'dummy_positive') {
    // Pretend user exists
    echo json_encode(['exists' => true]);
    exit;
} elseif ($mode === 'dummy_negative') {
    // Pretend user does not exist
    echo json_encode(['exists' => false]);
    exit;
} else {
    // Real API call
    $response = ApiClient::post('check-email-status', ['email' => $email]);
    echo $response;
}
