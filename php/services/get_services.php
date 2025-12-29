<?php
include("../config/db.php");

header('Content-Type: application/json');

// Optional filters via query string: category, q (search in title/description)
$category = isset($_GET['category']) ? trim($_GET['category']) : '';
$q        = isset($_GET['q']) ? trim($_GET['q']) : '';

$sql = "SELECT id, provider_id, title, category, description, price FROM services";
$params = [];
$types  = '';
$clauses = [];

if ($category !== '') {
    $clauses[] = "category = ?";
    $params[]  = $category;
    $types    .= 's';
}

if ($q !== '') {
    $clauses[] = "(title LIKE ? OR description LIKE ?)";
    $like = "%" . $q . "%";
    $params[] = $like;
    $params[] = $like;
    $types   .= 'ss';
}

if (!empty($clauses)) {
    $sql .= " WHERE " . implode(" AND ", $clauses);
}

$sql .= " ORDER BY id DESC";

if (!empty($params)) {
    $stmt = mysqli_prepare($conn, $sql);
    if (!$stmt) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to prepare statement"]);
        exit;
    }

    mysqli_stmt_bind_param($stmt, $types, ...$params);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
} else {
    $result = mysqli_query($conn, $sql);
}

$services = [];
if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        $services[] = $row;
    }
}

echo json_encode($services);