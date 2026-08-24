<?php
require_once 'security.php';
require_once 'admin-auth.php';

$data = json_decode(file_get_contents('php://input'), true);
$id = intval($data['id'] ?? 0);

if ($id <= 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid post ID']);
    exit;
}

try {
    // 1. Get current status
    $stmt = $pdo->prepare("SELECT status FROM posts WHERE id = ?");
    $stmt->execute([$id]);
    $post = $stmt->fetch();

    if (!$post) {
        echo json_encode(['success' => false, 'message' => 'Post not found']);
        exit;
    }

    // 2. Decide new values
    if ($post['status'] === 'published') {
        $newStatus = 'pending';
        $disabled  = 1;
    } else {
        $newStatus = 'published';
        $disabled  = 0;
    }

    // 3. Update post
    $updateStmt = $pdo->prepare(
        "UPDATE posts SET status = ?, disabled = ? WHERE id = ?"
    );
    $updateStmt->execute([$newStatus, $disabled, $id]);

    echo json_encode([
        'success' => true,
        'message' => 'Post status updated',
        'status'  => $newStatus
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error',
        'error'   => $e->getMessage()
    ]);
}
