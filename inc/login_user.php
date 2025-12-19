<?php
include 'config.php';

header('Content-Type: application/json');
$response = ['success' => false, 'message' => '', 'username' => ''];

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    //  مفيش تعقيم للمدخلات
    $identifier = $_POST['identifier']; 
    $password = $_POST['password'];

    if (empty($identifier) || empty($password)) {
        $response['message'] = 'Please enter both identifier and password.';
        echo json_encode($response);
        exit();
    }

    //  تشفير كلمة المرور  
    $hashed_password = md5($password);

    
    // الاستعلام: البحث عن المستخدم بالاسم أو البريد وكلمة المرور المشفرة
    $sql = "SELECT id, username FROM users WHERE (username = '$identifier' OR email = '$identifier') AND user_password = '$hashed_password'";
    
    // تنفيذ الاستعلام
    $result = $conn->query($sql); 
    
    if ($result === false) {
        // رسالة خطأ لقاعدة البيانات
        $response['message'] = 'Database Query Error: ' . $conn->error;
    } elseif ($result->num_rows == 1) {
        $user = $result->fetch_assoc();

        // نجاح تسجيل الدخول - حفظ user_id في الجلسة
        $_SESSION['user_id'] = $user['id']; 

        $response['success'] = true;
        $response['username'] = $user['username'];
        $response['message'] = 'Login successful!';
    } else {
        $response['message'] = 'Invalid username/email or password.';
    }

} else {
    $response['message'] = 'Invalid request method.';
}

echo json_encode($response);
?>