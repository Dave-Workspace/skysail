<?php
if (session_status() === PHP_SESSION_NONE) session_start();
require_once __DIR__ .'/config/config.php';
require_once __DIR__ .'/lib/Security.php';
require_once __DIR__ . '/config/csrf.php';

$isLoggedIn = isset($_SESSION['user_id']);
$isAdmin    = isset($_SESSION['role']) && $_SESSION['role']==='admin';
?>
<!DOCTYPE html>
<html lang="en">
<head><script async src="https://www.googletagmanager.com/gtag/js?id=G-Y404KZ61CH"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-Y404KZ61CH');
</script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Canada Immigration Blog | Latest IRCC Updates</title>
<meta name="description" content="Stay updated with Canada immigration news, Express Entry draws, Study Permit changes, and IRCC updates from Skysail.">
<meta name="keywords" content="Canada immigration news, IRCC updates, Express Entry draw, Study Permit news">
<link rel="canonical" href="https://www.skysailimmigration.com/posts.php">
    <link rel="apple-touch-icon" sizes="57x57" href="Images/img/Favicon/apple-icon-57x57.png">
    <link rel="apple-touch-icon" sizes="60x60" href="Images/img/Favicon/apple-icon-60x60.png">
    <link rel="apple-touch-icon" sizes="72x72" href="Images/img/Favicon/apple-icon-72x72.png">
    <link rel="apple-touch-icon" sizes="76x76" href="Images/img/Favicon/apple-icon-76x76.png">
    <link rel="apple-touch-icon" sizes="114x114" href="Images/img/Favicon/apple-icon-114x114.png">
    <link rel="apple-touch-icon" sizes="120x120" href="Images/img/Favicon/apple-icon-120x120.png">
    <link rel="apple-touch-icon" sizes="144x144" href="Images/img/Favicon/apple-icon-144x144.png">
    <link rel="apple-touch-icon" sizes="152x152" href="Images/img/Favicon/apple-icon-152x152.png">
    <link rel="apple-touch-icon" sizes="180x180" href="Images/img/Favicon/apple-icon-180x180.png">
    <link rel="icon" type="image/png" sizes="192x192"  href="Images/img/Favicon/android-icon-192x192.png">
    <link rel="icon" type="image/png" sizes="32x32" href="Images/img/Favicon/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="96x96" href="Images/img/Favicon/favicon-96x96.png">
    <link rel="icon" type="image/png" sizes="16x16" href="Images/img/Favicon/favicon-16x16.png">
    <link rel="manifest" href="Images/img/Favicon/manifest.json">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="CSS/reorganized_css.css">
    <link rel="stylesheet" href="CSS/style.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/intl-tel-input@25.10.1/build/css/intlTelInput.css">
    
</head>
<body class="work-page">
    <div id="page-loader" class="page-loader" role="status" aria-live="polite">
        <img class="page-loader__logo" src="Images/img/Favicon/apple-icon-180x180.png" alt="Loading…" />
        <div class="visually-hidden">Loading …</div>
    </div>

    <header role="banner">
        <!--<div class="RCIC-top"><img src="Images/RCIC Black.svg" alt="RCIC-IRB logo" class="img-fluid image-flip" style="height: 28px; width: auto;"></div>-->
        <nav class="navbar navbar-expand-md navbar-light bg-light sticky-header" role="navigation" aria-label="Main navigation">
            <div class="container-fluid">
                <a class="navbar-brand d-flex align-items-center" href="index.html">
                    <img src="Images/img/logo.png" alt="Skysail" class="navbar-brand-img">
                </a>
                <!-- Hamburger menu button for mobile/tablet (stays right) -->
                <button class="navbar-toggler d-flex d-md-none ms-auto" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <!-- Keep the collapsed nav on the right side by using justify-content-end -->
                <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
                    <ul class="navbar-nav align-items-md-center">
                        <li class="nav-item">
                            <a class="nav-link" href="study-in-canada.html">Study</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="work-in-canada.html">Work</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="visit-canada.html">Visit</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="permanent-residency-canada.html">Settle</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="other-services.html">Other</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link nav-btn nav-btn--filled outer" href="https://apply.skysailimmigration.com/client/register">Register</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link nav-btn nav-btn--filled" href="https://apply.skysailimmigration.com/client/login">Login</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link nav-btn nav-btn--filled" href="immigration-calculator.html">PR   Calculator</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </header>
    <div class="announcement-bar">

  <div class="announcement-inner">

    <i class="fa-solid fa-bullhorn announcement-icon"></i>

    <div class="announcement-marquee">
      <marquee
        onmouseover="this.stop()"
        onmouseout="this.start()"
        scrollamount="6">
        New portal live
        <span class="separator">|</span>
        CEC Draw
        <span class="separator">|</span>
        Healthcare Draw
      </marquee>
    </div>

  </div>
</div>


    <div class="calculator-container">
        <div id="main-content">

<header>
    <h2></h2>
    <div>
        <?php if($isAdmin): ?>
            <button onclick="location.href='/admin/dashboard.php'">Admin</button>
        <?php endif; ?>
        <?php if($isLoggedIn): ?>
            <button class="danger" onclick="logout()">Logout</button>
        <?php endif; ?>
    </div>
</header>
<section class="faq-hero">
  <div class="faq-hero-glow"></div>

  <div class="faq-hero-inner">
    <div class="faq-badge">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
        <path d="M12 17h.01"></path>
      </svg>
      Help Center
    </div>

    <h1>Frequently Asked Questions</h1>

    <p>
      Find answers to common questions about our services.
      Browse by category or search for specific topics.
    </p>
  </div>
</section>

