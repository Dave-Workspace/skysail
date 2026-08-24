<?php
require_once 'security.php';
require_once 'admin-auth.php';

/* ---- Input ---- */
$data = json_decode(file_get_contents('php://input'), true);

$id       = (int)($data['id'] ?? 0);
$name     = trim($data['name'] ?? '');
$disabled = isset($data['disabled']) ? (int)$data['disabled'] : 0;

if ($id <= 0 || $name === '') {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid category data'
    ]);
    exit;
}

/* ---- Update ---- */
$stmt = $pdo->prepare(
    "UPDATE categories 
     SET name = ?, disabled = ? 
     WHERE id = ?"
);
$stmt->execute([$name, $disabled, $id]);

echo json_encode([
    'success' => true,
    'message' => 'Category updated successfully'
]);
