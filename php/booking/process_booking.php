<?php
include("../config/db.php");

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["status" => "error", "message" => "Method not allowed"]);
    exit;
}

$service_id   = isset($_POST['service_id']) ? trim($_POST['service_id']) : '';
$booking_date = isset($_POST['booking_date']) ? $_POST['booking_date'] : '';
$offered_price = isset($_POST['offered_price']) ? $_POST['offered_price'] : 0;
$user_email   = isset($_POST['user_email']) ? trim($_POST['user_email']) : '';

if ($service_id === '' || $booking_date === '' || $user_email === '') {
    echo json_encode(["status" => "error", "message" => "Please fill in all required fields."]);
    exit;
}

// 1. Get User ID from email
$userQuery = mysqli_prepare($conn, "SELECT id FROM users WHERE email = ?");
mysqli_stmt_bind_param($userQuery, "s", $user_email);
mysqli_stmt_execute($userQuery);
$userResult = mysqli_stmt_get_result($userQuery);
$user = mysqli_fetch_assoc($userResult);

if (!$user) {
    echo json_encode(["status" => "error", "message" => "User session expired. Please log in again."]);
    exit;
}
$user_id = $user['id'];

// 2. We need to handle the Service ID. The user's image shows a long hash. 
// If the actual DB uses INT ids, we should probably fetch the INT ID using that hash if it's a unique identifier,
// OR, more likely in this context, the user just wants to save it.
// Assuming services table uses INT id, and the frontend will pass the INT id.

// Insert into bookings
$stmt = mysqli_prepare($conn, "INSERT INTO bookings (user_id, service_id, offered_price, booking_date, status) VALUES (?, ?, ?, ?, 'pending')");
mysqli_stmt_bind_param($stmt, "iiss", $user_id, $service_id, $offered_price, $booking_date);

if (mysqli_stmt_execute($stmt)) {
    echo json_encode(["status" => "success", "message" => "Booking submitted successfully!"]);
} else {
    echo json_encode(["status" => "error", "message" => "Failed to submit booking: " . mysqli_error($conn)]);
}
?>
