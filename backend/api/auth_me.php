<?php
declare(strict_types=1);

require_once __DIR__ . '/config.php';

if (!isset($_SESSION['user_id'])) {
    send_json(['success' => false, 'message' => 'Ni prijavljenega uporabnika.'], 401);
}

try {
    $stmt = $pdo->prepare('SELECT id, email, username FROM users WHERE id = :id LIMIT 1');
    $stmt->execute([':id' => $_SESSION['user_id']]);
    $user = $stmt->fetch();

    if (!$user) {
        send_json(['success' => false, 'message' => 'Uporabnik ni najden.'], 404);
    }

    send_json([
        'success' => true,
        'user' => [
            'id' => (int)$user['id'],
            'email' => $user['email'],
            'username' => $user['username'],
        ],
    ]);
} catch (PDOException $e) {
    send_json(['success' => false, 'message' => 'Napaka pri nalaganju uporabnika.'], 500);
}
