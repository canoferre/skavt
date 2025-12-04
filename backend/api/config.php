<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

$dbHost = 'localhost';
$dbName = 'skavt_db';
$dbUser = 'db_user';
$dbPass = 'db_password';

try {
    $pdo = new PDO(
        "mysql:host={$dbHost};dbname={$dbName};charset=utf8mb4",
        $dbUser,
        $dbPass,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]
    );
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Napaka pri povezavi z bazo.']);
    exit;
}

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

function send_json($data, int $statusCode = 200): void
{
    http_response_code($statusCode);
    echo json_encode($data);
    exit;
}

function require_auth(): int
{
    if (!isset($_SESSION['user_id'])) {
        send_json(['success' => false, 'message' => 'Niste prijavljeni.'], 401);
    }

    return (int)$_SESSION['user_id'];
}
