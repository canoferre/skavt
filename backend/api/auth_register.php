<?php
declare(strict_types=1);

require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_json(['success' => false, 'message' => 'Neveljavna metoda.'], 405);
}

$input = json_decode(file_get_contents('php://input'), true);
$email = trim($input['email'] ?? '');
$username = trim($input['username'] ?? '');
$password = $input['password'] ?? '';

if ($email === '' || $username === '' || $password === '') {
    send_json(['success' => false, 'message' => 'Vsa polja so obvezna.'], 400);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    send_json(['success' => false, 'message' => 'Vnesite veljaven e-poštni naslov.'], 400);
}

try {
    $stmt = $pdo->prepare('SELECT id FROM users WHERE email = :email OR username = :username LIMIT 1');
    $stmt->execute([':email' => $email, ':username' => $username]);
    $existing = $stmt->fetch();

    if ($existing) {
        send_json(['success' => false, 'message' => 'Uporabniško ime ali e-pošta že obstajata.'], 409);
    }

    $passwordHash = password_hash($password, PASSWORD_DEFAULT);
    $now = date('Y-m-d H:i:s');

    $insert = $pdo->prepare('INSERT INTO users (email, username, password_hash, created_at) VALUES (:email, :username, :password_hash, :created_at)');
    $insert->execute([
        ':email' => $email,
        ':username' => $username,
        ':password_hash' => $passwordHash,
        ':created_at' => $now,
    ]);

    send_json(['success' => true, 'message' => 'Registracija uspešna. Sedaj se lahko prijavite.'], 201);
} catch (PDOException $e) {
    send_json(['success' => false, 'message' => 'Prišlo je do napake pri registraciji.'], 500);
}
