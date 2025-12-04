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

// Ollama endpoint (lokalno privzeto)
$ollamaUrl = getenv('OLLAMA_URL') ?: 'http://localhost:11434/api/chat';
$model = getenv('OLLAMA_MODEL') ?: 'llama3';

$body = json_encode([
    'model' => $model,
    'messages' => [
        ['role' => 'system', 'content' => 'Odgovarjaj v slovenščini. Ti si pomočnik, ki pozna nepremičnine.'],
        ['role' => 'user', 'content' => $question],
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
