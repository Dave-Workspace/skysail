<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once __DIR__.'/../../config/db.php'; // defines $pdo

require_once __DIR__.'/config/config.php';
if(!isset($_SESSION['user_id']) || $_SESSION['role']!=='admin'){ echo json_encode(['success'=>false]); exit; }

$stmt = $pdo->query("SELECT p.id,p.title,p.content,p.status FROM posts p ORDER BY created_at DESC");
$posts=$stmt->fetchAll(PDO::FETCH_ASSOC);
foreach($posts as &$p){
    // categories
    $stmt2=$pdo->prepare("SELECT category_id FROM post_categories pc JOIN categories c ON pc.category_id=c.id WHERE pc.post_id=?");
    $stmt2->execute([$p['id']]);
    $p['categories']=$stmt2->fetchAll(PDO::FETCH_COLUMN);

    // admin reply
    $stmt3=$pdo->prepare("SELECT content FROM answers WHERE post_id=? ORDER BY created_at DESC LIMIT 1");
    $stmt3->execute([$p['id']]);
    $p['admin_reply']=$stmt3->fetchColumn();
}

echo json_encode(['success'=>true,'posts'=>$posts]);
