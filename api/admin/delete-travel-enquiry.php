<?php
require_once 'security.php';
require_once 'admin-auth.php';

$data = json_decode(file_get_contents('php://input'), true);
$id = intval($data['id'] ?? 0);

try {
    // Delete record
    $deleteStmt = $pdo->prepare("DELETE FROM travel_insurance_enquiries WHERE id = ?");
    $deleteStmt->execute([$id]);

    echo json_encode(['success' => true, 'message' => 'Record deleted']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error',
        'error' => $e->getMessage()
    ]);
}
