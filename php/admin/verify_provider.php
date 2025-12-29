<?php
include("../../config/db.php");
header('Content-Type: application/json');

$id = $_POST['provider_id'];
$action = $_POST['action']; // 'approve' or 'block'

$val = ($action == 'approve') ? 1 : 0;

$stmt = $conn->prepare("UPDATE users SET is_verified = ? WHERE id = ?");
$stmt->bind_param("ii", $val, $id);

if ($stmt->execute()) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error"]);
}
?>
