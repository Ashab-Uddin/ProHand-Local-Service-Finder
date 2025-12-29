<?php
include("php/config/db.php");

$tables = ['users', 'services', 'bookings'];
foreach ($tables as $table) {
    echo "TABLE: $table\n";
    $result = $conn->query("SHOW COLUMNS FROM $table");
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            echo " - " . $row['Field'] . " (" . $row['Type'] . ")\n";
        }
    } else {
        echo " - Error: " . $conn->error . "\n";
    }
    echo "\n";
}
?>
