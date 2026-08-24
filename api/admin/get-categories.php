<?php

require_once 'security.php';
require_once 'admin-auth.php';

// Make sure $pdo exists
if (!isset($pdo)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection not found']);
    exit;
}

try {
    // Fetch all categories
    $stmt = $pdo->prepare("SELECT id, name, disabled, priority, created_at FROM categories ORDER BY priority ASC, name ASC");
    $stmt->execute();

    // Fetch results as associative array
    $categories = $stmt->fetchAll(); // PDO returns assoc arrays because of your db.php settings

    // Convert disabled to boolean for frontend
    $categories = array_map(function($c){
        $c['disabled'] = (bool)$c['disabled'];
        return $c;
    }, $categories);

    echo json_encode(['success' => true, 'categories' => $categories]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Query failed',
        'error' => $e->getMessage()
    ]);
}
