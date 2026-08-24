<?php
require_once 'security.php';
require_once 'admin-auth.php';

$data = json_decode(file_get_contents('php://input'), true);
$order = $data['order'] ?? [];

if (!$order) {
    echo json_encode(['success'=>false,'message'=>'Invalid order']);
    exit;
}

$stmt = $pdo->prepare(
    "UPDATE categories SET priority = ? WHERE id = ?"
);

foreach ($order as $index => $id) {
    $stmt->execute([$index + 1, (int)$id]);
}

echo json_encode(['success'=>true,'message'=>'Category order updated']);
