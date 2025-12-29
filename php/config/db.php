<?php
$conn = mysqli_connect(
    "localhost",
    "root",
    "",              // password EMPTY (set this in production)
    "prohand_db",
    4306
);

if (!$conn) {
    die(mysqli_connect_error());
}
