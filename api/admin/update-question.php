<?php
require_once 'security.php';
require_once 'admin-auth.php';

$data = json_decode(file_get_contents('php://input'), true);

$id = intval($data['id'] ?? 0);
$postId  = intval($data['id'] ?? 0);
$title = trim($data['title'] ?? '');
$content = trim($data['content'] ?? '');
$answer       = trim($data['answer'] ?? '');
$category_ids = $data['category_ids'] ?? [];

$adminId = $_SESSION['admin_id'];

if ($id <= 0) {
    echo json_encode(['success' => false, 'message' => 'Invalid question ID']);
    exit;
}

if ($title === '' || $content === '') {
    echo json_encode(['success' => false, 'message' => 'Title and content are required']);
    exit;
}

if (!is_array($category_ids)) {
    $category_ids = [];
}

try {
    // 🔒 Transaction start
    $pdo->beginTransaction();

    // 1️⃣ Update post title + content
    $stmt = $pdo->prepare(
        "UPDATE posts SET title = ?, content = ? WHERE id = ?"
    );
    $stmt->execute([$title, $content, $id]);

    // 2️⃣ Remove existing category mappings
    $stmt = $pdo->prepare(
        "DELETE FROM post_categories WHERE post_id = ?"
    );
    $stmt->execute([$id]);

    // 3️⃣ Insert new category mappings
    if (!empty($category_ids)) {
        $insertStmt = $pdo->prepare(
            "INSERT INTO post_categories (post_id, category_id) VALUES (?, ?)"
        );

        foreach ($category_ids as $cat_id) {
            $insertStmt->execute([$id, intval($cat_id)]);
        }
    }

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

    // ✅ Commit transaction
    $pdo->commit();

    echo json_encode([
        'success' => true,
        'message' => 'Question updated successfully'
    ]);

} catch (PDOException $e) {
    // ❌ Rollback on error
    $pdo->rollBack();

    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to update question',
        'error'   => $e->getMessage()
    ]);
}
