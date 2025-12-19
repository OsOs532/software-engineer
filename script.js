let cart = [];
let totalPrice = 0;   

// --- NEW: Page Navigation Functions ---

function showLoginPage() {
    document.getElementById('login-page').classList.remove('hidden');
    document.getElementById('register-page').classList.add('hidden');
    document.getElementById('forgot-password-page').classList.add('hidden');
}

function showRegisterPage() {
    document.getElementById('login-page').classList.add('hidden');
    document.getElementById('register-page').classList.remove('hidden');
    document.getElementById('forgot-password-page').classList.add('hidden');
}

function showForgotPasswordPage() {
    document.getElementById('login-page').classList.add('hidden');
    document.getElementById('register-page').classList.add('hidden');
    document.getElementById('forgot-password-page').classList.remove('hidden');
}

// --- End of Page Navigation Functions ---


async function login() { 
    // نستخدم 'identifier' و 'password' لتتماشى مع ملف login_user.php
  const identifier = document.getElementById('username').value; // يُفترض أن id الحقل هو 'username'
  const password = document.getElementById('password').value;

  if (!identifier || !password) {
    alert('Please enter both username/email and password.'); 
    return;
 }
    
    // تجهيز البيانات لإرسالها كـ FormData
    const formData = new FormData();
    formData.append('identifier', identifier);
    formData.append('password', password); 

  try {
        // إرسال الطلب إلى ملف login_user.php
        const response = await fetch('inc/login_user.php', { // تأكد من المسار inc/
            method: 'POST',
            body: formData 
        });

        const data = await response.json(); // استقبال الاستجابة كـ JSON

        if (data.success) {
            // نجاح تسجيل الدخول
            alert('Welcome, ' + data.username + '!');
            document.getElementById('login-page').classList.add('hidden');
            document.getElementById('menu-page').classList.remove('hidden');
            
            // التأكد من إخفاء صفحات المصادقة الأخرى
            document.getElementById('register-page').classList.add('hidden');
            document.getElementById('forgot-password-page').classList.add('hidden');
        
        } else {
            // فشل تسجيل الدخول: كلمة المرور أو اسم المستخدم غير صحيح
            alert('Login Failed: ' + data.message); 
        }

    } catch (error) {
        console.error('Error during login:', error);
        alert('An unexpected error occurred during login. Check console.');
    }
}


// NEW: Register Function (Connected to PHP)
async function register() {
    const username = document.getElementById('reg-username').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm-password').value;

    if (!username || !email || !password || !confirmPassword) {
        alert('Please fill in all fields.');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match. Please try again.');
        return;
    }

    // تجهيز البيانات لإرسالها كـ FormData
    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password); // نرسل كلمة المرور لـ PHP

    try {
        // نرسل الطلب إلى ملف register_user.php
        const response = await fetch('inc/register_user.php', {
            method: 'POST',
            body: formData 
        });

        const data = await response.json(); // استقبال الاستجابة كـ JSON

        if (data.success) {
            alert(data.message);
            showLoginPage(); // إرجاع المستخدم لصفحة تسجيل الدخول
        } else {
            alert('Registration Failed: ' + data.message);
        }

    } catch (error) {
        console.error('Error during registration:', error);
        alert('An unexpected error occurred during registration. Check console.');
    }
}
// NEW: Reset Password Function (Connected to PHP)
async function resetPassword() {
    const email = document.getElementById('forgot-email').value;

    if (!email) {
        alert('Please enter your email address.');
        return;
    }

    // تجهيز البيانات لإرسالها كـ FormData
    const formData = new FormData();
    formData.append('email', email); 

    try {
        // نرسل الطلب إلى ملف reset_pass.php
        const response = await fetch('inc/reset_pass.php', { // تأكد من المسار
            method: 'POST',
            body: formData 
        });

        const data = await response.json(); // استقبال الاستجابة كـ JSON

        // بغض النظر عن النجاح الفعلي، نعرض الرسالة الآمنة للمستخدم
        alert(data.message);
        showLoginPage(); // إرجاع المستخدم لصفحة تسجيل الدخول

    } catch (error) {
        console.error('Error during password reset request:', error);
        alert('An unexpected error occurred. Please try again later.');
    }
}
    