<main>
    <div class="faq-search">
        <!-- <span class="search-icon">🔍</span> -->
        <input id="search" placeholder="Search for questions..." />
        <select id="categoryFilter" style="margin-bottom:20px;padding:12px;border-radius:12px;border:1px solid #cbd5f5;width:100%; display:none;" >
    <option value="">All Categories</option>
    </select>
    </div>

    <div class="faq-layout">
        <!-- LEFT SIDEBAR -->
        <aside id="categoryNav" class="faq-sidebar"></aside>

        <!-- RIGHT CONTENT -->
        <section id="posts" class="faq-content"></section>
    </div>
    <!--<div id="posts"></div>-->
    <!-- <button id="askQuestion">Still have questions? Reach out to us</button> -->
     <!-- ASK QUESTION CTA -->
    <div class="ask-card" id="ask-question">
        <div class="ask-icon">❓</div>
        <h3>Still have questions?</h3>
        <p>Can't find what you're looking for? Our team is here to help.</p>
        <button onclick="document.getElementById('askQuestion').click()">Ask a Question</button>
        <!--<button id="askQuestion">Still have questions? Reach out to us</button>-->
    </div>

    <!-- <div class="ask-card">
    <div class="ask-icon">❓</div>
    <h3>Still have questions?</h3>
    <p>
        Can’t find what you’re looking for?
        Our team is here to help you.
    </p>
    <button onclick="document.getElementById('askQuestion').click()">
        Ask a Question
    </button>
</div> -->

<!-- Hidden trigger (keeps your JS intact) -->
<button id="askQuestion" class="hidden"></button>

    <?php if ($isLoggedIn): ?>
    <h3>My Pending Questions</h3>
<div id="myPendingPosts"></div>
<?php endif; ?>
</main>


<!-- MODAL -->
<div class="modal" id="modal">
    <div class="modal-card">
        <span class="close" onclick="closeModal()">&times;</span>

        <h3 id="modalTitle">Account Access</h3>
        <input type="hidden" id="csrf" name="csrf_token" value="<?php echo htmlspecialchars($_SESSION['csrf_token'], ENT_QUOTES); ?>">

        <!-- EMAIL STEP -->
        <div id="emailStep">
            <div class="field">
                <label>Email</label>
                <input id="email" type="email" placeholder="Enter your email">
                <small class="error" id="emailError"></small>
            </div>

            <!-- ✅ CONTINUE BUTTON -->
            <button id="continueBtn" class="primary">Continue</button>
        </div>

        <!-- LOGIN -->
        <div id="loginBox" class="hidden">
            <div class="field password-field">
                <label>Password</label>
                <input id="loginPassword" type="password">
                <span class="toggle-eye" onclick="togglePassword('loginPassword', this)">👁</span>
                <small class="error" id="loginPasswordError"></small>
            </div>
            <button class="primary" onclick="login()">Login</button>
        </div>

        <!-- REGISTER -->
        <div id="registerBox" class="hidden">
            <div class="field">
                <label>Full name</label>
                <input id="fullName">
                <small class="error" id="nameError"></small>
            </div>

            <div class="field phone-field">
                <!--<label>Phone</label>-->
        <!-- <div class="phone-field">
            <select id="countryCode">
                <option value="+1" data-len="10">🇺🇸 +1</option>
                <option value="+91" data-len="10">🇮🇳 +91</option>
                <option value="+44" data-len="10">🇬🇧 +44</option>
                <option value="+61" data-len="9">🇦🇺 +61</option>
            </select>
            <input id="contact" placeholder="Phone number">
        </div> -->
        <input 
    id="contact"
    type="tel"
    name="contact"
    class="form-control"
    required
  placeholder=""
  >
        <small class="error" id="phoneError"></small>
            </div>

            <div class="field password-field">
                <label>Password</label>
                <input id="regPassword" type="password">
                <span class="toggle-eye" onclick="togglePassword('regPassword', this)">👁</span>
                <small class="hint">
                    Min 8 chars, 1 uppercase, 1 number, 1 special
                </small>
                <!-- Strength bar -->
        <div class="strength">
            <div id="strengthBar"></div>
        </div>
        <small id="strengthText"></small>
                <small class="error" id="passwordError"></small>
            </div>

            <div class="field password-field">
                <label>Confirm password</label>
                <input id="regConfirm" type="password">
                <span class="toggle-eye" onclick="togglePassword('regConfirm', this)">👁</span>
                <small class="error" id="confirmError"></small>
            </div>

            <button class="primary" onclick="register()">Create Account</button>
        </div>

        <!-- QUESTION -->
        <div id="questionBox" class="hidden">
            <input id="qTitle" placeholder="Question title">
            <textarea id="qContent" placeholder="Question details"></textarea>
            <div id="qCategoriesContainer"></div>
            <button class="success" onclick="submitQuestion()" style="margin-top:15px;">Submit</button>
        </div>

        <!-- RESEND VERIFICATION -->
        <button id="resendBtn" class="hidden" onclick="resendVerification()">
            Resend verification
        </button>
        <div id="message"></div>
    </div>
</div>

<div id="toast"></div>

<script>
// ===== VARIABLES =====
const modal=document.getElementById('modal');
const toastBox=document.getElementById('toast');
const postsDiv = document.getElementById('posts');
const search = document.getElementById('search');
const categoryFilter = document.getElementById('categoryFilter');
const myPendingDiv = document.getElementById('myPendingPosts');
const modalTitle = document.getElementById('modalTitle');
const loginBox = document.getElementById('loginBox');
const registerBox = document.getElementById('registerBox');
const questionBox = document.getElementById('questionBox');
const continueBtn = document.getElementById('continueBtn');
const resendBtn = document.getElementById('resendBtn');
const message = document.getElementById('message');
const strengthBar = document.getElementById('strengthBar');
const strengthText = document.getElementById('strengthText');
const QUESTIONS_PREVIEW_LIMIT = 5;

// INPUTS
const email = document.getElementById('email');
const loginPassword = document.getElementById('loginPassword');
const fullName = document.getElementById('fullName');
const contact = document.getElementById('contact');
const regPassword = document.getElementById('regPassword');
const regConfirm = document.getElementById('regConfirm');
const qTitle = document.getElementById('qTitle');
const qContent = document.getElementById('qContent');
const qCategoriesContainer = document.getElementById('qCategoriesContainer');
const csrf = document.getElementById('csrf').value;


const categoryIcons = {
  "Visit (Tourist) Visa – FAQs": "fa-plane-departure",
  "Work Visa – FAQs": "fa-briefcase",
  "Settle Visa – FAQs": "fa-house",
  "Study Visa – FAQs": "fa-graduation-cap",
  "Other Visa Types – FAQs": "fa-globe"
};


