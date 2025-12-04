<?php
declare(strict_types=1);

require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_json(['success' => false, 'message' => 'Neveljavna metoda.'], 405);
}

$userId = require_auth();

$input = json_decode(file_get_contents('php://input'), true);

$location = trim($input['location'] ?? '');
$propertyType = trim($input['property_type'] ?? '');

$intOrNull = static function ($value): ?int {
    if ($value === null || $value === '') {
        return null;
    }
    return (int)$value;
};

$minPrice = $intOrNull($input['min_price'] ?? null);
$maxPrice = $intOrNull($input['max_price'] ?? null);
$minSqm = $intOrNull($input['min_sqm'] ?? null);
$maxSqm = $intOrNull($input['max_sqm'] ?? null);

$notifyEmail = !empty($input['notify_email']) ? 1 : 0;
$notifyTelegram = !empty($input['notify_telegram']) ? 1 : 0;
$isActive = !empty($input['is_active']) ? 1 : 0;

$now = date('Y-m-d H:i:s');

try {
    $pdo->beginTransaction();

    $existingStmt = $pdo->prepare('SELECT id FROM search_profiles WHERE user_id = :user_id LIMIT 1');
    $existingStmt->execute([':user_id' => $userId]);
    $existing = $existingStmt->fetch();

    if ($existing) {
        $update = $pdo->prepare('UPDATE search_profiles SET location = :location, min_price = :min_price, max_price = :max_price, min_sqm = :min_sqm, max_sqm = :max_sqm, property_type = :property_type, notify_email = :notify_email, notify_telegram = :notify_telegram, is_active = :is_active, updated_at = :updated_at WHERE id = :id');
        $update->execute([
            ':location' => $location !== '' ? $location : null,
            ':min_price' => $minPrice,
            ':max_price' => $maxPrice,
            ':min_sqm' => $minSqm,
            ':max_sqm' => $maxSqm,
            ':property_type' => $propertyType !== '' ? $propertyType : null,
            ':notify_email' => $notifyEmail,
            ':notify_telegram' => $notifyTelegram,
            ':is_active' => $isActive,
            ':updated_at' => $now,
            ':id' => $existing['id'],
        ]);
        $profileId = (int)$existing['id'];
    } else {
        $insert = $pdo->prepare('INSERT INTO search_profiles (user_id, location, min_price, max_price, min_sqm, max_sqm, property_type, notify_email, notify_telegram, is_active, created_at, updated_at) VALUES (:user_id, :location, :min_price, :max_price, :min_sqm, :max_sqm, :property_type, :notify_email, :notify_telegram, :is_active, :created_at, :updated_at)');
        $insert->execute([
            ':user_id' => $userId,
            ':location' => $location !== '' ? $location : null,
            ':min_price' => $minPrice,
            ':max_price' => $maxPrice,
            ':min_sqm' => $minSqm,
            ':max_sqm' => $maxSqm,
            ':property_type' => $propertyType !== '' ? $propertyType : null,
            ':notify_email' => $notifyEmail,
            ':notify_telegram' => $notifyTelegram,
            ':is_active' => $isActive,
            ':created_at' => $now,
            ':updated_at' => $now,
        ]);
        $profileId = (int)$pdo->lastInsertId();
    }

    $pdo->commit();

    $select = $pdo->prepare('SELECT * FROM search_profiles WHERE id = :id');
    $select->execute([':id' => $profileId]);
    $savedProfile = $select->fetch();

    send_json([
        'success' => true,
        'message' => 'Profil je shranjen.',
        'profile' => $savedProfile,
    ]);
} catch (PDOException $e) {
    $pdo->rollBack();
    send_json(['success' => false, 'message' => 'Napaka pri shranjevanju profila.'], 500);
}
