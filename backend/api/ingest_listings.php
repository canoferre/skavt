<?php
declare(strict_types=1);

// PHP API endpoint for ingesting listings from Python scraper
header('Content-Type: application/json; charset=utf-8');

// Basic API key guard
$API_KEY = 'TAJNI_KLJUC'; // uskladi z nastavitvijo v Pythonu
$hdrKey = $_SERVER['HTTP_X_API_KEY'] ?? null;

if ($hdrKey !== $API_KEY) {
    http_response_code(401);
    echo json_encode(['ok' => false, 'error' => 'Unauthorized']);
    exit;
}

require __DIR__ . '/db.php';

// Read JSON body
$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Invalid JSON']);
    exit;
}

$inserted = 0;
$skipped = 0;

$sql = "
    INSERT INTO listings
        (source, listing_id, title, location, city, district,
         price_eur, size_m2, url, first_seen)
    VALUES
        (:source, :listing_id, :title, :location, :city, :district,
         :price_eur, :size_m2, :url, :first_seen)
    ON DUPLICATE KEY UPDATE
        title = VALUES(title),
        location = VALUES(location),
        city = VALUES(city),
        district = VALUES(district),
        price_eur = VALUES(price_eur),
        size_m2 = VALUES(size_m2),
        url = VALUES(url)
";

$stmt = $pdo->prepare($sql);

foreach ($data as $ad) {
    if (!isset($ad['source'], $ad['listing_id'], $ad['url'], $ad['first_seen'])) {
        $skipped++;
        continue;
    }

    $stmt->execute([
        ':source' => $ad['source'],
        ':listing_id' => $ad['listing_id'],
        ':title' => $ad['title'] ?? null,
        ':location' => $ad['location'] ?? null,
        ':city' => $ad['city'] ?? null,
        ':district' => $ad['district'] ?? null,
        ':price_eur' => $ad['price_eur'] ?? null,
        ':size_m2' => $ad['size_m2'] ?? null,
        ':url' => $ad['url'],
        ':first_seen' => $ad['first_seen'],
    ]);

    $inserted++;
}

echo json_encode([
    'ok' => true,
    'inserted' => $inserted,
    'skipped' => $skipped,
]);
