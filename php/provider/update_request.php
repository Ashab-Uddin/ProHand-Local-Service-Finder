<?php
include("../../config/db.php");
header('Content-Type: application/json');

$id = $_POST['booking_id'];
$status = $_POST['status']; 

$stmt = $conn->prepare("UPDATE bookings SET status = ? WHERE id = ?");
$stmt->bind_param("si", $status, $id);

if ($stmt->execute()) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "message" => $conn->error]);
}
?>
