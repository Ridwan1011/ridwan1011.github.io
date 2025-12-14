<?php
// save-car.php
header('Content-Type: application/json');

// ---------------- DB CONFIG ----------------
$DB_HOST = 'localhost';
$DB_NAME = 'vehiwzrt_mycars_db';
$DB_USER = 'vehiwzrt_rid1';
$DB_PASS = 'hRR6%Rj#S8a8';
// -------------------------------------------

try {
  $pdo = new PDO(
    "mysql:host=$DB_HOST;dbname=$DB_NAME;charset=utf8mb4",
    $DB_USER,
    $DB_PASS,
    [ PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION ]
  );
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode([
    'success' => false,
    'message' => 'Database connection failed'
  ]);
  exit;
}

// helper for required POST fields
function required($key) {
  if (!isset($_POST[$key]) || trim($_POST[$key]) === '') {
    throw new Exception("Missing field: $key");
  }
  return trim($_POST[$key]);
}

try {
  // -------- basic fields --------
  $brand       = required('brand');
  $model       = required('model');
  $year        = (int) required('year');
  $horsepower  = (int) required('horsepower');
  $topSpeedMph = (int) required('topSpeedMph');
  $description = required('description');

  $longDesc    = isset($_POST['long'])  ? trim($_POST['long'])  : '';
  $factsText   = isset($_POST['facts']) ? trim($_POST['facts']) : '';
  $videoUrl    = isset($_POST['video']) ? trim($_POST['video']) : '';

  // NEW: owner info (may be null)
  $ownerEmail  = isset($_POST['ownerEmail']) ? trim($_POST['ownerEmail']) : null;
  $ownerName   = isset($_POST['ownerName'])  ? trim($_POST['ownerName'])  : null;

  // -------- file uploads --------
  $uploadDir  = __DIR__ . '/uploads/';
  $publicBase = 'uploads/';

  if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
  }

  function handleUpload($fieldName, $uploadDir, $publicBase) {
    if (!isset($_FILES[$fieldName]) ||
        $_FILES[$fieldName]['error'] !== UPLOAD_ERR_OK) {
      return null;
    }

    $tmpName = $_FILES[$fieldName]['tmp_name'];
    $orig    = basename($_FILES[$fieldName]['name']);
    $ext     = pathinfo($orig, PATHINFO_EXTENSION);
    $safe    = uniqid($fieldName . '_', true) . '.' . $ext;
    $dest    = $uploadDir . $safe;

    if (!move_uploaded_file($tmpName, $dest)) {
      throw new Exception("Failed to move uploaded file: $fieldName");
    }

    // this is the path stored in DB and used in <img src="">
    return $publicBase . $safe;
  }

  $imageUrl     = handleUpload('imageFile',     $uploadDir, $publicBase);
  $brandLogoUrl = handleUpload('brandLogoFile', $uploadDir, $publicBase);

  if (!$imageUrl) {
    throw new Exception('Main image is required.');
  }

  // -------- insert row (13 columns, 13 values) --------
  $stmt = $pdo->prepare("
    INSERT INTO cars (
      brand, model, year, horsepower, top_speed_mph,
      description, image_url, brand_logo_url,
      long_desc, facts, video_url, owner_email, owner_name
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  ");

  $stmt->execute([
    $brand,
    $model,
    $year,
    $horsepower,
    $topSpeedMph,
    $description,
    $imageUrl,
    $brandLogoUrl,
    $longDesc,
    $factsText,
    $videoUrl,
    $ownerEmail,
    $ownerName
  ]);

  echo json_encode([
    'success' => true,
    'id'      => $pdo->lastInsertId()
  ]);
} catch (Exception $e) {
  http_response_code(400);
  echo json_encode([
    'success' => false,
    'message' => $e->getMessage()
  ]);
}
