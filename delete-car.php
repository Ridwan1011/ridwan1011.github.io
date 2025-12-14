<?php
header('Content-Type: application/json');

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['success' => false, 'message' => 'POST required']);
  exit;
}

// Read JSON body
$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

$id = isset($data['id']) ? (int)$data['id'] : 0;
$ownerEmail = isset($data['ownerEmail']) ? trim($data['ownerEmail']) : '';

if ($id <= 0 || $ownerEmail === '') {
  http_response_code(400);
  echo json_encode(['success' => false, 'message' => 'Missing id or ownerEmail']);
  exit;
}

// ---- DB CONFIG (same as save-car.php / get-cars.php) ----
$DB_HOST = 'localhost';
$DB_NAME = 'vehiwzrt_mycars_db';
$DB_USER = 'vehiwzrt_rid1';
$DB_PASS = 'hRR6%Rj#S8a8';   // <-- keep this matching your other files
// --------------------------------------------------------

try {
  $pdo = new PDO(
    "mysql:host=$DB_HOST;dbname=$DB_NAME;charset=utf8mb4",
    $DB_USER,
    $DB_PASS,
    [ PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION ]
  );
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(['success' => false, 'message' => 'Database connection failed']);
  exit;
}

// Delete only if this row belongs to this owner
$stmt = $pdo->prepare("DELETE FROM cars WHERE id = ? AND owner_email = ?");
$stmt->execute([$id, $ownerEmail]);

if ($stmt->rowCount() === 0) {
  http_response_code(403);
  echo json_encode([
    'success' => false,
    'message' => 'Car not found or you are not allowed to delete it.'
  ]);
  exit;
}

echo json_encode(['success' => true]);
