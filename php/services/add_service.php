<?php
include("../config/db.php");

$provider_id = $_POST['provider_id'];
$title = $_POST['title'];
$category = $_POST['category'];
$description = $_POST['description'];
$price = $_POST['price'];

$sql = "INSERT INTO services 
(provider_id, title, category, description, price)
VALUES ('$provider_id', '$title', '$category', '$description', '$price')";

echo mysqli_query($conn, $sql) ? "service added" : "failed";
