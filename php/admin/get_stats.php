<?php
include("../../config/db.php");
header('Content-Type: application/json');

$response = [
    "users" => [],
    "providers" => [],
    "bookings" => []
];

// 1. All Users (Customers)
$res = $conn->query("SELECT id, name, email FROM users WHERE role='customer'");
while($r = $res->fetch_assoc()) $response['users'][] = $r;

// 2. All Providers
$res = $conn->query("SELECT id, name, email, service_category, is_verified FROM users WHERE role='provider'");
while($r = $res->fetch_assoc()) $response['providers'][] = $r;

// 3. All Bookings
$res = $conn->query("SELECT b.id, b.status, b.booking_date, u.name as customer, s.title as service 
                     FROM bookings b 
                     JOIN users u ON b.user_id = u.id 
                     JOIN services s ON b.service_id = s.id
                     ORDER BY b.id DESC");
while($r = $res->fetch_assoc()) $response['bookings'][] = $r;

echo json_encode($response);
?>
