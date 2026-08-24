<?php
require_once 'security.php';
//require_once 'admin-auth.php';

$data = json_decode(file_get_contents('php://input'), true);

$email = trim($data['email'] ?? '');
$password = trim($data['password'] ?? '');

if(!$email || !$password){
    echo json_encode(['success'=>false,'message'=>'Email and password required']);
    exit;
}

$stmt = $pdo->prepare("
    SELECT id,name,email,password,is_admin,is_verified
    FROM users
    WHERE email=? AND is_admin=1
    LIMIT 1
");
$stmt->execute([$email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if(!$user){
    echo json_encode(['success'=>false,'message'=>'Admin not found']);
    exit;
}

if(!password_verify($password,$user['password'])){
    echo json_encode(['success'=>false,'message'=>'Invalid credentials']);
    exit;
}

if(!$user['is_verified']){
    echo json_encode(['success'=>false,'message'=>'not_verified']);
    exit;
}

// ✅ LOGIN SUCCESS
$_SESSION['admin_id']   = $user['id'];
$_SESSION['admin_name'] = $user['name'];
$_SESSION['role']       = 'admin';

echo json_encode(['success'=>true]);
