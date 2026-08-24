<?php
require_once 'security.php';
require_once 'admin-auth.php';
$data = json_decode(file_get_contents('php://input'), true);
$id = intval($data['id'] ?? 0);

if($id <= 0){
    echo json_encode(['success'=>false,'message'=>'Invalid post ID']);
    exit;
}

// Soft delete: mark as disabled
$stmt = $conn->prepare("UPDATE posts SET disabled=1 WHERE id=?");
$stmt->bind_param("i", $id);
$stmt->execute();

echo json_encode(['success'=>true,'message'=>'Question deleted']);