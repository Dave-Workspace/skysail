<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once __DIR__.'/../config/db.php'; // defines $pdo
require_once __DIR__.'/../config/config.php';
require_once __DIR__.'/../lib/Security.php';

Security::csrfCheck();

$data = json_decode(file_get_contents("php://input"), true);

if(!isset($_SESSION['user_id'])){
    echo json_encode(['success'=>false,'message'=>'Unauthorized']);
    exit;
}

$user_id = $_SESSION['user_id'];
$title = trim($data['title']);
$content = trim($data['content']);
$category_ids = $data['categories'] ?? [];

if(!$title || empty($category_ids)){
    echo json_encode(['success'=>false,'message'=>'Title and categories required']);
    exit;
}

// Sanitize input for public display
$title = htmlspecialchars($title, ENT_QUOTES, 'UTF-8');
$content = htmlspecialchars($content, ENT_QUOTES, 'UTF-8');

try {
    $pdo->beginTransaction();

    // Validate category IDs
    $stmtCheck = $pdo->prepare("SELECT id FROM categories WHERE id=? AND disabled=0");
    foreach($category_ids as $cat_id){
        $stmtCheck->execute([$cat_id]);
        if(!$stmtCheck->fetch()) {
            throw new Exception("Invalid or disabled category ID: $cat_id");
        }
    }

    // Insert post
    $stmt = $pdo->prepare("INSERT INTO posts (user_id, title, content, status, disabled) VALUES (?, ?, ?, 'pending', 0)");
    $stmt->execute([$user_id, $title, $content]);
    $post_id = $pdo->lastInsertId();

    // Link categories
    $stmt2 = $pdo->prepare("INSERT INTO post_categories (post_id, category_id) VALUES (?, ?)");
    foreach($category_ids as $cat_id){
        $stmt2->execute([$post_id, $cat_id]);
    }

    $pdo->commit();
    echo json_encode(['success'=>true,'message'=>'Post submitted successfully']);

} catch (Exception $e) {
    $pdo->rollBack();
    echo json_encode(['success'=>false,'message'=>$e->getMessage()]);
}
