<?php
require_once 'security.php';
require_once 'admin-auth.php';


$data = json_decode(file_get_contents('php://input'), true);
$id = intval($data['id'] ?? 0);
$disabled = (int)($data['disabled'] ?? 1);

if($id <= 0){
    echo json_encode(['success'=>false,'message'=>'Invalid category']);
    exit;
}

try {
    // Toggle disabled: if 0 (enabled) => 1 (disabled), if 1 => 0
    $stmt = $pdo->prepare("UPDATE categories SET disabled = 1 - disabled WHERE id = ?");
    $stmt->execute([$id]);

    echo json_encode(['success' => true, 'message' => 'Category toggled']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error',
        'error' => $e->getMessage()
    ]);
}
