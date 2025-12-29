<?php
include("../config/db.php");

$name     = trim($_POST['name']);
$email    = trim($_POST['email']);
$password = $_POST['password'];

// basic validation
if ($name == "" || $email == "" || $password == "") {
    die("All fields are required");
}

// check email exists
$check = mysqli_prepare($conn, "SELECT id FROM users WHERE email=?");
mysqli_stmt_bind_param($check, "s", $email);
mysqli_stmt_execute($check);
mysqli_stmt_store_result($check);

if (mysqli_stmt_num_rows($check) > 0) {
    die("Email already registered");
}

// secure password
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// insert user
$stmt = mysqli_prepare(
    $conn,
    "INSERT INTO users (name, email, password) VALUES (?,?,?)"
);
mysqli_stmt_bind_param($stmt, "sss", $name, $email, $hashedPassword);

if (mysqli_stmt_execute($stmt)) {
    echo "Registration successful";
} else {
    echo "Registration failed";
}
