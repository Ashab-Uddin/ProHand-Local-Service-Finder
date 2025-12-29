<?php
include("../config/db.php");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    exit;
}

$email = trim($_POST['email']);
$password = $_POST['password'];
// Optional: restrict to specific roles if needed, e.g. $_POST['login_type']

$stmt = $conn->prepare("SELECT id, name, password, role, is_verified FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$res = $stmt->get_result();
$user = $res->fetch_assoc();

if ($user && password_verify($password, $user['password'])) {
    if ($user['role'] == 'provider' && $user['is_verified'] == 0) {
        echo json_encode(["status" => "error", "message" => "Account pending admin approval."]);
        exit;
    }
    
    // Success
    echo json_encode([
        "status" => "success",
        "user" => [
            "id" => $user['id'],
            "name" => $user['name'],
            "email" => $email,
            "role" => $user['role']
        ]
    ]);
} else {
    echo json_encode(["status" => "error", "message" => "Invalid credentials"]);
}
?>
