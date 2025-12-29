<?php
/**
 * ProHand Database Setup Script
 * Run this file once to set up the complete database
 */

include("php/config/db.php");

echo "<h2>ProHand Database Setup</h2>";
echo "<hr>";

// Read SQL file
$sql = file_get_contents('database_setup.sql');

// Split into individual queries
$queries = array_filter(array_map('trim', explode(';', $sql)));

$success = 0;
$errors = 0;

foreach ($queries as $query) {
    // Skip comments and empty queries
    if (empty($query) || strpos($query, '--') === 0 || strpos($query, 'SELECT') === 0) {
        continue;
    }
    
    if ($conn->query($query)) {
        $success++;
    } else {
        $errors++;
        echo "<p style='color:red;'>Error: " . $conn->error . "</p>";
    }
}

echo "<h3 style='color:green;'>✓ Database Setup Complete!</h3>";
echo "<p>Successful queries: <strong>$success</strong></p>";
if ($errors > 0) {
    echo "<p style='color:red;'>Errors: <strong>$errors</strong></p>";
}

echo "<hr>";
echo "<h3>Test Accounts Created:</h3>";
echo "<table border='1' cellpadding='10' style='border-collapse:collapse;'>";
echo "<tr style='background:#f0f0f0;'><th>Role</th><th>Email</th><th>Password</th><th>Status</th></tr>";

$accounts = [
    ['Admin', 'admin@prohand.com', 'admin123', 'Active'],
    ['Provider (Electrician)', 'john@provider.com', 'provider123', 'Verified'],
    ['Provider (Plumber)', 'mike@provider.com', 'provider123', 'Verified'],
    ['Provider (Cleaner)', 'sarah@provider.com', 'provider123', 'Pending Approval'],
    ['Customer', 'alice@customer.com', 'customer123', 'Active'],
    ['Customer', 'bob@customer.com', 'customer123', 'Active']
];

foreach ($accounts as $acc) {
    echo "<tr>";
    echo "<td><strong>{$acc[0]}</strong></td>";
    echo "<td>{$acc[1]}</td>";
    echo "<td>{$acc[2]}</td>";
    echo "<td>{$acc[3]}</td>";
    echo "</tr>";
}
echo "</table>";

echo "<hr>";
echo "<h3>Quick Links:</h3>";
echo "<ul>";
echo "<li><a href='index/admin_login.html' target='_blank'>Admin Login</a></li>";
echo "<li><a href='index/provider_login.html' target='_blank'>Provider Login</a></li>";
echo "<li><a href='index/provider_register.html' target='_blank'>Provider Registration</a></li>";
echo "<li><a href='index/login.html' target='_blank'>Customer Login</a></li>";
echo "</ul>";

echo "<hr>";
echo "<h3>Database Statistics:</h3>";

// Get counts
$users = $conn->query("SELECT COUNT(*) as count FROM users")->fetch_assoc()['count'];
$providers = $conn->query("SELECT COUNT(*) as count FROM users WHERE role='provider'")->fetch_assoc()['count'];
$services = $conn->query("SELECT COUNT(*) as count FROM services")->fetch_assoc()['count'];
$bookings = $conn->query("SELECT COUNT(*) as count FROM bookings")->fetch_assoc()['count'];

echo "<p>Total Users: <strong>$users</strong></p>";
echo "<p>Service Providers: <strong>$providers</strong></p>";
echo "<p>Services Listed: <strong>$services</strong></p>";
echo "<p>Bookings Created: <strong>$bookings</strong></p>";

echo "<hr>";
echo "<p style='color:green; font-weight:bold;'>✓ System is ready to use!</p>";
?>
