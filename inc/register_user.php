<?php
include 'config.php';

header('Content-Type: application/json');
$response = ['success' => false, 'message' => ''];

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // لا يوجد تعقيم للمدخلات
    $username = $_POST['username'];
    $email = $_POST['email'];
    $password = $_POST['password']; 

    // **تشفير كلمة المرور**
    $hashed_password = md5($password); 

    // التحقق من وجود(اسم مستخدم أو إيميل)
    $check_stmt = $conn->prepare("SELECT id FROM users WHERE username = ? OR email = ?");
    $check_stmt->bind_param("ss", $username, $email);
    $check_stmt->execute();
    $check_stmt->store_result();
    
    if ($check_stmt->num_rows > 0) {
        $response['message'] = 'Username or Email already exists.';
    } else {
        // إدراج المستخدم الجديد
        $insert_stmt = $conn->prepare("INSERT INTO users (username, email, user_password, user_type) VALUES (?, ?, ?, 'user')");
        $insert_stmt->bind_param("sss", $username, $email, $hashed_password);

        if ($insert_stmt->execute()) {
            $response['success'] = true;
            $response['message'] = 'Registration successful! You can now log in.';
        } else {
            $response['message'] = 'Database error: ' . $conn->error;
        }
    }
    $check_stmt->close();
    if (isset($insert_stmt)) $insert_stmt->close();
} else {
    $response['message'] = 'Invalid request method.';
}

echo json_encode($response);
?>