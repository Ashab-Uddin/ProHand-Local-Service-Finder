<?php
include("../config/db.php");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo "Method not allowed";
    exit;
}

// Extract data from POST
$title          = isset($_POST['name']) ? trim($_POST['name']) : '';
$category       = isset($_POST['category']) ? trim($_POST['category']) : '';
$price          = isset($_POST['price']) ? trim($_POST['price']) : '';
$description    = isset($_POST['description']) ? trim($_POST['description']) : '';
$thumbnail      = isset($_POST['thumbnail']) ? trim($_POST['thumbnail']) : '';
$provider_name  = isset($_POST['provider_name']) ? trim($_POST['provider_name']) : '';
$provider_email = isset($_POST['provider_email']) ? trim($_POST['provider_email']) : '';

// Validation
if ($title === '' || $category === '' || $price === '' || $description === '' || $thumbnail === '' || $provider_name === '' || $provider_email === '') {
    echo "All fields marked with * are required.";
    exit;
}

// 1. Get Provider ID (User ID) from email
$userQuery = mysqli_prepare($conn, "SELECT id FROM users WHERE email = ?");
mysqli_stmt_bind_param($userQuery, "s", $provider_email);
mysqli_stmt_execute($userQuery);
$result = mysqli_stmt_get_result($userQuery);
$user = mysqli_fetch_assoc($result);

if (!$user) {
    echo "Error: Provider not found. Please log in again.";
    exit;
}

$provider_id = $user['id'];

// 2. Insert Service (Added thumbnail, provider_name, provider_email to typical columns)
// Note: This assumes yours services table has these columns. If not, we typically add them or adjust.
$stmt = mysqli_prepare(
    $conn,
    "INSERT INTO services (provider_id, title, category, description, price, thumbnail, provider_name, provider_email) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
);

if (!$stmt) {
    // If thumbnails/provider info columns don't exist yet, fallback to a simpler insert or alert
    // For this task, we assume the user follows the structure provided in the premium form.
    echo "Server Error: Database structure mismatch.";
    exit;
}

mysqli_stmt_bind_param($stmt, "isssdsss", $provider_id, $title, $category, $description, $price, $thumbnail, $provider_name, $provider_email);

if (mysqli_stmt_execute($stmt)) {
    echo "Service added successfully! It is now live in our community.";
} else {
    echo "Failed to add service. Please check your data and try again.";
}
?>
