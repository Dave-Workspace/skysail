<?php
session_start();
require_once __DIR__ . '/../config/db.php';

if(isset($_SESSION['admin_id'])){
    header('Location: dashboard.php');
    exit;
}

// CSRF token
if(empty($_SESSION['csrf_token'])) $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
$csrf = $_SESSION['csrf_token'];
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Admin Login</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
:root{
    --primary:#2563eb; --danger:#dc2626; --bg:#f8fafc;
    --card:#fff; --text:#0f172a; --radius:14px;
}
*{box-sizing:border-box;font-family:system-ui}
body{margin:0;padding:0;height:100vh;display:flex;align-items:center;justify-content:center;background:var(--bg);color:var(--text)}
.card{background:var(--card);padding:40px;border-radius:var(--radius);width:100%;max-width:400px;box-shadow:0 8px 20px rgba(0,0,0,.1);animation:fadeIn .3s ease}
h2{text-align:center;margin-bottom:20px}
input{width:100%;padding:12px;margin:10px 0;border:1px solid #cbd5f5;border-radius:10px}
button{width:100%;padding:12px;border:none;border-radius:10px;background:var(--primary);color:white;font-size:16px;cursor:pointer;transition:.2s}
button:hover{opacity:.9}
#toast{position:fixed;bottom:20px;right:20px;padding:14px 18px;background:#0f172a;color:white;border-radius:12px;opacity:0;transform:translateY(20px);transition:.3s;z-index:2000}
#toast.show{opacity:1;transform:translateY(0)}
@keyframes fadeIn{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}
</style>
</head>
<body>

<div class="card">
    <h2>Admin Login</h2>
    <input type="email" id="email" placeholder="Email">
    <input type="password" id="password" placeholder="Password">
    <button onclick="login()">Login</button>
    <div id="message" style="color:var(--danger);margin-top:10px;text-align:center"></div>
    <input type="hidden" id="csrf" value="<?=htmlspecialchars($csrf,ENT_QUOTES)?>">
</div>

<div id="toast"></div>

<script>
const toastBox = document.getElementById('toast');
const csrf = document.getElementById('csrf').value;

function toast(msg){ 
    toastBox.innerText = msg; 
    toastBox.classList.add('show'); 
    setTimeout(()=>toastBox.classList.remove('show'),3000); 
}

function login(){
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const message = document.getElementById('message');
    message.innerText='';

    if(!email || !password){ message.innerText='Fill all fields'; return; }

	console.log('csrf:', csrf);

    fetch('/api/admin/login.php',{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'X-CSRF-TOKEN': csrf
        },
        body:JSON.stringify({email,password})
    }).then(r=>r.json()).then(d=>{
        if(d.success){
            toast('Login successful');
            setTimeout(()=>location.href='dashboard.php',500);
        } else if(d.message==='not_verified'){
            message.innerText='Your account is not verified';
        } else {
            message.innerText=d.message||'Invalid credentials';
        }
    });
}
</script>

</body>
</html>
