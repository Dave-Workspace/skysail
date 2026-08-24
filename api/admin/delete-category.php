<?php
require_once 'security.php';
require_once 'admin-auth.php';
$data = json_decode(file_get_contents('php://input'), true);
$id = intval($data['id'] ?? 0);
$disable = intval($data['disable'] ?? 1); // 1=disable, 0=enable

$stmt = $conn->prepare("UPDATE categories SET disabled=? WHERE id=?");
$stmt->bind_param("ii", $disable, $id);
$stmt->execute();

echo json_encode([
    'success' => true,
    'message' => $disable ? 'Category disabled' : 'Category enabled'
]);