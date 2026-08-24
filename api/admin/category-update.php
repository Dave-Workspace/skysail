<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once __DIR__.'/../../config/db.php'; // defines $pdo

require_once __DIR__.'/../../config/config.php';
require_once __DIR__.'/../../lib/Security.php';
Security::csrfCheck();

if(!isset($_SESSION['user_id']) || $_SESSION['role']!=='admin'){
    echo json_encode(['success'=>false,'message'=>'Unauthorized']);
    exit;
}

$data=json_decode(file_get_contents("php://input"),true);
$action=$data['action'] ?? '';

switch($action){
    case 'create':
        $name=$data['name']??'';
        if(!$name) { echo json_encode(['success'=>false,'message'=>'Name required']); exit;}
        $stmt=$pdo->prepare("INSERT INTO categories (name) VALUES (?)");
        $stmt->execute([$name]);
        echo json_encode(['success'=>true]);
        break;
    case 'update':
        $id=$data['id']??0;
        $name=$data['name']??'';
        if(!$id || !$name) { echo json_encode(['success'=>false,'message'=>'Invalid']); exit;}
        $stmt=$pdo->prepare("UPDATE categories SET name=? WHERE id=?");
        $stmt->execute([$name,$id]);
        echo json_encode(['success'=>true]);
        break;
    case 'toggle':
        $id=$data['id']??0;
        if(!$id){ echo json_encode(['success'=>false]); exit;}
        // toggle disabled
        $stmt=$pdo->prepare("UPDATE categories SET disabled=NOT disabled WHERE id=?");
        $stmt->execute([$id]);
        echo json_encode(['success'=>true]);
        break;
    default:
        echo json_encode(['success'=>false,'message'=>'Invalid action']);
}