// Update Price Function
function updatePrice(itemName, price) {       
    const qtyInput = document.getElementById(`${itemName.toLowerCase()}Qty`).value;
    if (qtyInput < 1) {
        document.getElementById(`${itemName.toLowerCase()}Qty`).value = 1;  
    }
}






// Add to Cart Function العلة الكبيرة
// **تأكد أن استدعاء الدالة في HTML الآن يمرر 3 قيم: (Name, Price, ID)**
function addToCart(itemName, price, itemId) { 
    const qtyInput = document.getElementById(`${itemName.toLowerCase()}Qty`);
    // يُفترض أن quantity موجودة في الكود السابق، سنعيد تعريفها هنا للتأكيد
    let quantity = parseInt(qtyInput.value) || 1;  
    const sound = document.getElementById('click-sound');
    if (sound) sound.play();

    const existingItem = cart.find(item => item.name === itemName); 
    
    if (existingItem) {  
        totalPrice -= existingItem.price * existingItem.quantity; 
        existingItem.quantity = quantity;
        totalPrice += existingItem.price * existingItem.quantity; 
    } else {
        // 🔑 التعديل الحاسم: إضافة itemId إلى الكائن الذي يتم حفظه في العربة
        cart.push({ id: itemId, name: itemName, price: price, quantity: quantity }); 
        totalPrice += price * quantity;  
    }

    const buttons = document.querySelectorAll('.menu-item button');
    buttons.forEach(button => button.classList.add('cart-animation')); 

    alert(`${quantity} ${itemName}(s) added to cart!`); 
    qtyInput.value = 1; 

    updateTotalPrice();
}

// Helper function to calculate total price from scratch
function updateTotalPrice() {
    totalPrice = 0;
    cart.forEach(item => {
        totalPrice += item.price * item.quantity;
    });
    document.getElementById('total-price').textContent = `Total: $${totalPrice}`;
}


// Show Cart Function
function showCart() {   
    document.getElementById('menu-page').classList.add('hidden');
    document.getElementById('cart-page').classList.remove('hidden');

    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';

    cart.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${item.name} - $${item.price} x ${item.quantity} = $${item.price * item.quantity}</span>
            <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
        `;
        cartItems.appendChild(li);
    });     

    updateTotalPrice(); 
}

// Function to remove a single item from the cart
function removeFromCart(index) {
    const removedItem = cart.splice(index, 1); 
    updateTotalPrice(); 
    showCart(); 
}

// Back to Menu Function
function backToMenu() {   
    document.getElementById('cart-page').classList.add('hidden');
    document.getElementById('menu-page').classList.remove('hidden');
}                           


// Checkout Function (Connected to PHP)
async function checkout() { 
    if (cart.length === 0) { 
        alert('Your cart is empty!');  
        return;
    }

    // 1. جلب الـ user_id الذي تم حفظه عند تسجيل الدخول
    const user_id = localStorage.getItem('user_id');
    if (!user_id) {
        alert('Error: Please log in again before checking out.');
        return;
    }

    // 2. تجهيز البيانات لإرسالها كـ JSON
    // ملاحظة: نرسل الـ cart_items التي تحتوي الآن على 'id' (رقم المنتج)
    const orderData = {
        user_id: user_id,
        total_price: totalPrice, // تم تعديل الاسم ليتطابق مع جدولك
        cart_items: cart 
    };

    try {
        const response = await fetch('inc/place_order.php', {
            method: 'POST',
            // يجب تحديد نوع المحتوى كـ JSON
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData) // تحويل كائن JS إلى نص JSON
        });

        const result = await response.json();

        if (result.success) {
            alert(`Order Successful! ${result.message}`);
            // مسح عربة التسوق بعد نجاح الطلب
            cart = [];
            totalPrice = 0;
            showCart(); // تحديث عرض العربة الفارغة
        } else {
            alert(`Checkout Failed: ${result.message}`);
        }

    } catch (error) {
        console.error('Error during checkout:', error);
        alert('An unexpected error occurred during checkout. Check console.');
    }
}

// Function to empty the entire cart
function emptyCart() {
    if (cart.length === 0) {
        alert('Your cart is already empty!');
    } else {
        if (confirm('Are you sure you want to cancel the order and empty your cart?')) {
            cart = [];
            totalPrice = 0;
            showCart(); 
            alert('Your cart has been emptied.');
        }
    }
}