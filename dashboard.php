<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once __DIR__.'/config/config.php';
require_once __DIR__.'/lib/Security.php';
?>
<!DOCTYPE html>
<html>
<head>
<title>Knowledge Base</title>
<style>
/* Categories and posts */
.category { cursor:pointer; margin:5px; display:inline-block; padding:5px 10px; background:#eee; border-radius:5px; }
.category.active { background:#007bff; color:white; }
.post { border-bottom:1px solid #ccc; padding:10px 0; }
.reply { margin-left:20px; color:green; }
.cat-section { margin-top:10px; }
.posts-container { display:none; margin-left:10px; }

/* CTA button */
#askQuestion { margin-top:20px; padding:10px 15px; background:#28a745; color:white; border:none; border-radius:5px; cursor:pointer; }

/* Modal overlay */
#loginModal { display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:1000; }
#loginContent { background:white; max-width:400px; margin:100px auto; padding:20px; border-radius:10px; position:relative; }

/* Only X closes modal */
#closeModal { position:absolute; top:5px; right:10px; cursor:pointer; font-size:18px; }

/* Login/Register and Question Form styles */
#loginBox, #registerBox, #questionBox { margin-top:10px; }
.meter { margin-top:5px; }
.meter span { color:red; }
.meter span.valid { color:green; }
#strengthBar { width:100%;height:10px;background:#eee;margin-top:5px; }
#strengthFill { height:100%;width:0%;background:red; }
#message { margin-top:10px; color:blue; }
#resendBtn { margin-top:5px; }

/* Question form */
#questionBox input, #questionBox select, #questionBox textarea { display:block; width:100%; margin-bottom:5px; }

/* Hidden class for toggle */
.hidden { display:none; }
</style>
</head>
<body>

<h2>Knowledge Base</h2>

<div id="categories"></div>
<div id="allPosts"></div>

<button id="askQuestion">Still have questions? Reach out to us and we’ll get you an answer.</button>

<!-- LOGIN/REGISTER/QUESTION MODAL -->
<div id="loginModal">
    <div id="loginContent">
        <span id="closeModal">&times;</span>
        <h3 id="modalTitle">Account Access</h3>
        <input type="hidden" id="csrf" value="<?= $_SESSION['csrf_token'] ?>">

        <!-- Email -->
        <input type="email" id="email" placeholder="you@example.com" required>
        <button id="checkEmailBtn">Continue</button>

        <!-- LOGIN -->
        <div id="loginBox" style="display:none;margin-top:10px;">
            <input type="password" id="loginPassword" placeholder="Password">
            <button id="loginBtn">Login</button>
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

            <button id="registerBtn">Create Account</button>
        </div>

        <!-- QUESTION FORM for logged-in users -->
        <div id="questionBox" style="display:none;margin-top:10px;">
            <input type="text" id="qTitle" placeholder="Question Title *">
            <textarea id="qContent" placeholder="Question Content *"></textarea>
            <select id="qCategories" multiple></select>
            <button id="submitQuestionBtn">Submit Question</button>
        </div>

        <p id="message"></p>
        <button id="resendBtn" style="display:none;" onclick="resendVerification()">Resend verification email</button>
    </div>
</div>

<script src="https://www.google.com/recaptcha/api.js" async defer></script>

<script>
const csrf = '<?= $_SESSION['csrf_token'] ?>';
const modal = document.getElementById('loginModal');
const closeModal = document.getElementById('closeModal');
const loginBox = document.getElementById('loginBox');
const registerBox = document.getElementById('registerBox');
const questionBox = document.getElementById('questionBox');
const message = document.getElementById('message');
const resendBtn = document.getElementById('resendBtn');
const strengthFill = document.getElementById('strengthFill');

/* ----- Category & Posts ----- */
function loadCategories(){
    fetch('/api/get-categories.php', { headers:{'X-CSRF-TOKEN':csrf} })
    .then(r=>r.json()).then(d=>{
        if(d.success){
            const catDiv = document.getElementById('categories');
            catDiv.innerHTML='';
            d.categories.forEach(c=>{
                if(!c.disabled){
                    const el=document.createElement('div');
                    el.className='category';
                    el.innerText=c.name;
                    el.dataset.id=c.id;
                    el.onclick=()=>toggleCategory(c.id,el);
                    catDiv.appendChild(el);
                }
            });
            loadAllPosts(d.categories.filter(c=>!c.disabled).map(c=>c.id));
        }
    });
}

function toggleCategory(catId, el){
    el.classList.toggle('active');
    const postsContainer=document.querySelector(`#cat-${catId}`);
    if(postsContainer) postsContainer.style.display = postsContainer.style.display==='none' ? 'block' : 'none';
}

function loadAllPosts(categoryIds){
    fetch('/api/public/posts.php',{ headers:{'X-CSRF-TOKEN':csrf} })
    .then(r=>r.json()).then(d=>{
        const allPostsDiv=document.getElementById('allPosts');
        allPostsDiv.innerHTML='';
        if(d.success){
            categoryIds.forEach(cid=>{
                const catPosts=d.posts.filter(p=>p.categories.includes(cid));
                if(catPosts.length===0) return;
                
                const section=document.createElement('div');
                section.className='cat-section';
                const header=document.createElement('h3');
                header.innerText=catPosts[0].category_names[cid];
                header.style.cursor='pointer';
                header.onclick=()=>section.querySelector('.posts-container').classList.toggle('hidden');
                section.appendChild(header);

                const postsContainer=document.createElement('div');
                postsContainer.className='posts-container';
                postsContainer.id=`cat-${cid}`;
                catPosts.forEach(p=>{
                    const div=document.createElement('div');
                    div.className='post';
                    div.innerHTML=`<strong>${p.title}</strong><p>${p.content}</p>`;
                    if(p.answers.length>0){
                        p.answers.forEach(a=>{
                            const ans=document.createElement('div');
                            ans.className='reply';
                            ans.innerText='Answer: '+a.content;
                            div.appendChild(ans);
                        });
                    }
                    postsContainer.appendChild(div);
                });
                section.appendChild(postsContainer);
                allPostsDiv.appendChild(section);
            });
        } else allPostsDiv.innerHTML='No posts available';
    });
}

/* ----- Modal behavior ----- */
document.getElementById('askQuestion').onclick=function(){
    if(<?= isset($_SESSION['user_id']) ? 'true' : 'false' ?>){
        modal.style.display='block';
        loginBox.style.display='none';
        registerBox.style.display='none';
        questionBox.style.display='block';
        document.getElementById('modalTitle').innerText='Ask a Question';
        loadQuestionCategories();
    } else {
        modal.style.display='block';
        loginBox.style.display='none';
        registerBox.style.display='none';
        questionBox.style.display='none';
        document.getElementById('modalTitle').innerText='Account Access';
    }
}

// Only X closes modal
closeModal.onclick=function(){ modal.style.display='none'; }
modal.onclick = e => { if(e.target===modal) e.stopPropagation(); }

/* ----- Login/Register functions ----- */
document.getElementById('checkEmailBtn').onclick=checkEmail;
document.getElementById('loginBtn').onclick=login;
document.getElementById('registerBtn').onclick=register;

function checkEmail() {
    fetch('/api/check-email.php', {
        method:'POST',
        headers:{'Content-Type':'application/json','X-CSRF-TOKEN':csrf},
        body: JSON.stringify({ email: email.value })
    }).then(r=>r.json()).then(d=>{
        loginBox.style.display='none'; 
        registerBox.style.display='none'; 
        message.innerText=''; 
        resendBtn.style.display='none';
        if(d.exists) loginBox.style.display='block'; 
        else registerBox.style.display='block';
    });
}

function updateStrength(p) {
    const rules={ upper:/[A-Z]/.test(p), lower:/[a-z]/.test(p), number:/\d/.test(p), special:/[^A-Za-z0-9]/.test(p), length:p.length>=8 };
    let score=Object.values(rules).filter(v=>v).length;
    strengthFill.style.width=(score/5*100)+'%';
    strengthFill.style.background=score<=2?'red':score<5?'orange':'green';
    for(let r in rules) document.getElementById(r).className=rules[r]?'valid':'';
}

function login() {
    fetch('/api/login.php', {
        method:'POST',
        headers:{'Content-Type':'application/json','X-CSRF-TOKEN':csrf},
        body: JSON.stringify({ email: email.value, password: loginPassword.value })
    }).then(r=>r.json()).then(d=>{
        if(d.success){ location.reload(); } 
        else if(d.message==='not_verified'){ message.innerText='Verify email first'; resendBtn.style.display='inline-block'; } 
        else alert(d.message || 'Invalid credentials');
    });
}

function register() {
    if(regPassword.value!==regConfirm.value){ alert('Passwords do not match'); return; }
    if(!grecaptcha.getResponse()){ alert('Complete reCAPTCHA'); return; }
    fetch('/api/register.php', {
        method:'POST',
        headers:{'Content-Type':'application/json','X-CSRF-TOKEN':csrf},
        body: JSON.stringify({ name:fullName.value, contact:contact.value, email:email.value, password:regPassword.value, captcha:grecaptcha.getResponse() })
    }).then(r=>r.json()).then(d=>{
        if(d.success){ registerBox.style.display='none'; loginBox.style.display='block'; message.innerText='Registration successful! Verify email.'; resendBtn.style.display='inline-block'; }
        else alert(d.message || 'Registration failed');
    });
}

function resendVerification() {
    fetch('/api/resend-verification.php', { method:'POST', headers:{'Content-Type':'application/json','X-CSRF-TOKEN':csrf}, body: JSON.stringify({ email: email.value }) })
    .then(r=>r.json()).then(d=>{
        if(d.success) message.innerText='Verification email resent.'; else alert(d.message || 'Could not resend');
    });
}

/* ----- Load categories for question form ----- */
function loadQuestionCategories(){
    fetch('/api/get-categories.php',{ headers:{'X-CSRF-TOKEN':csrf} })
    .then(r=>r.json()).then(d=>{
        if(d.success){
            const sel=document.getElementById('qCategories');
            sel.innerHTML='';
            d.categories.forEach(c=>{ 
                if(!c.disabled){ 
                    const opt=document.createElement('option'); 
                    opt.value=c.id; 
                    opt.innerText=c.name; 
                    sel.appendChild(opt); 
                }
            });
        }
    });
}

/* ----- Submit Question ----- */
document.getElementById('submitQuestionBtn').onclick=function(){
    const title=document.getElementById('qTitle').value.trim();
    const content=document.getElementById('qContent').value.trim();
    const categories=Array.from(document.getElementById('qCategories').selectedOptions).map(o=>o.value);
    if(!title||!content||categories.length===0){ alert('All fields are required'); return; }
    fetch('/api/create-post.php',{ method:'POST', headers:{'Content-Type':'application/json','X-CSRF-TOKEN':csrf}, body: JSON.stringify({ title, content, categories }) })
    .then(r=>r.json()).then(d=>{
        if(d.success){ alert('Question submitted'); modal.style.display='none'; location.reload(); } 
        else alert(d.message || 'Failed to submit');
    });
}

/* ----- Initialize ----- */
loadCategories();
</script>
</body>
</html>
