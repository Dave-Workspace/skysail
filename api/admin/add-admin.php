<?php
require_once 'security.php';
require_once 'admin-auth.php';

// Get JSON input
$data = json_decode(file_get_contents('php://input'), true);
$name = trim($data['name'] ?? '');
$email = trim($data['email'] ?? '');
$password = $data['password'] ?? '';

if (!$name || !$email || !$password) {
    echo json_encode(['success' => false, 'message' => 'All fields required']);
    exit;
}

try {
    // Check if email already exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => false, 'message' => 'Email already exists']);
        exit;
    }

    // Insert new admin
    $hash = password_hash($password, PASSWORD_DEFAULT);
    $insertStmt = $pdo->prepare("
        INSERT INTO users (name, email, password, is_admin, is_verified, created_at)
        VALUES (?, ?, ?, 1, 1, NOW())
    ");
    $insertStmt->execute([$name, $email, $hash]);

    echo json_encode(['success' => true, 'message' => 'Admin added']);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error',
        'error' => $e->getMessage()
    ]);
}
