<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

//header('Content-Type: application/json');

require_once __DIR__ . '/../config/csrf.php';

/**
 * If user is not logged in → session expired
 */
if (!isset($_SESSION['user_id']) && !isset($_SESSION['admin_id'])) {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => 'Session expired'
    ]);
    exit;
}

/**
 * Optional: refresh CSRF token (rotate)
 * Good for long-lived dashboards
 */
$_SESSION['csrf_token'] = bin2hex(random_bytes(32));

echo json_encode([
    'success'    => true,
    'csrf_token'=> $_SESSION['csrf_token']
]);
