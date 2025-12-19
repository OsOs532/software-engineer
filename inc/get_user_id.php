<?php
include 'config.php'; // نحتاج نبدأ الجلسة session_start() الموجودة في config.php

header('Content-Type: application/json');

$response = ['user_id' => null];

if (isset($_SESSION['user_id'])) {
    $response['user_id'] = $_SESSION['user_id'];
}

echo json_encode($response);
?>