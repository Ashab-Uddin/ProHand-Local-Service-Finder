<?php
include("php/config/db.php");

// Add new columns to users table for providers
$columns = [
    "phone" => "VARCHAR(20) NULL",
    "address" => "TEXT NULL",
    "service_category" => "VARCHAR(100) NULL",
    "is_verified" => "TINYINT(1) DEFAULT 0"
];

foreach ($columns as $col => $type) {
    if ($conn->query("SHOW COLUMNS FROM users LIKE '$col'")->num_rows == 0) {
        $conn->query("ALTER TABLE users ADD COLUMN $col $type");
        echo "Added $col<br>";
    }
}

// Ensure role enum has 'provider' and 'admin'
$conn->query("ALTER TABLE users MODIFY COLUMN role ENUM('customer', 'provider', 'admin') DEFAULT 'customer'");

// Update Bookings status enum if needed to include 'cancelled' or 'rejected'
$conn->query("ALTER TABLE bookings MODIFY COLUMN status ENUM('pending', 'accepted', 'rejected', 'completed', 'cancelled') DEFAULT 'pending'");

// Create Admin User if not exists
$adminEmail = 'admin@prohand.com';
$adminPass = password_hash('admin123', PASSWORD_DEFAULT);
$checkAdmin = $conn->query("SELECT id FROM users WHERE email='$adminEmail'");
if ($checkAdmin->num_rows == 0) {
    $stmt = $conn->prepare("INSERT INTO users (name, email, password, role) VALUES ('System Admin', ?, ?, 'admin')");
    $stmt->bind_param("ss", $adminEmail, $adminPass);
    $stmt->execute();
    echo "Created Admin (admin@prohand.com)<br>";
}

echo "Database schema updated for Provider System.";
?>
