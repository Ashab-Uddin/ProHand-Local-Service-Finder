<?php
session_start();
include("../config/db.php");

// Expecting POST fields: service_id, scheduled_date (YYYY-MM-DD or datetime), optional note
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo "Method not allowed";
    exit;
}

// Use logged-in user if available, otherwise allow explicit user_id from POST
$user_id = isset($_SESSION['user_id']) ? (int)$_SESSION['user_id'] : 0;
if ($user_id === 0 && isset($_POST['user_id'])) {
    $user_id = (int)$_POST['user_id'];
}

$service_id     = isset($_POST['service_id']) ? (int)$_POST['service_id'] : 0;
$scheduled_date = isset($_POST['scheduled_date']) ? trim($_POST['scheduled_date']) : '';
$note           = isset($_POST['note']) ? trim($_POST['note']) : null;

if ($user_id === 0 || $service_id === 0 || $scheduled_date === '') {
    http_response_code(400);
    echo "Missing required fields";
    exit;
}

$stmt = mysqli_prepare(
    $conn,
    "INSERT INTO bookings (user_id, service_id, scheduled_date, note, status) VALUES (?, ?, ?, ?, 'pending')"
);

if (!$stmt) {
    http_response_code(500);
    echo "Failed to prepare statement";
    exit;
}

mysqli_stmt_bind_param($stmt, "iiss", $user_id, $service_id, $scheduled_date, $note);

if (mysqli_stmt_execute($stmt)) {
    echo "Booking successful";
} else {
    http_response_code(500);
    echo "Failed to create booking";
}