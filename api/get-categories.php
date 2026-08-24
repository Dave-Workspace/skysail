<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once __DIR__.'/../config/db.php'; // defines $pdo

require_once __DIR__.'/../config/config.php';
require_once __DIR__.'/../lib/Security.php';

// CSRF check
Security::csrfCheck();

// Determine if admin or public
$isAdmin = isset($_SESSION['admin_id']);

// For public users, only show enabled categories
$where = $isAdmin ? "" : "WHERE disabled=0";

$stmt = $pdo->query("SELECT id, name, disabled FROM categories $where ORDER BY name");
$categories = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    'success' => true,
    'categories' => $categories
]);