let allPosts=[];

let toastTimeout;

// ===== TOAST =====
function toast(msg, type = 'info'){
    toastBox.innerText=msg;
    
    // Remove old type classes (success, error, info)
    toastBox.classList.remove('success', 'error', 'info');

    toastBox.classList.add(type,'show'); 
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(()=>toastBox.classList.remove('show'),3000);
}

// ===== MODAL =====
function closeModal(){
    modal.classList.remove('show');
    setTimeout(()=>modal.style.display='none',250);
}

document.getElementById('askQuestion').onclick=()=>{
    modal.style.display='block';
    setTimeout(()=>modal.classList.add('show'),10);
    hideAll();
    <?php if($isLoggedIn): ?>
        modalTitle.innerText='Ask a Question';
        questionBox.classList.remove('hidden');   
        document.getElementById('emailStep').classList.add('hidden');     
        loadCategories();
    <?php else: ?>
        continueBtn.classList.remove('hidden');
    <?php endif; ?>
}

function hideAll(){
    document.getElementById('emailStep').classList.remove('hidden');
    loginBox.classList.add('hidden');
    registerBox.classList.add('hidden');
    questionBox.classList.add('hidden');
    continueBtn.classList.add('hidden');
    resendBtn.classList.add('hidden');
    message.innerText='';
     clearErrors();
}

// ===== EMAIL CHECK =====
// continueBtn.onclick=()=>{
//     hideAll();
//     fetch('/api/check-email.php',{
//         method:'POST',
//         headers:{
//             'Content-Type':'application/json',
//             'X-CSRF-TOKEN': csrf
//         },
//         body:JSON.stringify({email:email.value})
//     }).then(r=>r.json()).then(d=>{
//         if(d.exists) loginBox.classList.remove('hidden');
//         else registerBox.classList.remove('hidden');
//     });
// }

function validateEmail(){
    const val = email.value.trim();
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if(!val){
        showError('emailError','Email is required');
        return false;
    }
    if(!re.test(val)){
        showError('emailError','Enter a valid email address');
        return false;
    }
    return true;
}

continueBtn.onclick = () => {
     clearErrors();

    if(!validateEmail()) return;

    hideAll();

    fetch('/api/check-email.php',{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'X-CSRF-TOKEN': csrf
        },
        body: JSON.stringify({ email: email.value })
    })
    .then(r=>r.json())
    .then(d=>{
        // hide email step
        document.getElementById('emailStep').classList.add('hidden');

         switch (d.message) {

            case 'user is Registered and not verified':
                resendBtn.classList.remove('hidden');
                break;

            case 'user is registered and verified':
                loginBox.classList.remove('hidden');
                break;

            case 'user not exist':
                registerBox.classList.remove('hidden');
                document.getElementById('emailStep').classList.remove('hidden');
                break;

            default:
                // safety fallback
                showError(d.message || 'Something went wrong');
        }

        // if(d.exists){
        //     loginBox.classList.remove('hidden');
        // } else {
        //     registerBox.classList.remove('hidden');
        // }
    });
};

// ===== LOGIN =====
// function login(){
//     fetch('api/login.php',{
//         method:'POST',
//         headers:{
//             'Content-Type':'application/json',
//             'X-CSRF-TOKEN': csrf
//         },
//         body:JSON.stringify({email:email.value,password:loginPassword.value})
//     }).then(r=>r.json()).then(d=>{
//         if(d.success){
//             toast('Logged in');
//             location.reload();
//         } else if(d.message.includes('not_verified')){
//             resendBtn.classList.remove('hidden');
//             message.innerText='Verify your email first';
//         } else toast(d.message||'Login failed');
//     });
// }

function login(){
    clearErrors();

    if(!loginPassword.value){
        showError('loginPasswordError','Password required');
        return;
    }

    fetch('api/login.php',{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'X-CSRF-TOKEN': csrf
        },
        body:JSON.stringify({
            email: email.value,
            password: loginPassword.value
        })
    })
    .then(r=>r.json())
    .then(d => {
        if (d.user) {
            location.reload();
        } else if (d.message?.includes('not_verified')) {
            resendBtn.classList.remove('hidden');
            message.innerText = 'Verify your email first';
        } else {
            showError('loginPasswordError', d.message || 'Login failed');
        }
    });
}




// ===== REGISTER =====
// function register(){
//     if(regPassword.value!==regConfirm.value){toast('Passwords do not match'); return;}
//     fetch('api/register.php',{
//         method:'POST',
//         headers:{
//             'Content-Type':'application/json',
//             'X-CSRF-TOKEN': csrf
//         },
//         body:JSON.stringify({
//             name:fullName.value,
//             contact:contact.value,
//             email:email.value,
//             password:regPassword.value
//         })
//     }).then(r=>r.json()).then(d=>{
//         if(d.success){
//             toast('Verify your email');
//             hideAll();
//             resendBtn.classList.remove('hidden');
//         } else toast(d.message||'Registration failed');
//     });
// }

// function register(){
//     clearErrors();

//     if(!fullName.value.trim()){
//         showError('nameError','Name required');
//         return;
//     }

//     if(!validatePhone()) return;
//     if(!validatePassword()) return;

//     if(regPassword.value !== regConfirm.value){
//         showError('confirmError','Passwords do not match'); return;
//     }

//     const phone = contact.value.trim();
//     const country = countryCode.value;
//     if(!validatePhone(country, phone)){
//         showError('phoneError','Invalid phone number'); return;
//     }

//     fetch('api/register.php',{
//         method:'POST',
//         headers:{
//             'Content-Type':'application/json',
//             'X-CSRF-TOKEN': csrf
//         },
//         body:JSON.stringify({
//             name: fullName.value,
//             contact: phone,
//             countryCode: country,
//             email: email.value,
//             password: regPassword.value
//         })
//     })
    
