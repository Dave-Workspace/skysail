<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once __DIR__.'/../../config/db.php'; // defines $pdo

require_once __DIR__.'/../../config/config.php';
if(!isset($_SESSION['user_id'])) { echo json_encode(['success'=>false]); exit; }

$user_id = $_SESSION['user_id'];
$stmt = $pdo->prepare("SELECT id,title,content,status FROM posts WHERE user_id=? ORDER BY created_at DESC");
$stmt->execute([$user_id]);
$posts = $stmt->fetchAll(PDO::FETCH_ASSOC);

foreach($posts as &$p){
    $stmt2=$pdo->prepare("SELECT content FROM answers WHERE post_id=?");
    $stmt2->execute([$p['id']]);
    $p['answers']=$stmt2->fetchAll(PDO::FETCH_ASSOC);
}

echo json_encode(['success'=>true,'posts'=>$posts]);
