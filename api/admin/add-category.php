<?php
require_once 'security.php';
require_once 'admin-auth.php';
$data = json_decode(file_get_contents('php://input'), true);
$name = trim($data['name'] ?? '');
$disabled = isset($data['disabled']) ? (int)$data['disabled'] : 0;

if (!$name) {
    echo json_encode(['success' => false, 'message' => 'Name required']);    
    exit;
}

// Check duplicate category
$stmt = $pdo->prepare("SELECT id FROM categories WHERE name = ?");
$stmt->execute([$name]);

if ($stmt->fetch()) {
    echo json_encode(['success' => false, 'message' => 'Category already exists']);
    exit;
}

// Insert category
$stmt = $pdo->prepare("INSERT INTO categories (name, disabled) VALUES (?, 0)");
$stmt->execute([$name]);

echo json_encode(['success' => true, 'message' => 'Category added']);

