<?php
session_start();
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../config/csrf.php';

if(isset($_SESSION['admin_id'])) header('Location: dashboard.php');

$message='';

if($_SERVER['REQUEST_METHOD']==='POST'){
    if(!validateCsrfToken($_POST['csrf_token'] ?? '')){
        $message='Invalid CSRF token';
    } else {
        $email = trim($_POST['email']);
        $pass  = $_POST['password'];
        $stmt = $pdo->prepare("SELECT * FROM users WHERE email=? AND is_admin=1 LIMIT 1");
        $stmt->execute([$email]);
        $admin = $stmt->fetch(PDO::FETCH_ASSOC);

        if($admin && password_verify($pass,$admin['password'])){
            $_SESSION['admin_id']=$admin['id'];
            $_SESSION['admin_name']=$admin['name'];
            header('Location: dashboard.php');
            exit;
        } else {
            $message='Invalid email or password';
        }
    }
}
?>
<!DOCTYPE html>
<html>
<head><title>Admin Login</title></head>
<body>
<h2>Admin Login</h2>
<form method="post">
<input type="hidden" name="csrf_token" value="<?php echo htmlspecialchars($_SESSION['csrf_token']); ?>">
Email: <input type="email" name="email" required><br>
Password: <input type="password" name="password" required><br>
<button type="submit">Login</button>
</form>
<p style="color:red"><?php echo $message; ?></p>
</body>
</html>
