<?php
declare(strict_types=1);

require_once __DIR__ . '/config.php';

$userId = require_auth();

try {
    $stmt = $pdo->prepare('SELECT * FROM search_profiles WHERE user_id = :user_id ORDER BY id ASC LIMIT 1');
    $stmt->execute([':user_id' => $userId]);
    $profile = $stmt->fetch();

    if (!$profile) {
        send_json(['success' => true, 'profile' => null]);
    }

    send_json(['success' => true, 'profile' => $profile]);
} catch (PDOException $e) {
    send_json(['success' => false, 'message' => 'Napaka pri nalaganju profila.'], 500);
}
