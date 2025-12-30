<?php
$conn = mysqli_connect(
    "localhost",
    "root",
    "",             
    "prohand_db",
    4306
);

if (!$conn) {
    die(mysqli_connect_error());
}
