<?php
header('Content-Type: application/json');

// ---- DB CONFIG: same as save-car.php ----
$DB_HOST = 'localhost';
$DB_NAME = 'vehiwzrt_mycars_db';
$DB_USER = 'vehiwzrt_rid1';
$DB_PASS = 'hRR6%Rj#S8a8';
// ----------------------------------------

try {
  $pdo = new PDO(
    "mysql:host=$DB_HOST;dbname=$DB_NAME;charset=utf8mb4",
    $DB_USER,
    $DB_PASS,
    [ PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION ]
  );
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(['success' => false, 'message' => 'DB connection failed']);
  exit;
}

$stmt = $pdo->query("SELECT * FROM cars ORDER BY created_at DESC");
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

// just return raw rows; we’ll map them in JS
echo json_encode($rows);
