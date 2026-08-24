<?php
require_once 'security.php';
require_once 'admin-auth.php';

$data = json_decode(file_get_contents('php://input'), true);

$title = trim($data['title'] ?? '');
$content = trim($data['content'] ?? '');
$answer = trim($data['answer'] ?? '');
$category_ids = $data['category_ids'] ?? [];
$published = intval($data['published'] ?? 0);



$adminId = $_SESSION['admin_id'];

if (!$title || !$content) {
    echo json_encode(['success'=>false,'message'=>'Title and content required']);
    exit;
}

try {
    $pdo->beginTransaction();

    // 1️⃣ Insert post
    $stmt = $pdo->prepare("INSERT INTO posts (user_id, title, content, status, disabled) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$adminId, $title, $content, $published, $published]);
    $postId = $pdo->lastInsertId();

    // 2️⃣ Insert categories
    if(!empty($category_ids)){
        $insert = $pdo->prepare("INSERT INTO post_categories (post_id, category_id, priority) VALUES (?, ?, ?)");
        foreach($category_ids as $catId){
            $insert->execute([$postId, intval($catId), 999]); // default priority = 999 (end)
        }
    }

    // 3️⃣ Insert answer if provided
    if($answer){
        $stmt = $pdo->prepare("INSERT INTO answers (post_id, admin_id, content, created_at) VALUES (?, ?, ?, NOW())");
        $stmt->execute([$postId, $adminId, $answer]);
    }

    $pdo->commit();

    echo json_encode(['success'=>true,'message'=>'Question added successfully']);

} catch (PDOException $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode(['success'=>false,'message'=>'Failed to add question','error'=>$e->getMessage()]);
}
