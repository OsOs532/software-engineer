<?php
// إعدادات الاتصال بقاعدة البيانات
// $connection= mysqli_connect('localhost','root','','unhealthy_dp');

$db_host = 'localhost';
$db_user = 'root'; 
$db_pass = '';     
$db_name = 'unhealthy_dp'; 

// إنشاء الاتصال
$conn = new mysqli($db_host, $db_user, $db_pass, $db_name);

// التحقق من الاتصال
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// لضمان التعامل مع ترميز UTF-8
$conn->set_charset("utf8mb4");

// بدء الجلسة (Session)
// يجب أن يبدأ في كل ملف يحتاج للوصول إلى متغيرات الجلسة
session_start();
?>