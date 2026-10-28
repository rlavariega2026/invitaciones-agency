<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, max-age=0');

function respond(int $status, array $payload): void {
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$storageDir = __DIR__ . '/data';

if (!is_dir($storageDir) && !mkdir($storageDir, 0750, true) && !is_dir($storageDir)) {
    respond(500, ['success' => false, 'error' => 'No se pudo preparar el almacenamiento de invitaciones.']);
}

if ($method === 'GET') {
    $slug = trim((string)($_GET['slug'] ?? ''));
    if ($slug === '' || !preg_match('/^[a-zA-Z0-9_-]{1,160}$/', $slug)) {
        respond(400, ['success' => false, 'error' => 'El enlace de invitación no es válido.']);
    }

    $file = $storageDir . '/' . hash('sha256', $slug) . '.json';
    if (!is_file($file)) {
        respond(404, ['success' => false, 'error' => 'No se encontró la invitación publicada.']);
    }

    $contents = file_get_contents($file);
    $invitation = is_string($contents) ? json_decode($contents, true) : null;
    if (!is_array($invitation)) {
        respond(500, ['success' => false, 'error' => 'Los datos de esta invitación no se pudieron leer.']);
    }
    respond(200, ['success' => true, 'invitation' => $invitation]);
}

if ($method === 'POST') {
    $raw = file_get_contents('php://input');
    if (!is_string($raw) || $raw === '') {
        respond(400, ['success' => false, 'error' => 'No se recibieron datos de la invitación.']);
    }
    if (strlen($raw) > 12 * 1024 * 1024) {
        respond(413, ['success' => false, 'error' => 'La invitación supera el límite de 12 MB. Reduce el tamaño de las imágenes.']);
    }

    $invitation = json_decode($raw, true);
    if (!is_array($invitation)) {
        respond(400, ['success' => false, 'error' => 'Los datos recibidos no son JSON válido.']);
    }

    $slug = trim((string)($invitation['slug'] ?? ''));
    if ($slug === '' || !preg_match('/^[a-zA-Z0-9_-]{1,160}$/', $slug)) {
        respond(400, ['success' => false, 'error' => 'El identificador de la invitación no es válido.']);
    }

    $file = $storageDir . '/' . hash('sha256', $slug) . '.json';
    $encoded = json_encode($invitation, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if (!is_string($encoded)) {
        respond(400, ['success' => false, 'error' => 'No fue posible procesar los datos de la invitación.']);
    }

    $written = file_put_contents($file, $encoded, LOCK_EX);
    if ($written === false) {
        respond(500, ['success' => false, 'error' => 'Hostinger no permitió guardar la invitación. Revisa los permisos de escritura de api/data.']);
    }

    respond(200, ['success' => true, 'slug' => $slug]);
}

header('Allow: GET, POST');
respond(405, ['success' => false, 'error' => 'Método no permitido.']);