//     .then(r=>r.json()).then(d=>{
//         if(d.success){
//             hideAll();
//             resendBtn.classList.remove('hidden');
//             document.getElementById('emailStep').classList.add('hidden');
//         } else {
//             //showError('emailError', d.message || 'Registration failed');
//             // Show specific email error if exists
//             if (d.errors?.email) {
//                 showError('emailError', d.errors.email[0]);
//                 loginBox.classList.remove('hidden');
//             } else {
//                 showError('emailError', d.message || 'Registration failed');
//             }
//         }
//     }).catch(() => {
//         showError('emailError', 'Network error. Please try again.');
//     });
// }

regPassword.oninput = () => {
    const val = regPassword.value;
    let score = 0;

    if(val.length >= 8) score++;
    if(/[A-Z]/.test(val)) score++;
    if(/[0-9]/.test(val)) score++;
    if(/[^A-Za-z0-9]/.test(val)) score++;

    strengthBar.className = '';
    if(score <= 1){
        strengthBar.style.width = '25%';
        strengthBar.classList.add('strength-weak');
        strengthText.innerText = 'Weak';
    } else if(score === 2 || score === 3){
        strengthBar.style.width = '60%';
        strengthBar.classList.add('strength-medium');
        strengthText.innerText = 'Medium';
    } else {
        strengthBar.style.width = '100%';
        strengthBar.classList.add('strength-strong');
        strengthText.innerText = 'Strong';
    }
};

function showError(id, msg){
    document.getElementById(id).innerText = msg;
}

function clearErrors(){
    document.querySelectorAll('.error').forEach(e=>e.innerText='');
}

// function validatePhone(){
//     const number = contact.value.replace(/\D/g,'');
//     const len = +countryCode.selectedOptions[0].dataset.len;

//     if(number.length !== len){
//         showError('phoneError',`Phone must be ${len} digits`);
//         return false;
//     }
//     return true;
// }

function validatePassword(){
    const p = regPassword.value;

    if(
        p.length < 8 ||
        !/[A-Z]/.test(p) ||
        !/[0-9]/.test(p) ||
        !/[^A-Za-z0-9]/.test(p)
    ){
        showError('passwordError','Password does not meet requirements');
        return false;
    }

    if(p !== regConfirm.value){
        showError('confirmError','Passwords do not match');
        return false;
    }

    return true;
}

function togglePassword(id, el){
    const input = document.getElementById(id);
    input.type = input.type === 'password' ? 'text' : 'password';
    el.textContent = input.type === 'password' ? '👁' : '🙈';
}


// ===== RESEND VERIFICATION =====
function resendVerification(){
    fetch('api/resend-verification.php',{
        method:'POST',
        headers:{'Content-Type':'application/json','X-CSRF-TOKEN': csrf},
        body:JSON.stringify({email:email.value})
    }).then(r=>r.json()).then(d=>{
        toast(d.success?'Verification resent':'Failed to resend', d.success ? 'success' : 'error');
    });
}

// ===== LOGOUT =====
function logout(){
    fetch('api/logout.php',{
        headers:{'X-CSRF-TOKEN': csrf}
    }).then(()=>{
        toast('Logged out','success');
        setTimeout(()=>location.reload(),500);
    });
}


function highlight(text, keyword){
    if(!keyword) return text;
    const re = new RegExp(`(${keyword})`, 'gi');
    return text.replace(re, '<span class="highlight">$1</span>');
}

// function groupPostsByCategory(posts){
//     const map = {};

//     posts.forEach(p=>{
//         if(p.categories.length === 0){
//             map['Uncategorized'] ??= { name:'Uncategorized', posts:[] };
//             map['Uncategorized'].posts.push(p);
//         } else {
//             p.categories.forEach(c=>{
//                 map[c.name] ??= { name:c.name, posts:[] };
//                 map[c.name].posts.push(p);
//             });
//         }
//     });

//     return Object.values(map).map(c=>({
//         ...c,
//         count: c.posts.length
//     }));
// }


function groupPostsByCategory(posts){
    const map = {};

    posts.forEach(p=>{
        if(!Array.isArray(p.categories)) p.categories = [];
        if(!Array.isArray(p.answers)) p.answers = [];

        // Determine lowest category priority for post
        p._catPriority = p.categories.length 
            ? Math.min(...p.categories.map(c => c.catPriority ?? 9999))
            : 9999;

        p._postPriority = p.categories.length 
            ? Math.min(...p.categories.map(c => c.priority ?? 9999))
            : 9999;

        if(p.categories.length === 0){
            map['Uncategorized'] ??= { name:'Uncategorized', posts:[] };
            map['Uncategorized'].posts.push(p);
        } else {
            p.categories.forEach(c=>{
                map[c.name] ??= { name:c.name, posts:[] };
                map[c.name].posts.push(p);
            });
        }
    });

    // Sort posts inside each category by post priority
    Object.values(map).forEach(cat=>{
        cat.posts.sort((a,b)=>a._postPriority - b._postPriority);
    });

    // Sort categories globally by lowest category priority
    const categories = Object.values(map)
        .sort((a,b)=>{
            const aPri = Math.min(...a.posts.map(p=>p._catPriority));
            const bPri = Math.min(...b.posts.map(p=>p._catPriority));
            return aPri - bPri;
        });

    return categories.map(c=>({
        ...c,
        count: c.posts.length
    }));
}



