<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}


require_once __DIR__.'/config/csrf.php';
require_once __DIR__.'/config/config.php';

if (
    isset($_SESSION['user_id']) &&
    isset($_SESSION['is_admin']) &&
    $_SESSION['is_admin'] == 1
) {
    header("Location: admin-dashboard.php");
    exit;
}


//$_SESSION['role'] = $response['user']['is_admin'] ? 'admin' : 'user';
// if (
//     isset($_SESSION['user_id'], $_SESSION['role']) &&
//     $_SESSION['role'] === 'admin'
// ) {
//     header("Location: admin-dashboard.php");
//     exit;
// }

?>
<!DOCTYPE html>
<html>
<head>
<title>Admin Login</title>
</head>
<body>

<h2>Admin Login</h2>
<input type="email" id="email" placeholder="Email">
<input type="password" id="password" placeholder="Password">
<button onclick="login()">Login</button>
<p id="message"></p>

<script>
const csrf='<?= $_SESSION['csrf_token'] ?>';

function login(){
    fetch('/api/login.php',{
        method:'POST',
        headers:{'Content-Type':'application/json','X-CSRF-TOKEN':csrf},
        body: JSON.stringify({
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            admin:true
        })
    }).then(r=>r.json()).then(d=>{
        if(d.success && d.role=='admin') window.location='admin-dashboard.php';
        else document.getElementById('message').innerText=d.message||'Invalid credentials';
    });
}
</script>
</body>
</html>
