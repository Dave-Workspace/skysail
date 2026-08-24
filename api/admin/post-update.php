<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once __DIR__.'/../../config/db.php'; // defines $pdo

require_once __DIR__.'/../../config/config.php';
require_once __DIR__.'/../../lib/Security.php';
Security::csrfCheck();

// Only admin
if($_SESSION['role']!=='admin'){
    echo json_encode(['success'=>false,'message'=>'Unauthorized']);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$post_id = $data['post_id'];
$new_status = $data['status']; // pending, published, dropped
$new_content = $data['content'];
$new_categories = $data['categories'] ?? [];
$reply = $data['reply'] ?? '';

// Update post content & status
$stmt = $pdo->prepare("UPDATE posts SET content=?, status=? WHERE id=?");
$stmt->execute([$new_content, $new_status, $post_id]);

// Update categories
$pdo->prepare("DELETE FROM post_categories WHERE post_id=?")->execute([$post_id]);
$stmt2 = $pdo->prepare("INSERT INTO post_categories (post_id, category_id) VALUES (?, ?)");
foreach($new_categories as $cat) $stmt2->execute([$post_id, $cat]);

// Add admin reply if any
if($reply){
    $stmt3 = $pdo->prepare("INSERT INTO answers (post_id, admin_id, content) VALUES (?, ?, ?)");
    $stmt3->execute([$post_id, $_SESSION['user_id'], $reply]);
}

echo json_encode(['success'=>true,'message'=>'Post updated successfully']);
