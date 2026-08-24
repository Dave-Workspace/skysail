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
//     $stmt = $pdo->prepare("
//     SELECT p.id, p.title, p.content,
//            p.status,
//            p.disabled,
//            GROUP_CONCAT(DISTINCT c.id) AS category_ids,
//            GROUP_CONCAT(DISTINCT c.name SEPARATOR ', ') AS category_names,
//            a.content AS answer
//     FROM posts p
//     LEFT JOIN post_categories pc ON p.id = pc.post_id
//     LEFT JOIN categories c ON pc.category_id = c.id
//     LEFT JOIN answers a ON p.id = a.post_id
//     GROUP BY p.id
//     ORDER BY p.created_at DESC
// ");

$stmt = $pdo->prepare("
    SELECT p.id, p.title, p.content,
           p.status,
           p.disabled,
    COALESCE(GROUP_CONCAT(DISTINCT c.id), '') AS category_ids,
    COALESCE(GROUP_CONCAT(DISTINCT c.name SEPARATOR ', '), 'Uncategorized') AS category_names,
    COALESCE(a.content, '') AS answer,
    COALESCE(MAX(pc.priority), 9999) AS priority
    
    FROM posts p
    LEFT JOIN post_categories pc ON p.id = pc.post_id
    LEFT JOIN categories c ON pc.category_id = c.id
    LEFT JOIN answers a ON p.id = a.post_id
    GROUP BY p.id
    ORDER BY priority ASC, p.created_at DESC
");

    $stmt->execute();
    //$questions = $stmt->fetchAll();
    $allQuestions = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Separate posts by category and uncategorized
    $questionsByCategory = [];
    $uncategorized = [];

    foreach ($allQuestions as $q) {
        if ($q['category_ids'] === '') {
            $uncategorized[] = $q;
        } else {
            $categoryIds = explode(',', $q['category_ids']);
            foreach ($categoryIds as $catId) {
                $questionsByCategory[$catId][] = $q;
            }
        }
    }

//     // Normalize for frontend
//     $questions = array_map(function ($q) {
//     $q['published'] = ($q['status'] === 'published');
//     $q['categories'] = $q['category_ids']
//         ? array_map('intval', explode(',', $q['category_ids']))
//         : [];
//     return $q;
// }, $questions);

    foreach ($allQuestions as &$q) {
        $q['published'] = ($q['status'] === 'published');
        $q['categories'] = $q['category_ids']
            ? array_map('intval', explode(',', $q['category_ids']))
            : [];
    }
    unset($q);

    $catStmt = $pdo->prepare("SELECT id, name FROM categories WHERE disabled = 0 ORDER BY name ASC");
    $catStmt->execute();
    $categories = $catStmt->fetchAll();

    echo json_encode([
        'success' => true,
        'questions' => $allQuestions,
        'questionsByCategory' => $questionsByCategory,
        'uncategorized' => $uncategorized,
        'categories' => $categories
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Query failed',
        'error' => $e->getMessage()
    ]);
}