function renderFAQ(categories){
    const nav = document.getElementById('categoryNav');
    const content = document.getElementById('posts');
    nav.innerHTML = '';
    content.innerHTML = '';

    categories.forEach(cat=>{
        /* ===== SIDEBAR ===== */
        const navBtn = document.createElement('button');
        const iconHTML =   cat.icon ||   `<i class="fa-solid ${categoryIcons[cat.name] || 'fa-book'}"></i>`;
        navBtn.className = 'faq-cat-btn';
        navBtn.innerHTML = `
            <span class="cat-title">${iconHTML} ${cat.name}</span>
            <span>${cat.posts.length}</span>
        `;
        navBtn.onclick = ()=> {
            document.getElementById(`cat-${cat.name}`).scrollIntoView({behavior:'smooth'});
        };
        nav.appendChild(navBtn);

        /* ===== QUESTIONS ===== */
        const questionsHtml = cat.posts.map((q, index)=>`
            <div class="faq-item ${index >= QUESTIONS_PREVIEW_LIMIT ? 'faq-hidden' : ''}">
                <button class="faq-question">
                    <span>${q.title}</span>
                    <span class="chevron">⌄</span>
                </button>
                <div class="faq-answer">
                    ${q.answers.map(a=>`<p>${a.content}</p>`).join('')}
                </div>
            </div>
        `).join('');

        const hiddenCount = Math.max(0, cat.posts.length - QUESTIONS_PREVIEW_LIMIT);

        /* ===== CONTENT ===== */
        const section = document.createElement('div');
        //const iconHTML =   cat.icon ||   `<i class="fa-solid ${categoryIcons[cat.name] || 'fa-book'}"></i>`;
        section.className = 'category-section';
        section.id = `cat-${cat.name}`;
        section.innerHTML = `
            <div class="category-header">
                <h2>${iconHTML} ${cat.name}</h2>
                <span>${cat.posts.length} questions</span>
            </div>

            <div class="category-box">
                ${questionsHtml}
            </div>

            ${
                hiddenCount > 0
                ? `<button class="show-more-btn" data-category="${cat.id}">
                       Show ${hiddenCount} more questions
                   </button>`
                : ''
            }
        `;

        content.appendChild(section);
    });

    bindAccordion();
    bindShowMore();
    bindActiveCategory();
    bindIconBounce();
}


function bindIconBounce() {
  const headers = document.querySelectorAll('.category-header i');

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('bounce');

          setTimeout(() => {
            entry.target.classList.remove('bounce');
          }, 600);
        }
      });
    },
    { threshold: 0.6 }
  );

  headers.forEach(icon => observer.observe(icon));
}

function bindActiveCategory() {
  const sections = document.querySelectorAll('.category-section');
  const navButtons = document.querySelectorAll('.faq-cat-btn');

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;

          navButtons.forEach(btn => btn.classList.remove('active'));

          const activeBtn = [...navButtons].find(btn =>
            btn.onclick.toString().includes(id)
          );

          if (activeBtn) {
            activeBtn.classList.add('active');
          }
        }
      });
    },
    {
      rootMargin: '-40% 0px -50% 0px',
      threshold: 0
    }
  );

  sections.forEach(section => observer.observe(section));
}


function bindShowMore(){
    document.querySelectorAll('.show-more-btn').forEach(btn=>{
        btn.onclick = ()=>{
            const section = btn.closest('.category-section');
            const hidden = section.querySelectorAll('.faq-hidden');

            const expanded = btn.classList.toggle('expanded');

            hidden.forEach(el=>{
                el.style.display = expanded ? 'block' : 'none';
            });

            btn.textContent = expanded
                ? 'Show less'
                : `Show ${hidden.length} more questions`;
        };
    });
}

function bindAccordion(){
    document.querySelectorAll('.faq-question').forEach(btn=>{
        btn.onclick = ()=>{
            const answer = btn.nextElementSibling;
            const open = answer.style.display === 'block';
            answer.style.display = open ? 'none' : 'block';
        };
    });
}

function getFilteredCategories() {
    const q = search.value.trim().toLowerCase();
    const selectedCategory = categoryFilter.value;

    return allCategories
        .map(cat => {
            // category dropdown filter
            if (selectedCategory && cat.name.toLowerCase() !== selectedCategory) {
                return null;
            }

            // post filter
            const posts = cat.posts.filter(p =>
                p.title.toLowerCase().includes(q) ||
                p.content.toLowerCase().includes(q) ||
                p.answers.some(a =>
                    a.content.toLowerCase().includes(q)
                )
            );

            if (!posts.length) return null;

            return {
                ...cat,
                posts,
                count: posts.length
            };
        })
        .filter(Boolean);
}

function applyFiltersAndRender() {
    const filteredCategories = getFilteredCategories();

    renderFAQ(filteredCategories);     // sidebar + content
    //bindActiveCategory();
}




// ===== LOAD POSTS =====
// function loadPosts(){
//     fetch('/api/public/posts.php').then(r=>r.json()).then(d=>{
//         allPosts=d.posts;
//         renderPosts(allPosts);
//     });
// }

let allCategories = [];

function loadPosts(){
    fetch('api/public/posts.php')
        .then(r=>r.json())
        .then(d=>{
	    if(!d || !Array.isArray(d.posts)) {
                 console.error('Invalid API response:', d);
		allCategories = [];
                renderCategories([]);
                return;
            }
            allCategories = groupPostsByCategory(d.posts);
            populateCategoryDropdown(allCategories);
            renderCategories(allCategories);

            //const grouped = groupPostsByCategory(d.posts);
            renderFAQ(allCategories);
            //bindActiveCategory();
        })
	.catch(err => {
            console.error('Failed to load posts:', err);
        });
}


loadPosts();

// ===== RENDER POSTS =====
function renderPosts(posts){
    postsDiv.innerHTML='';
    posts.forEach(p=>{
        const div=document.createElement('div');
        div.className='post';
        div.innerHTML=`
            <b>${p.title}</b>
            <p>${p.content}</p>
            <p style="font-size:12px;color:#64748b;margin-top:5px;">
                Categories: ${p.categories.map(c=>c.name).join(', ')}
            </p>
        `;
        p.answers.forEach(a=>{
            div.innerHTML+=`<div class="reply">${a.content}</div>`;
        });

        <?php if($isAdmin): ?>
        div.innerHTML+=`
            <textarea id="r${p.id}" placeholder="Admin reply"></textarea>
            <button onclick="reply(${p.id})">Reply</button>
        `;
        <?php endif; ?>

        postsDiv.appendChild(div);
    });
}

// function renderCategories(categories){
//     postsDiv.innerHTML='';
//     const keyword = search.value.toLowerCase();

//     categories.forEach(cat=>{
//         const section = document.createElement('div');

//         /* ===== HEADER ===== */
//         const header = document.createElement('div');
//         header.className = 'category-header';
//         header.innerHTML = `
//             <h3>${cat.name}</h3>
//             <span class="category-count">(${cat.count}) ⯆</span>
//         `;

//         /* ===== POSTS WRAPPER ===== */
//         const postsWrap = document.createElement('div');
//         postsWrap.className = 'category-posts';

