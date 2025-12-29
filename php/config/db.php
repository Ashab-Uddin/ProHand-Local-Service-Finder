<?php
$conn = mysqli_connect(
    "localhost",
    "root",
    "",              // 🔥 password EMPTY
    "prohand_db",
    4306
);

if (!$conn) {
    die(mysqli_connect_error());
}

echo "Database Connected Successfully";
?>
