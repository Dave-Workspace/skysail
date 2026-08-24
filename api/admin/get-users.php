<?php
session_start();
require_once __DIR__.'/../../config/db.php';
require_once __DIR__.'/../../config/csrf.php';

if(!isset($_SESSION['admin_id'])){
    http_response_code(401);
    echo json_encode(['error'=>'Unauthorized']);
    exit;
}

$stmt = $pdo->query("SELECT id,name,email,contact FROM users WHERE is_admin=1 ORDER BY created_at DESC");
$users = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode(['users'=>$users]);
