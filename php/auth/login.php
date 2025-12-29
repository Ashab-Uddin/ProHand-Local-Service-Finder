<?php
session_start();
include("../config/db.php");

$email    = trim($_POST['email']);
$password = $_POST['password'];

$stmt = mysqli_prepare(
    $conn,
    "SELECT id, password FROM users WHERE email=?"
);
mysqli_stmt_bind_param($stmt, "s", $email);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

if ($user = mysqli_fetch_assoc($result)) {
    if (password_verify($password, $user['password'])) {
        $_SESSION['user_id'] = $user['id'];
        echo "Login successful";
    } else {
        echo "Wrong password";
    }
} else {
    echo "User not found";
}
?>