//         header.onclick = ()=>{
//             postsWrap.classList.toggle('collapsed');
//             header.querySelector('span').innerText =
//                 `(${cat.count}) ${postsWrap.classList.contains('collapsed') ? '⯈' : '⯆'}`;
//         };

//         /* ===== POSTS ===== */
//         cat.posts.forEach(p=>{
//             const div=document.createElement('div');
//             div.className='post';

//             div.innerHTML=`
//                 <b>${highlight(p.title, keyword)}</b>
//                 <p>${highlight(p.content, keyword)}</p>
//                 <p style="font-size:12px;color:#64748b;">
//                     Categories: ${p.categories.map(c=>c.name).join(', ')}
//                 </p>
//             `;

//             p.answers.forEach(a=>{
//                 div.innerHTML+=`
//                     <div class="reply">
//                         ${highlight(a.content, keyword)}
//                     </div>
//                 `;
//             });

//             postsWrap.appendChild(div);
//         });

//         section.appendChild(header);
//         section.appendChild(postsWrap);
//         postsDiv.appendChild(section);
//     });
// }

function renderCategories(categories){
    postsDiv.innerHTML = '';
    const keyword = search.value.toLowerCase();

    categories.forEach(cat=>{
        const section = document.createElement('div');

        /* ===== HEADER ===== */
        const header = document.createElement('div');
        header.className = 'category-header';
        header.innerHTML = `
            <h3>${cat.name}</h3>
            <span class="category-count">(${cat.count})</span>
        `;

        /* ===== POSTS WRAPPER ===== */
        const postsWrap = document.createElement('div');
        postsWrap.className = 'category-posts';

        const allPosts = cat.posts;
        let expanded = false;

        function renderPostsList(){
            postsWrap.innerHTML = '';

            const visiblePosts = expanded
                ? allPosts
                : allPosts.slice(0, QUESTIONS_PREVIEW_LIMIT);

            visiblePosts.forEach(p=>{
                const div = document.createElement('div');
                div.className = 'post';

                div.innerHTML = `
                    <b>${highlight(p.title, keyword)}</b>
                    <p>${highlight(p.content, keyword)}</p>
                    <p style="font-size:12px;color:#64748b;">
                        Categories: ${p.categories.map(c=>c.name).join(', ')}
                    </p>
                `;

                p.answers.forEach(a=>{
                    div.innerHTML += `
                        <div class="reply">${highlight(a.content, keyword)}</div>
                    `;
                });

                postsWrap.appendChild(div);
            });

            /* ===== SHOW MORE / LESS ===== */
            if(allPosts.length > QUESTIONS_PREVIEW_LIMIT){
                const remaining = allPosts.length - QUESTIONS_PREVIEW_LIMIT;

                const toggle = document.createElement('button');
                toggle.className = 'show-more-btn';
                toggle.innerHTML = expanded
                    ? 'Show less'
                    : `Show ${remaining} more question${remaining > 1 ? 's' : ''}`;

                toggle.onclick = ()=>{
                    expanded = !expanded;
                    renderPostsList();
                };

                postsWrap.appendChild(toggle);
            }
        }

        renderPostsList();

        section.appendChild(header);
        section.appendChild(postsWrap);
        postsDiv.appendChild(section);
    });
}



// ===== SEARCH =====
// search.oninput=()=>{
//     const q=search.value.toLowerCase();
//     renderPosts(allPosts.filter(p=>p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q)));
// }


function populateCategoryDropdown(categories){
    categoryFilter.innerHTML = `<option value="">All Categories</option>`;
    categories.forEach(c=>{
        const opt = document.createElement('option');
        opt.value = c.name.toLowerCase();
        opt.textContent = `${c.name} (${c.count})`;
        categoryFilter.appendChild(opt);
    });
}


search.oninput = ()=>{
    const q = search.value.toLowerCase();

    const filtered = allCategories
        .map(cat=>{
            const posts = cat.posts.filter(p =>
                p.title.toLowerCase().includes(q) ||
                p.content.toLowerCase().includes(q) ||
                p.answers.some(a => a.content.toLowerCase().includes(q))
            );

            return {
                ...cat,
                posts,
                count: posts.length
            };
        })
        .filter(cat=>cat.posts.length);

    renderCategories(filtered);
};

function applyAdvancedSearch(){
    const q = search.value.toLowerCase();
    const selectedCategory = categoryFilter.value;

    const filtered = allCategories
        .map(cat=>{
            if(selectedCategory && cat.name.toLowerCase() !== selectedCategory){
                return null;
            }

            const posts = cat.posts.filter(p =>
                p.title.toLowerCase().includes(q) ||
                p.content.toLowerCase().includes(q) ||
                p.answers.some(a => a.content.toLowerCase().includes(q))
            );

            return posts.length ? {
                ...cat,
                posts,
                count: posts.length
            } : null;
        })
        .filter(Boolean);

    renderCategories(filtered);
}

//search.oninput = applyAdvancedSearch;
//categoryFilter.onchange = applyAdvancedSearch;

search.addEventListener('input', applyFiltersAndRender);
categoryFilter.addEventListener('change', applyFiltersAndRender);



setTimeout(()=>{
    document.querySelectorAll('.category-posts').forEach((el,i)=>{
        if(i>1) el.classList.add('collapsed');
    });
},50);



// ==== LOAD MY PENDING POSTS =====

function loadMyPendingPosts(){
    fetch('api/user/pending-posts.php', {
        headers:{'X-CSRF-TOKEN': csrf}
    })
    .then(r=>{
        if(r.status === 401) throw 'Not logged in';
        return r.json();
    })
    .then(d=>{
        myPendingDiv.innerHTML = '';
        if(!d.success || !d.posts.length){
            myPendingDiv.innerHTML = '<p>No pending questions.</p>';
            return;
        }

        d.posts.forEach(p=>{
            const div = document.createElement('div');
            div.className = 'post';
            div.innerHTML = `
                <b>${p.title}</b>
                <p>${p.content}</p>
                <p style="font-size:12px;color:#64748b;">
                    Status: ${p.status} | Answers: ${p.answer_count}
                </p>
            `;
            myPendingDiv.appendChild(div);
        });
    })
    .catch(err=>{
        console.log(err);
    });
}

