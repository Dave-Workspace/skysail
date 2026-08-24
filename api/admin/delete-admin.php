<?php
require_once 'security.php';
require_once 'admin-auth.php';

$data = json_decode(file_get_contents('php://input'), true);
$id = intval($data['id'] ?? 0);

// Prevent deleting yourself
if ($id === $_SESSION['admin_id']) {
    echo json_encode(['success' => false, 'message' => 'Cannot delete yourself']);
    exit;
}

try {
    // Prevent deleting super admin
    $stmt = $pdo->prepare("SELECT email FROM users WHERE id = ? AND is_admin = 1");
    $stmt->execute([$id]);
    $user = $stmt->fetch(); // fetch() returns associative array or false

    if ($user && $user['email'] === 'admin@yourdomain.com') {
        echo json_encode(['success' => false, 'message' => 'Cannot delete super admin']);
        exit;
    }

    // Delete admin
    $deleteStmt = $pdo->prepare("DELETE FROM users WHERE id = ? AND is_admin = 1");
    $deleteStmt->execute([$id]);

    echo json_encode(['success' => true, 'message' => 'Admin deleted']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error',
        'error' => $e->getMessage()
    ]);
}
