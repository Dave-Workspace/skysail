<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

//header('Content-Type: application/json');

// CSRF check for POST/PUT/DELETE



if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    $headers = array_change_key_case(getallheaders(), CASE_UPPER);
    if (
        !isset($headers['X-CSRF-TOKEN']) ||
        !isset($_SESSION['csrf_token']) ||
        !hash_equals($_SESSION['csrf_token'], $headers['X-CSRF-TOKEN'])
    ) {
        http_response_code(403);
        echo json_encode(['success'=>false,'message'=>'Invalid CSRF token']);
        exit;
    }
}

// DB connection
require_once __DIR__ . '/../../config/db.php';