// Only load for logged-in users
<?php if($isLoggedIn): ?>
loadMyPendingPosts();
<?php endif; ?>



// ===== ADMIN REPLY =====
function reply(id){
    const content=document.getElementById('r'+id).value;
    fetch('api/admin/reply.php',{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'X-CSRF-TOKEN': csrf
        },
        body:JSON.stringify({post_id:id,content})
    }).then(()=>{toast('Replied','success'); loadPosts();});
}

// ===== LOAD CATEGORIES =====
function loadCategories(){
    fetch('api/get-categories.php',{
        headers:{'X-CSRF-TOKEN': csrf}
    }).then(r=>r.json()).then(d=>{
        qCategoriesContainer.innerHTML='';
        // d.categories.forEach(c=>{
        //     if(!c.disabled){
        //         const label = document.createElement('label');
        //         label.innerHTML=`<input type="checkbox" value="${c.id}"> ${c.name}`;
        //         qCategoriesContainer.appendChild(label);
        //     }
        // });
        const select = document.createElement('select');
select.id = 'visaCategory';
select.name = 'visaCategory';
//select.multiple = true;

const defaultOption = document.createElement('option');
defaultOption.value = '';
defaultOption.textContent = '-- Select Category --';
select.appendChild(defaultOption);

d.categories.forEach(c => {
    if (!c.disabled) {
        const option = document.createElement('option');
        option.value = c.id;
        option.textContent = c.name;
        select.appendChild(option);
    }
});

qCategoriesContainer.appendChild(select);
    });
}

// ===== SUBMIT QUESTION =====
function submitQuestion(){
    //const selected = Array.from(document.querySelectorAll('#qCategoriesContainer input:checked')).map(i=>i.value);
    // multi 
//     const selected = Array.from(
//     document.getElementById('visaCategory').selectedOptions
// ).map(option => option.value);

const selected = [document.getElementById('visaCategory').value].filter(val => val); // Remove empty values

    fetch('api/create-post.php',{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'X-CSRF-TOKEN': csrf
        },
        body:JSON.stringify({
            title:qTitle.value,
            content:qContent.value,
            categories:selected
        })
    }).then(r=>r.json()).then(d=>{
        if(d.success){
            toast('Question submitted','success');
            loadMyPendingPosts();
            loadPosts();
            closeModal();
        } else toast(d.message, 'error');
    });
}

// ===== SESSION REFRESH =====
// setInterval(()=>{
//     fetch('/api/session-refresh.php',{
//         headers:{'X-CSRF-TOKEN': csrf}
//     }).then(r=>{
//         if(r.status===401){
//             toast('Session expired'); 
//             setTimeout(()=>location.reload(),1000);
//         } else return r.json();
//     }).then(d=>{
//         if(d?.csrf_token) document.getElementById('csrf').value=d.csrf_token;
//     });
// },60000);

