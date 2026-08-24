<?php
require_once 'security.php';
require_once 'admin-auth.php';

/* ---- Input ---- */
$data = json_decode(file_get_contents('php://input'), true);

$id       = (int)($data['id'] ?? 0);
$status     = trim($data['status'] ?? '');

if ($id <= 0 || $status === '') {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid data'
    ]);
    exit;
}

/* ---- Update ---- */
$stmt = $pdo->prepare(
    "UPDATE course_enquiries 
     SET status = ?
     WHERE id = ?"
);
$stmt->execute([$status, $id]);

echo json_encode([
    'success' => true,
    'message' => 'Record updated successfully'
]);
