<?php
include("../../config/db.php");
header('Content-Type: application/json');

$provider_id = isset($_GET['provider_id']) ? intval($_GET['provider_id']) : 0;

if ($provider_id == 0) {
    echo json_encode([]);
    exit;
}

// Logic: Users book a 'service'. That service has a 'provider_id'.
// We need to find bookings where the service belongs to this provider.

$sql = "SELECT b.id, b.booking_date, b.status, b.offered_price, 
               u.name as customer_name, u.address as location, 
               s.title as service_title
        FROM bookings b
        JOIN services s ON b.service_id = s.id
        JOIN users u ON b.user_id = u.id
        WHERE s.provider_id = ?
        ORDER BY b.id DESC";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $provider_id);
$stmt->execute();
$result = $stmt->get_result();

$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);
?>