// ===== SILENT ADMIN POSTS REFRESH =====
<?php if($isAdmin): ?>
//setInterval(()=>loadPosts(),15000);
<?php endif; ?>
</script>
</div>

    </div>

    <!-- Let's Start Your Canadian Journey Section -->
    <section class="journey-section">
        <div class="journey-dark-strip"></div>
        <div class="container position-relative">
            <div class="journey-content-wrapper">
                <div class="row align-items-center position-relative">
                    <!-- Left Side: Content -->
                    <div class="col-lg-8 col-md-12 journey-text-col">
                        <div class="journey-text-content">
                            <h2 class="journey-title">Let's Start Your Canadian Journey</h2>
                            <p class="journey-desc">
                                Join hundreds of successful immigrants who chose SkySail for their seamless transition to Canada.
                            </p>
                            <div class="journey-cta-wrapper">
                                <a href="https://apply.skysailimmigration.com/client/register" class="fancy_button px-4 py-2 fancy">Register Now</a>
                            </div>
                        </div>
                    </div>

                    <!-- Right Side: Image -->
                    <div class="col-lg-4 col-md-12 journey-image-col">
                        <div class="journey-image-wrapper">
                            <img src="Images/cta-img01.png"
                                 alt="Student with smartphone"
                                 class="journey-main-image" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <div id="footer-spacer" style="background-color: #23235b;"></div>

    <!-- Footer start here! -->
        <footer id="site-footer" class="mt-5">
        <div class="container py-5" id="footer-content">
            <!-- Top row (above the line) -->
            <div class="row footer-top gy-4">
                <!-- Column1: logo + address + social stacked -->
                <div class="col-12 col-lg-4">
                    <div class="row g-3">
                        <!-- Row1: Logo -->
                        <div class="col-12">
                            <div class="footer-logo d-flex align-items-center">
                                <img src="Images/img/Logo_Footer.png" alt="Skysail logo" class="footer-logo-large">
                            </div>
                        </div>
                        <!-- Row2: Address -->
                        <div class="col-12">
                            <address>
                                <a href="office-locations.html">
                                    <span>CANADA  |  INDIA</span> </a>
                            </address>
                        </div>
                        <!-- Row3: Social icons -->
                        <div class="col-12">
                            <div class="footer-social">
                                <a href="https://www.linkedin.com/company/skysailimmigration/" aria-label="LinkedIn"><i class="bi bi-linkedin"></i></a>
                                <a href="https://www.facebook.com/immigrationskysail" aria-label="Facebook"><i class="bi bi-facebook"></i></a>
                                <a href="https://www.instagram.com/skysailimmigration/" aria-label="Instagram"><i class="bi bi-instagram"></i></a>
                                <a href="https://www.youtube.com/@skysail_Immigration" aria-label="YouTube"><i class="bi bi-youtube"></i></a>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Grouped link columns: evenly spaced on large screens, stacked on small -->
                <div class="col-12 col-lg-8">
                    <div class="row g-4">
                        <!-- Can Services -->
                        <div class="col-12 col-md-4">
                            <h6 class="mb-2">SkySail Services</h6>
                            <ul>
                                <li><a class="footer-link" href="study-in-canada.html">Study</a></li>
                                <li><a class="footer-link" href="work-in-canada.html">Work</a></li>
                                <li><a class="footer-link" href="visit-canada.html">Visit</a></li>
                                <li><a class="footer-link" href="permanent-residency-canada.html">Settle</a></li>
                                <li><a class="footer-link" href="other-services.html">Other</a></li>
                            </ul>
                        </div>

                        <!-- Important Links -->
                        <div class="col-12 col-md-4">
                            <h6 class="mb-2">Important Links</h6>
                            <ul>
                                <li><a class="footer-link" href="our-story.html">Our Story</a></li>
                                <li><a class="footer-link" href="careers.html">Careers</a></li>
                                <li><a class="footer-link" href="#">Press and Media</a></li>
                                <li><a class="footer-link" href="contact.html">Contact</a></li>
                            </ul>
                        </div>

                        <!-- Can Resources -->
                        <div class="col-12 col-md-4">
                            <h6 class="mb-2">Sky Resources</h6>
                            <ul>
                                <li><a class="footer-link" href="#">Blog</a></li>
                                <li><a class="footer-link" href="#">Webinar</a></li>
                                <li><a class="footer-link" href="#">Sky Insight</a></li>
                                <li><a class="footer-link" href="office-locations.html">Our Offices</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Bottom row (under the line) -->
            <div class="row footer-bottom align-items-center pt-3 mt-4">
                <!-- Desktop: left | center | right
                Mobile: stacked full-width blocks -->
                <div class="col-12 col-md-4 text-center text-md-start text-white-50 mb-3 mb-md-0">
                    &copy; <span id="year"></span> SkySail Immigration
                </div>

                <div class="col-12 col-md-4 mb-3 mb-md-0">
                    <div class="footer-bottom-logos">

                        <img src="Images/capic-logo.webp" alt="CAPIC logo" class="footer-certification-logo">

                        <img src="Images/RCIC-IRB-Logo-footer.webp" alt="RCIC-IRB logo" class="footer-certification-logo">

                        <a href="https://apps.apple.com/ca/app/skysail-immigration/id6468471315" class="footer-app-link" aria-label="Download on the App Store">
                            <img src="Images/app-store.png" alt="Download on the App Store" class="footer-app-logo">
                        </a>

                        <a href="https://play.google.com/store/apps/details?id=com.skysail.immigration&pcampaignid=web_share" class="footer-app-link" aria-label="Get it on Google Play">
                            <img src="Images/google-play.png" alt="Get it on Google Play" class="footer-app-logo">
                        </a>

                    </div>
                </div>

                <div class="col-12 col-md-4 text-center text-md-end">
                    <a href="privacy-policy.html">Privacy Policy</a>
                </div>
            </div>
        </div>
    </footer>
    <!-- Footer end here! -->

    <!-- SkySail Emoji Back To Top -->
    <button type="button"
            id="skyBackToTop"
            class="sky-emoji-top"
            aria-label="Back to top">

        <span class="sky-emoji-orb"></span>

        <span class="sky-emoji-face">👆</span>

        <span class="sky-emoji-sparkle sparkle-1">✨</span>
        <span class="sky-emoji-sparkle sparkle-2">✦</span>
    </button>
    

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="JS/script.js"></script>
    <script src="JS/page-loader.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/intl-tel-input@25.10.1/build/js/intlTelInput.min.js"></script>
    <script>
document.addEventListener("DOMContentLoaded", function () {

  const input = document.querySelector("#contact");

  const iti = window.intlTelInput(input, {
    initialCountry: "auto",
    separateDialCode: true,
    autoPlaceholder: "aggressive",
    loadUtils: () =>
      import("https://cdn.jsdelivr.net/npm/intl-tel-input@25.10.1/build/js/utils.js"),
    geoIpLookup: function (success, failure) {
      fetch("https://ipapi.co/json")
        .then(res => res.json())
        .then(data => success(data.country_code))
        .catch(() => failure());
    }
  });

  // Optional: live blur validation
  input.addEventListener("blur", async function () {
    if (!input.value.trim()) return;
    await iti.promiseUtilsLoaded;
    if (iti.isValidNumber()) {
      input.classList.remove("is-invalid");
      input.classList.add("is-valid");
    } else {
      input.classList.add("is-invalid");
      input.classList.remove("is-valid");
    }
  });

  // Your register function
  window.register = async function () {
    clearErrors();

    if (!fullName.value.trim()) {
      showError('nameError','Name required');
      return;
    }

    // Wait for phone utils
    await iti.promiseUtilsLoaded;

    if (!iti.isValidNumber()) {
      showError('phoneError','Invalid phone number');
      return;
    }

    if (!validatePassword()) return;

    if (regPassword.value !== regConfirm.value) {
      showError('confirmError','Passwords do not match');
      return;
    }

    const fullNumber = iti.getNumber();  // full international format
    const country = iti.getSelectedCountryData().dialCode;

    let phone = fullNumber;
if (fullNumber.startsWith('+' + country)) {
    phone = fullNumber.slice(country.length + 1).trim(); // remove +1
}

console.log("National number:", phone);

    const payload = {
    name: fullName.value,
    contact: phone,
    countryCode: country,
    email: email.value,
    password: regPassword.value
};

console.log("Payload to send:", payload);



    fetch('api/register.php', {
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'X-CSRF-TOKEN': csrf
      },
      body: JSON.stringify(payload)
    })
    .then(r=>r.json())
    .then(d=>{
      if(d.success){
        hideAll();
        resendBtn.classList.remove('hidden');
        document.getElementById('emailStep').classList.add('hidden');
      } else {
        if (d.errors?.email) {
          showError('emailError', d.errors.email[0]);
          loginBox.classList.remove('hidden');
        } else {
          showError('emailError', d.message || 'Registration failed');
        }
      }
    })
    .catch(() => {
      showError('emailError', 'Network error. Please try again.');
    });
  }

});

window.addEventListener("load", () => {
    if (window.location.hash) {
        setTimeout(() => {
            const el = document.querySelector(window.location.hash);
            if (el) {
                el.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        }, 1400); // delay allows JS-rendered content to finish
    }
});
</script>
<script src="JS/button.js"></script>
</body>
</html>

