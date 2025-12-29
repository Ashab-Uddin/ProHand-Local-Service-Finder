<?php
include("../config/db.php");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["status" => "error", "message" => "Invalid Method"]);
    exit;
}

$name = trim($_POST['name']);
$email = trim($_POST['email']);
$phone = trim($_POST['phone']);
$category = trim($_POST['category']);
$address = trim($_POST['address']);
$password = $_POST['password'];

// Basic Validation
if (empty($name) || empty($email) || empty($password) || empty($category)) {
    echo json_encode(["status" => "error", "message" => "All fields required"]);
    exit;
}

// Check Email
$check = $conn->prepare("SELECT id FROM users WHERE email = ?");
$check->bind_param("s", $email);
$check->execute();
if ($check->get_result()->num_rows > 0) {
    echo json_encode(["status" => "error", "message" => "Email already registered"]);
    exit;
}

// Register
$hash = password_hash($password, PASSWORD_DEFAULT);
$role = 'provider';

$stmt = $conn->prepare("INSERT INTO users (name, email, password, phone, address, service_category, role, is_verified) VALUES (?, ?, ?, ?, ?, ?, ?, 0)");
$stmt->bind_param("sssssss", $name, $email, $hash, $phone, $address, $category, $role);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Registration successful! Request pending approval."]);
} else {
    echo json_encode(["status" => "error", "message" => "DB Error: " . $conn->error]);
}
?>
