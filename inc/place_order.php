<?php
include 'config.php';

header('Content-Type: application/json');
$response = ['success' => false, 'message' => ''];

$data = json_decode(file_get_contents("php://input"), true);

if ($_SERVER['REQUEST_METHOD'] == 'POST' && $data) {
    $user_id = $data['user_id'];
    $total_price = $data['total_price'];
    $cart_items = $data['cart_items'];

    if (empty($user_id) || empty($cart_items)) {
        $response['message'] = 'Missing user ID or cart items.';
        echo json_encode($response);
        exit();
    }

    // 1. بدء معاملة (Transaction) لضمان حفظ كل من الطلب وعناصره
    $conn->begin_transaction();
    $order_id = null;

    try {
        // 2. إدراج الطلب في جدول 'orders'
        // نستخدم 'in_progress' كحالة افتراضية
        $order_stmt = $conn->prepare("INSERT INTO orders (user_id, total_price, status) VALUES (?, ?, 'in_progress')");
        $order_stmt->bind_param("id", $user_id, $total_price); // i=integer, d=double (decimal)

        if (!$order_stmt->execute()) {
            throw new Exception("Error creating order: " . $conn->error);
        }
        
        $order_id = $conn->insert_id; // جلب المعرّف الفريد للطلب الجديد
        $order_stmt->close();

        // 3. إدراج عناصر الطلب في جدول 'order_items'
        $item_stmt = $conn->prepare("INSERT INTO order_items (order_id, item_id, quantity, price) VALUES (?, ?, ?, ?)");

        foreach ($cart_items as $item) {
            $item_id = $item['id']; // هذا هو ال ID من جدول menu_items
            $quantity = $item['quantity'];
            $price = $item['price'];

            $item_stmt->bind_param("iidd", $order_id, $item_id, $quantity, $price); // i=integer, d=double
            
            if (!$item_stmt->execute()) {
                throw new Exception("Error creating order item: " . $conn->error);
            }
        }
        $item_stmt->close();

        // 4. إذا تم كل شيء بنجاح: تأكيد المعاملة
        $conn->commit();
        $response['success'] = true;
        $response['message'] = "Order #{$order_id} placed successfully!";

    } catch (Exception $e) {
        // إذا حدث خطأ: التراجع عن جميع التغييرات
        $conn->rollback();
        $response['message'] = "Order Failed. Details: " . $e->getMessage();
    }

} else {
    $response['message'] = 'Invalid request method or missing data.';
}

echo json_encode($response);
?>