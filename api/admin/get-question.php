<?php
if (session_status() === PHP_SESSION_NONE) session_start();

//header('Content-Type: application/json');

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../lib/Security.php';

// ✅ Admin only
if (!isset($_SESSION['admin_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

// ❌ NO CSRF FOR GET
// Security::csrfCheck();

// ✅ Validate ID
$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
if ($id <= 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid question ID']);
    exit;
}

try {
    $stmt = $pdo->prepare("
    SELECT p.id, p.title, p.content, p.status, p.disabled,
           GROUP_CONCAT(c.id) AS category_ids,
           a.content AS answer
    FROM posts p
    LEFT JOIN post_categories pc ON p.id = pc.post_id
    LEFT JOIN categories c ON pc.category_id = c.id
    LEFT JOIN answers a ON p.id = a.post_id
    WHERE p.id = ?
    GROUP BY p.id
    LIMIT 1
");
$stmt->execute([$id]);
$q = $stmt->fetch();

$q['categories'] = $q['category_ids']
    ? array_map('intval', explode(',', $q['category_ids']))
    : [];

$q['published'] = ($q['status'] === 'published');

$cats = $pdo->query("SELECT id,name FROM categories WHERE disabled=0")->fetchAll();

echo json_encode([
    'success'=>true,
    'question'=>$q,
    'categories'=>$cats
]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error',
        'error'   => $e->getMessage()
    ]);
}
