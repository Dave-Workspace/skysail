<?php
require_once __DIR__.'/../../config/db.php';

/*
 Order:
 1. Categorized posts first
 2. Category name
 3. post_categories.priority
 4. created_at
*/

$stmt = $pdo->prepare("
    SELECT 
        p.id,
        p.title,
        p.content,

        c.id   AS category_id,
        c.name AS category_name,
        c.priority AS category_priority,   -- ← new

        pc.priority AS priority,

        a.content AS answer

    FROM posts p
    LEFT JOIN post_categories pc ON pc.post_id = p.id
    LEFT JOIN categories c ON c.id = pc.category_id AND c.disabled = 0
    LEFT JOIN answers a ON a.post_id = p.id

    WHERE p.status = 'published'
      AND p.disabled = 0

    ORDER BY
        CASE WHEN c.id IS NULL THEN 1 ELSE 0 END,  -- Uncategorized last
        c.priority ASC,                            -- ← sort by category priority
        pc.priority ASC,
        p.created_at DESC
");

$stmt->execute();
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

/* -------- GROUP POSTS -------- */

$posts = [];
$uncategorized = [];

foreach ($rows as $r) {
    $id = $r['id'];

    if (!isset($posts[$id])) {
        $posts[$id] = [
            'id'         => $id,
            'title'      => $r['title'],
            'content'    => $r['content'],
            'categories' => [],
            'answers'    => [],
            '_hasAnswer' => false   // 👈 internal flag
        ];
    }

    // Category
    if ($r['category_id']) {
        $posts[$id]['categories'][] = [
            'id'       => (int)$r['category_id'],
            'name'     => $r['category_name'],
            'priority' => (int)($r['priority'] ?? 9999),
             'catPriority' => (int)($r['category_priority'] ?? 9999) // category priority
        ];
    }

    // Answer
    if ($r['answer'] && !$posts[$id]['_hasAnswer']) {
        $posts[$id]['answers'][] = [
            'content' => $r['answer']
        ];
        $posts[$id]['_hasAnswer'] = true;
    }
}

/* Remove internal flag before output */
foreach ($posts as &$p) {
    unset($p['_hasAnswer']);
}

/* -------- FINAL OUTPUT -------- */

echo json_encode([
    'success' => true,
    'posts'   => array_values($posts)
]);
