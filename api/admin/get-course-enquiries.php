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
    // Prepare and execute the query
    $stmt = $pdo->prepare("SELECT id, name, contact, email, level, field, program, province, city, notes, created_at, status FROM course_enquiries ORDER BY created_at DESC");
    $stmt->execute();

    // Fetch all results as associative array
    $enquiries = $stmt->fetchAll(); // PDO default fetch mode is associative array

    echo json_encode(['success' => true, 'enquiries' => $enquiries]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Query failed',
        'error' => $e->getMessage()
    ]);
}
