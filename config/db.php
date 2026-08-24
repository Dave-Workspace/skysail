<?php
// config/db.php

define('DB_HOST', 'localhost');
define('DB_NAME', 'CanDiscussionBoard');
define('DB_USER', 'CanWebUser');
define('DB_PASS', 'Idontknow*05');



try {
    $pdo = new PDO(
        "mysql:host=".DB_HOST.";dbname=".DB_NAME.";charset=utf8mb4",
        DB_USER,
        DB_PASS,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]
    );
} catch (PDOException $e) {
    // Return JSON error instead of plain text
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'success' => false,
        'message' => 'Database connection failed',
        'error' => $e->getMessage() // optional for debugging
    ]);
    exit;
}
