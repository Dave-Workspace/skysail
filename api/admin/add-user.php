<?php
session_start();
require_once __DIR__.'/../../config/db.php';
require_once __DIR__.'/../../config/csrf.php';

if(!isset($_SESSION['admin_id'])) {
    http_response_code(401);
    echo json_encode(['error'=>'Unauthorized']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

// CSRF validation
if(!validateCsrfToken($_SERVER['HTTP_X_CSRF_TOKEN'] ?? '')){
    http_response_code(403);
    echo json_encode(['error'=>'Forbidden']);
    exit;
}

// Required fields
$name = trim($data['name'] ?? '');
$email = trim($data['email'] ?? '');
$password = $data['password'] ?? '';
$contact = trim($data['contact'] ?? '');

if(!$name || !$email || !$password) {
    echo json_encode(['success'=>false,'message'=>'All fields required']);
    exit;
}

// Check if email exists
$stmt = $pdo->prepare("SELECT id FROM users WHERE email=? LIMIT 1");
$stmt->execute([$email]);
if($stmt->fetch()){
    echo json_encode(['success'=>false,'message'=>'Email already exists']);
    exit;
}

// Insert admin
$hash = password_hash($password, PASSWORD_DEFAULT);
$stmt = $pdo->prepare("INSERT INTO users (name,email,password,contact,is_admin,is_verified,created_at) VALUES (?,?,?,?,1,1,NOW())");
$stmt->execute([$name,$email,$hash,$contact]);

echo json_encode(['success'=>true]);
