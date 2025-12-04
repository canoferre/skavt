<?php
declare(strict_types=1);

require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_json(['success' => false, 'message' => 'Neveljavna metoda.'], 405);
}

$input = json_decode(file_get_contents('php://input'), true);
$identifier = trim($input['identifier'] ?? '');
$password = $input['password'] ?? '';

if ($identifier === '' || $password === '') {
    send_json(['success' => false, 'message' => 'Vnesite e-pošto/uporabniško ime in geslo.'], 400);
}

try {
    $stmt = $pdo->prepare('SELECT id, email, username, password_hash FROM users WHERE email = :id OR username = :id LIMIT 1');
    $stmt->execute([':id' => $identifier]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password_hash'])) {
        send_json(['success' => false, 'message' => 'Napačni podatki za prijavo.'], 401);
    }

    $_SESSION['user_id'] = (int)$user['id'];

    send_json([
        'success' => true,
        'user' => [
            'id' => (int)$user['id'],
            'email' => $user['email'],
            'username' => $user['username'],
        ],
        'message' => 'Prijava uspešna.',
    ]);
} catch (PDOException $e) {
    send_json(['success' => false, 'message' => 'Napaka pri prijavi.'], 500);
}
