<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once __DIR__ . '/config/csrf.php';

/* Initialize rate limiting arrays */
if (!isset($_SESSION['login_attempts'])) $_SESSION['login_attempts'] = [];
if (!isset($_SESSION['register_attempts'])) $_SESSION['register_attempts'] = [];
?>
<!DOCTYPE html>
<html>
<head>
<title>Login / Register</title>
<style>
.meter { margin-top:5px; }
.meter span { color:red; }
.meter span.valid { color:green; }
#strengthBar { width:300px;height:10px;background:#eee;margin-top:5px; }
#strengthFill { height:100%;width:0%;background:red; }
#message { margin-top:10px; color:blue; }
#resendBtn { margin-top:5px; }
</style>
</head>
<body>

<h2>Account Access</h2>

<input type="hidden" id="csrf" value="<?= $_SESSION['csrf_token'] ?>">

<!-- EMAIL -->
<input type="email" id="email" placeholder="you@example.com" required>
<button onclick="checkEmail()">Continue</button>

<!-- LOGIN -->
<div id="loginBox" style="display:none;margin-top:10px;">
    <input type="password" id="loginPassword" placeholder="Password">
    <button onclick="login()">Login</button>
</div>

<!-- REGISTRATION INLINE -->
<div id="registerBox" style="display:none;margin-top:10px;">
    <input type="text" id="fullName" placeholder="Full Name *">
    <input type="text" id="contact" placeholder="Contact Number *">
    <input type="password" id="regPassword" placeholder="Password *" onkeyup="updateStrength(this.value)">
    <input type="password" id="regConfirm" placeholder="Confirm Password *">

    <!-- Password Strength -->
    <div id="strengthBar"><div id="strengthFill"></div></div>
    <div class="meter">
        <span id="upper">Uppercase</span> |
        <span id="lower">Lowercase</span> |
        <span id="number">Number</span> |
        <span id="special">Special</span> |
        <span id="length">8+ chars</span>
    </div>

    <!-- reCAPTCHA -->
    <div class="g-recaptcha" data-sitekey="YOUR_SITE_KEY"></div>

    <button onclick="register()">Create Account</button>
</div>

<p id="message"></p>
<button id="resendBtn" style="display:none;" onclick="resendVerification()">Resend verification email</button>

<script src="https://www.google.com/recaptcha/api.js" async defer></script>

<script>
function checkEmail() {
    fetch('/api/check-email.php', {
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'X-CSRF-TOKEN': csrf.value
        },
        body: JSON.stringify({ email: email.value })
    })
    .then(r=>r.json())
    .then(d=>{
        loginBox.style.display='none';
        registerBox.style.display='none';
        message.innerText='';
        document.getElementById('resendBtn').style.display='none';

        if (d.exists) loginBox.style.display='block';
        else registerBox.style.display='block';
    });
}

/* PASSWORD STRENGTH */
function updateStrength(p) {
    const rules = {
        upper:/[A-Z]/.test(p),
        lower:/[a-z]/.test(p),
        number:/\d/.test(p),
        special:/[^A-Za-z0-9]/.test(p),
        length:p.length>=8
    };
    let score = Object.values(rules).filter(v=>v).length;

    document.getElementById('strengthFill').style.width = (score/5*100)+'%';
    document.getElementById('strengthFill').style.background = score<=2?'red':score<5?'orange':'green';

    for(let r in rules) document.getElementById(r).className = rules[r]?'valid':'';
}

/* LOGIN */
function login() {
    console.log('attempting login');
    fetch('/api/login.php', {
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'X-CSRF-TOKEN': csrf.value
        },
        body: JSON.stringify({
            email: email.value,
            password: loginPassword.value
        })
    })
    .then(r=>r.json())
    .then(d=>{
        console.log(d);
        if(d.success) location.href='dashboard.php';
        else if(d.message==='not_verified'){
            message.innerText='Your account is not verified. Please verify your email.';
            document.getElementById('resendBtn').style.display='inline-block';
        }
        else alert(d.message || 'Invalid credentials');
    });
}

/* REGISTER */
function register() {
    if(regPassword.value!==regConfirm.value){ alert('Passwords do not match'); return; }
    if(!grecaptcha.getResponse()){ alert('Please complete reCAPTCHA'); return; }

    fetch('/api/register.php', {
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'X-CSRF-TOKEN': csrf.value
        },
        body: JSON.stringify({
            name: fullName.value,
            contact: contact.value,
            email: email.value,
            password: regPassword.value,
            captcha: grecaptcha.getResponse()
        })
    })
    .then(r=>r.json())
    .then(d=>{
        if(d.success){
            registerBox.style.display='none';
            loginBox.style.display='block';
            message.innerText='Registration successful! Please verify your account via email.';
            document.getElementById('resendBtn').style.display='inline-block';
        } else alert(d.message || 'Registration failed');
    });
}

/* RESEND VERIFICATION EMAIL */
function resendVerification() {
    fetch('/api/resend-verification.php', {
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'X-CSRF-TOKEN': csrf.value
        },
        body: JSON.stringify({ email: email.value })
    })
    .then(r=>r.json())
    .then(d=>{
        if(d.success) message.innerText='Verification email resent. Please check your inbox.';
        else alert(d.message || 'Could not resend verification');
    });
}
</script>
</body>
</html>
