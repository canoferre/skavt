<?php
declare(strict_types=1);

require_once __DIR__ . '/config.php';

$userId = require_auth();

// Load user's first profile
$profileStmt = $pdo->prepare('SELECT * FROM search_profiles WHERE user_id = :uid ORDER BY id ASC LIMIT 1');
$profileStmt->execute([':uid' => $userId]);
$profile = $profileStmt->fetch();

if (!$profile) {
    send_json(['success' => true, 'listings' => []]);
}

$where = [];
$params = [];

if (!empty($profile['location'])) {
    $where[] = '(city LIKE :loc OR district LIKE :loc OR location LIKE :loc)';
    $params[':loc'] = '%' . $profile['location'] . '%';
}

if (!empty($profile['min_price'])) {
    $where[] = 'price_eur >= :min_price';
    $params[':min_price'] = (int)$profile['min_price'];
}

if (!empty($profile['max_price'])) {
    $where[] = 'price_eur <= :max_price';
    $params[':max_price'] = (int)$profile['max_price'];
}

if (!empty($profile['min_sqm'])) {
    $where[] = 'size_m2 >= :min_sqm';
    $params[':min_sqm'] = (int)$profile['min_sqm'];
}

if (!empty($profile['max_sqm'])) {
    $where[] = 'size_m2 <= :max_sqm';
    $params[':max_sqm'] = (int)$profile['max_sqm'];
}

$whereSql = $where ? ('WHERE ' . implode(' AND ', $where)) : '';
$limit = 50;

$sql = "SELECT id, source, listing_id, title, location, city, district, price_eur, size_m2, url, first_seen
        FROM listings
        $whereSql
        ORDER BY first_seen DESC
        LIMIT $limit";

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$rows = $stmt->fetchAll();

send_json(['success' => true, 'listings' => $rows]);
