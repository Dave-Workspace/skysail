<?php
require_once 'security.php';
require_once 'admin-auth.php';

$data = json_decode(file_get_contents('php://input'), true);
$order = $data['order'] ?? [];

if (!$order || !is_array($order)) {
    echo json_encode(['success'=>false, 'message'=>'Invalid data']);
    exit;
}

try {
    $stmt = $pdo->prepare("
        UPDATE post_categories 
        SET priority = :priority 
        WHERE post_id = :post_id AND category_id = :category_id
    ");

    foreach ($order as $o) {
        $post_id     = intval($o['post_id']);
        $category_id = intval($o['category_id']);
        $priority    = intval($o['priority']);

        $stmt->execute([
            ':priority'    => $priority,
            ':post_id'     => $post_id,
            ':category_id' => $category_id
        ]);
    }

    echo json_encode(['success'=>true,'message'=>'Question priority updated']);
} catch(PDOException $e) {
    echo json_encode(['success'=>false,'message'=>$e->getMessage()]);
}
