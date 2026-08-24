<?php
session_start();

require_once __DIR__.'/config/db.php'; // Adjust path if needed

header('Content-Type: application/json; charset=utf-8');

try {
    // Test query
    $stmt = $pdo->query("SELECT NOW() AS current_time");
    $row = $stmt->fetch();
    echo json_encode([
        'success' => true,
        'message' => 'Database connection works!',
        'server_time' => $row['current_time']
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database connection failed',
        'error' => $e->getMessage()
    ]);
}
