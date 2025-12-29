<?php
include("../config/db.php");

header('Content-Type: application/json');

$email = isset($_GET['email']) ? trim($_GET['email']) : '';

if ($email === '') {
    echo json_encode(["error" => "No email provided"]);
    exit;
}

// 1. Get User ID from email
$userQuery = mysqli_prepare($conn, "SELECT id FROM users WHERE email = ?");
mysqli_stmt_bind_param($userQuery, "s", $email);
mysqli_stmt_execute($userQuery);
$userResult = mysqli_stmt_get_result($userQuery);
$user = mysqli_fetch_assoc($userResult);

if (!$user) {
    echo json_encode([]);
    exit;
}

$user_id = $user['id'];

// 2. Get Bookings joined with Services
$sql = "SELECT b.id as booking_id, b.status, b.offered_price, s.title, s.price as original_price, s.thumbnail, s.provider_name 
        FROM bookings b 
        JOIN services s ON b.service_id = s.id 
        WHERE b.user_id = ? 
        ORDER BY b.id ASC";

$stmt = mysqli_prepare($conn, $sql);
mysqli_stmt_bind_param($stmt, "i", $user_id);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

$bookings = [];
while ($row = mysqli_fetch_assoc($result)) {
    $bookings[] = $row;
}

echo json_encode($bookings);
?>
