<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once __DIR__.'/../../config/db.php'; // defines $pdo

require_once __DIR__.'/../../config/config.php';

//header('Content-Type: application/json');

// if(!isset($_SESSION['user_id'])){
//     http_response_code(401);
//     echo json_encode(['success'=>false,'message'=>'Not logged in']);
//     exit;
// }

if(!isset($_SESSION['user_id'])) { echo json_encode(['success'=>false]); exit; }

$userId = $_SESSION['user_id'];

// Fetch posts by this user that are not published yet or have no answers
$stmt = $pdo->prepare("
    SELECT p.id, p.title, p.content, p.status,
       COUNT(a.id) AS answer_count
FROM posts p
LEFT JOIN answers a ON a.post_id = p.id
WHERE p.user_id = :user_id
GROUP BY p.id
HAVING p.status = 'pending' OR answer_count = 0
ORDER BY p.created_at DESC

");
$stmt->execute(['user_id'=>$userId]);
$posts = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode(['success'=>true,'posts'=>$posts]);
