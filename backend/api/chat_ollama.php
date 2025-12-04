<?php
declare(strict_types=1);

require_once __DIR__ . '/config.php';

$userId = require_auth();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_json(['success' => false, 'message' => 'Neveljavna metoda.'], 405);
}

$payload = json_decode(file_get_contents('php://input'), true);
$question = trim($payload['question'] ?? '');

if ($question === '') {
    send_json(['success' => false, 'message' => 'Vnesite vprašanje.'], 400);
}

// Naložimo uporabnikov profil za kontekst
$profileStmt = $pdo->prepare('SELECT * FROM search_profiles WHERE user_id = :uid ORDER BY id ASC LIMIT 1');
$profileStmt->execute([':uid' => $userId]);
$profile = $profileStmt->fetch();

// Enaki filtri kot pri listings_search
$where = [];
$params = [];
if ($profile) {
    if (!empty($profile['location'])) {
        $where[] = '(city LIKE :loc OR district LIKE :loc OR location LIKE :loc)';
        $params[':loc'] = '%' . $profile['location'] . '%';
    }
    if (!empty($profile['min_price'])) {
        $where[] = '(price_eur IS NULL OR price_eur >= :min_price)';
        $params[':min_price'] = (int)$profile['min_price'];
    }
    if (!empty($profile['max_price'])) {
        $where[] = '(price_eur IS NULL OR price_eur <= :max_price)';
        $params[':max_price'] = (int)$profile['max_price'];
    }
    if (!empty($profile['min_sqm'])) {
        $where[] = '(size_m2 IS NULL OR size_m2 >= :min_sqm)';
        $params[':min_sqm'] = (int)$profile['min_sqm'];
    }
    if (!empty($profile['max_sqm'])) {
        $where[] = '(size_m2 IS NULL OR size_m2 <= :max_sqm)';
        $params[':max_sqm'] = (int)$profile['max_sqm'];
    }
}
$whereSql = $where ? ('WHERE ' . implode(' AND ', $where)) : '';

$sql = "SELECT title, city, district, location, price_eur, size_m2, url, first_seen
        FROM listings
        $whereSql
        ORDER BY first_seen DESC
        LIMIT 20";
$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$listings = $stmt->fetchAll();

$profileText = $profile ? sprintf(
    "Profil: lokacija=%s, cena=%s-%s, kvadratura=%s-%s, tip=%s.",
    $profile['location'] ?: 'ni podano',
    $profile['min_price'] ?: 'ni',
    $profile['max_price'] ?: 'ni',
    $profile['min_sqm'] ?: 'ni',
    $profile['max_sqm'] ?: 'ni',
    $profile['property_type'] ?: 'ni'
) : 'Profil ni nastavljen.';

$lines = [];
foreach ($listings as $row) {
    $lines[] = sprintf(
        "- %s | lokacija: %s | cena: %s | m2: %s | url: %s",
        $row['title'] ?: 'Oglas',
        $row['city'] ?: ($row['district'] ?: ($row['location'] ?: 'neznano')),
        $row['price_eur'] !== null ? ($row['price_eur'] . ' EUR') : 'ni cene',
        $row['size_m2'] !== null ? $row['size_m2'] . ' m2' : 'ni m2',
        $row['url'] ?: ''
    );
}
$listingsText = $lines ? implode("\n", $lines) : 'Ni ujemajočih se oglasov.';

// Ollama endpoint (lokalno privzeto)
$ollamaUrl = getenv('OLLAMA_URL') ?: 'http://localhost:11434/api/chat';
$model = getenv('OLLAMA_MODEL') ?: 'llama3';

$prompt = "Odgovarjaj v slovenščini. Povzemi ali svetuj na kratko glede oglasov.\n"
    . $profileText . "\n"
    . "Oglasi (do 20):\n" . $listingsText . "\n"
    . "Vprašanje: " . $question;

$body = json_encode([
    'model' => $model,
    'messages' => [
        ['role' => 'system', 'content' => 'Ti si pomočnik za nepremičnine. Uporabi samo podane oglase in profil. Odgovori kratko, v slovenščini.'],
        ['role' => 'user', 'content' => $prompt],
    ],
    'stream' => false,
]);

$ch = curl_init($ollamaUrl);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json',
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 20);

$response = curl_exec($ch);
if ($response === false) {
    send_json(['success' => false, 'message' => 'Ollama ni dosegljiv.'], 502);
}

$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

$decoded = json_decode($response, true);

if ($httpCode >= 400 || !$decoded) {
    send_json(['success' => false, 'message' => 'Napaka pri klicu Ollama.'], 502);
}

$answer = $decoded['message']['content'] ?? '';

send_json([
    'success' => true,
    'answer' => $answer,
]);
