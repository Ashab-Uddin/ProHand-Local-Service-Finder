<?php
include("php/config/db.php");

echo "<!DOCTYPE html>
<html>
<head>
    <title>ProHand Database Setup</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 900px; margin: 50px auto; padding: 20px; background: #f5f5f5; }
        .container { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #0f172a; border-bottom: 3px solid #2563eb; padding-bottom: 10px; }
        .success { background: #dcfce7; color: #166534; padding: 15px; border-radius: 5px; margin: 10px 0; }
        .error { background: #fee2e2; color: #991b1b; padding: 15px; border-radius: 5px; margin: 10px 0; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background: #f8fafc; font-weight: 600; }
        .btn { display: inline-block; padding: 10px 20px; background: #2563eb; color: white; text-decoration: none; border-radius: 5px; margin: 5px; }
        .btn:hover { background: #1d4ed8; }
    </style>
</head>
<body>
<div class='container'>";

echo "<h1>🔧 ProHand Database Setup</h1>";

// Step 1: Update Users Table
echo "<h3>Step 1: Updating Users Table...</h3>";
$queries = [
    "ALTER TABLE users ADD COLUMN phone VARCHAR(20) NULL AFTER password",
    "ALTER TABLE users ADD COLUMN address TEXT NULL AFTER phone",
    "ALTER TABLE users ADD COLUMN service_category VARCHAR(100) NULL AFTER address",
    "ALTER TABLE users ADD COLUMN is_verified TINYINT(1) DEFAULT 0 AFTER service_category"
];

foreach ($queries as $q) {
    if ($conn->query($q)) {
        echo "<div class='success'>✓ Column added successfully</div>";
    } else {
        if (strpos($conn->error, 'Duplicate column') !== false) {
            echo "<div class='success'>✓ Column already exists</div>";
        } else {
            echo "<div class='error'>Error: " . $conn->error . "</div>";
        }
    }
}

// Step 2: Update Enums
echo "<h3>Step 2: Updating Role and Status Enums...</h3>";
$conn->query("ALTER TABLE users MODIFY COLUMN role ENUM('customer', 'provider', 'admin') DEFAULT 'customer'");
echo "<div class='success'>✓ User roles updated</div>";

$conn->query("ALTER TABLE bookings MODIFY COLUMN status ENUM('pending', 'accepted', 'rejected', 'completed', 'cancelled') DEFAULT 'pending'");
echo "<div class='success'>✓ Booking statuses updated</div>";

// Step 3: Create Admin
echo "<h3>Step 3: Creating Admin Account...</h3>";
$adminEmail = 'admin@prohand.com';
$adminPass = password_hash('admin123', PASSWORD_DEFAULT);
$check = $conn->query("SELECT id FROM users WHERE email='$adminEmail'");
if ($check->num_rows == 0) {
    $conn->query("INSERT INTO users (name, email, password, role, is_verified) VALUES ('System Admin', '$adminEmail', '$adminPass', 'admin', 1)");
    echo "<div class='success'>✓ Admin account created</div>";
} else {
    $conn->query("UPDATE users SET role='admin', is_verified=1 WHERE email='$adminEmail'");
    echo "<div class='success'>✓ Admin account already exists (updated)</div>";
}

// Step 4: Create Sample Providers
echo "<h3>Step 4: Creating Sample Provider Accounts...</h3>";
$providerPass = password_hash('provider123', PASSWORD_DEFAULT);
$providers = [
    ['John Electrician', 'john@provider.com', '01712345678', 'Dhaka, Bangladesh', 'Electrician', 1],
    ['Mike Plumber', 'mike@provider.com', '01812345679', 'Chittagong, Bangladesh', 'Plumber', 1],
    ['Sarah Cleaner', 'sarah@provider.com', '01912345680', 'Sylhet, Bangladesh', 'Cleaner', 0]
];

foreach ($providers as $p) {
    $check = $conn->query("SELECT id FROM users WHERE email='{$p[1]}'");
    if ($check->num_rows == 0) {
        $stmt = $conn->prepare("INSERT INTO users (name, email, password, phone, address, service_category, role, is_verified) VALUES (?, ?, ?, ?, ?, ?, 'provider', ?)");
        $stmt->bind_param("ssssssi", $p[0], $p[1], $providerPass, $p[2], $p[3], $p[4], $p[5]);
        $stmt->execute();
        echo "<div class='success'>✓ Created provider: {$p[0]}</div>";
    } else {
        echo "<div class='success'>✓ Provider already exists: {$p[0]}</div>";
    }
}

// Step 5: Create Sample Customers
echo "<h3>Step 5: Creating Sample Customer Accounts...</h3>";
$customerPass = password_hash('customer123', PASSWORD_DEFAULT);
$customers = [
    ['Alice Customer', 'alice@customer.com'],
    ['Bob Customer', 'bob@customer.com']
];

foreach ($customers as $c) {
    $check = $conn->query("SELECT id FROM users WHERE email='{$c[1]}'");
    if ($check->num_rows == 0) {
        $conn->query("INSERT INTO users (name, email, password, role, is_verified) VALUES ('{$c[0]}', '{$c[1]}', '$customerPass', 'customer', 1)");
        echo "<div class='success'>✓ Created customer: {$c[0]}</div>";
    } else {
        echo "<div class='success'>✓ Customer already exists: {$c[0]}</div>";
    }
}

// Display Test Accounts
echo "<h2>📋 Test Accounts</h2>";
echo "<table>
<tr><th>Role</th><th>Email</th><th>Password</th><th>Status</th></tr>
<tr><td><strong>Admin</strong></td><td>admin@prohand.com</td><td>admin123</td><td>Active</td></tr>
<tr><td><strong>Provider (Electrician)</strong></td><td>john@provider.com</td><td>provider123</td><td>Verified</td></tr>
<tr><td><strong>Provider (Plumber)</strong></td><td>mike@provider.com</td><td>provider123</td><td>Verified</td></tr>
<tr><td><strong>Provider (Cleaner)</strong></td><td>sarah@provider.com</td><td>provider123</td><td>Pending</td></tr>
<tr><td><strong>Customer</strong></td><td>alice@customer.com</td><td>customer123</td><td>Active</td></tr>
<tr><td><strong>Customer</strong></td><td>bob@customer.com</td><td>customer123</td><td>Active</td></tr>
</table>";

// Statistics
$stats = [
    'Total Users' => $conn->query("SELECT COUNT(*) as c FROM users")->fetch_assoc()['c'],
    'Providers' => $conn->query("SELECT COUNT(*) as c FROM users WHERE role='provider'")->fetch_assoc()['c'],
    'Services' => $conn->query("SELECT COUNT(*) as c FROM services")->fetch_assoc()['c'],
    'Bookings' => $conn->query("SELECT COUNT(*) as c FROM bookings")->fetch_assoc()['c']
];

echo "<h2>📊 Database Statistics</h2>";
echo "<table>";
foreach ($stats as $label => $count) {
    echo "<tr><td><strong>$label</strong></td><td>$count</td></tr>";
}
echo "</table>";

echo "<h2>🚀 Quick Access Links</h2>";
echo "<a href='index/admin_login.html' class='btn'>Admin Login</a>";
echo "<a href='index/provider_login.html' class='btn'>Provider Login</a>";
echo "<a href='index/provider_register.html' class='btn'>Provider Registration</a>";
echo "<a href='index/login.html' class='btn'>Customer Login</a>";
echo "<a href='index/index.html' class='btn'>Homepage</a>";

echo "<div class='success' style='margin-top:30px; font-size:18px; text-align:center;'>
<strong>✅ Database Setup Complete! System is ready to use.</strong>
</div>";

echo "</div></body></html>";
?>
