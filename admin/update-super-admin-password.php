<?php
session_start();
require_once __DIR__ . '/../config/db.php';

// OPTIONAL: protect this page (recommended)
//if (!isset($_SESSION['admin_id'])) {
//    die('Unauthorized');
//}

$message = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = 'admin@yourdomain.com';
    $password = trim($_POST['password'] ?? '');

    if (strlen($password) < 8) {
        $message = 'Password must be at least 8 characters';
    } else {
        $hash = password_hash($password, PASSWORD_DEFAULT);

        $stmt = $pdo->prepare(
            "UPDATE users 
             SET password = ?, is_admin = 1, is_verified = 1 
             WHERE email = ?"
        );

        if ($stmt->execute([$hash, $email])) {
            $message = '✅ Super Admin password updated successfully';
        } else {
            $message = '❌ Failed to update password';
        }
    }
}
?>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Update Super Admin Password</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
body{
    font-family:system-ui;
    background:#f8fafc;
    display:flex;
    align-items:center;
    justify-content:center;
    height:100vh;
}
.card{
    background:#fff;
    padding:30px;
    width:100%;
    max-width:400px;
    border-radius:14px;
    box-shadow:0 10px 30px rgba(0,0,0,.1);
}
input,button{
    width:100%;
    padding:12px;
    margin-top:12px;
    border-radius:10px;
}
input{border:1px solid #cbd5f5}
button{
    background:#2563eb;
    color:#fff;
    border:none;
    cursor:pointer;
}
.msg{
    margin-top:15px;
    font-weight:600;
    text-align:center;
}
</style>
</head>
<body>

<div class="card">
    <h2>Update Super Admin Password</h2>
    <p><b>Email:</b> admin@yourdomain.com</p>

    <form method="post">
        <input type="password" name="password" placeholder="New Password" required>
        <button type="submit">Update Password</button>
    </form>

    <?php if($message): ?>
        <div class="msg"><?= htmlspecialchars($message) ?></div>
    <?php endif; ?>
</div>

</body>
</html>
