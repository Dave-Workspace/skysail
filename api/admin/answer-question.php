<?php
require_once 'security.php';
require_once 'admin-auth.php';
$data = json_decode(file_get_contents('php://input'), true);

$postId     = intval($data['post_id'] ?? 0);
$title      = trim($data['title'] ?? '');
$content    = trim($data['content'] ?? '');
$answer     = trim($data['answer'] ?? '');
$categories = $data['categories'] ?? [];

if (!$postId || !$title || empty($categories)) {
    echo json_encode(['success' => false, 'message' => 'Invalid data']);
    exit;
}

$adminId = $_SESSION['admin_id'];

try {
    $pdo->beginTransaction();

    /* ===============================
       1. UPDATE QUESTION (POST)
    =============================== */
    $stmt = $pdo->prepare("
        UPDATE posts 
        SET title = ?, content = ?
        WHERE id = ?
    ");
    $stmt->execute([$title, $content, $postId]);

    /* ===============================
       2. SAVE ANSWER (UPSERT)
    =============================== */
    $stmt = $pdo->prepare("SELECT id FROM answers WHERE post_id = ?");
    $stmt->execute([$postId]);

    if ($stmt->fetch()) {
        $stmt = $pdo->prepare("
            UPDATE answers 
            SET content = ? 
            WHERE post_id = ?
        ");
        $stmt->execute([$answer, $postId]);
    } else {
        $stmt = $pdo->prepare("
            INSERT INTO answers (post_id, admin_id, content, created_at)
            VALUES (?, ?, ?, NOW())
        ");
        $stmt->execute([$postId, $adminId, $answer]);
    }

    /* ===============================
       3. UPDATE CATEGORIES
    =============================== */
    // Remove old mappings
    $stmt = $pdo->prepare("DELETE FROM post_categories WHERE post_id = ?");
    $stmt->execute([$postId]);

    // Insert new mappings
    $stmt = $pdo->prepare("
        INSERT INTO post_categories (post_id, category_id)
        VALUES (?, ?)
    ");
    foreach ($categories as $catId) {
        $stmt->execute([$postId, intval($catId)]);
    }

    $pdo->commit();

    echo json_encode([
        'success' => true,
        'message' => 'Question updated successfully'
    ]);

} catch (Exception $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to save changes'
    ]);
}
