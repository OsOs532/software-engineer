<?php
include 'config.php';

header('Content-Type: application/json');
$response = ['success' => true, 'message' => 'A password reset link has been sent to your email.'];

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $email = $_POST['email']; 

    //  مافيه تعقيم للمدخلات
    
    if (empty($email)) {
        $response['message'] = 'Please provide an email address.';
    } else {
       
        $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows == 0) {
            // رسالة إخفاء (Security Best Practice)
             $response['message'] = 'A password reset link has been sent to your email.';
        } else {
             
             $response['message'] = 'A password reset link has been sent to your email.';
        }
        $stmt->close();
    }
} else {
    $response['success'] = false;
    $response['message'] = 'Invalid request method.';
}

// دائمًا نرجع رسالة نجاح لعدم كشف إذا كان الإيميل موجوداً أم لا
echo json_encode($response);
?>