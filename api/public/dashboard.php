<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

require_once __DIR__.'/../../config/db.php'; // defines $pdo

if(!isset($_SESSION['user_id'])) header("Location: /public/login.php");

require_once __DIR__.'/../../config/config.php';
require_once __DIR__.'/../../lib/Security.php';
?>
<!DOCTYPE html>
<html>
<head>
<title>User Dashboard</title>
</head>
<body>

<h2>Submit Your Question</h2>

<select id="categories" multiple></select><br><br>
<input type="text" id="title" placeholder="Question title"><br><br>
<textarea id="content" placeholder="Your question"></textarea><br><br>
<button onclick="submitPost()">Submit Question</button>

<h3>Your Posts</h3>
<div id="myPosts"></div>

<script>
const csrf = '<?= $_SESSION['csrf_token'] ?>';

function loadCategories(){
    fetch('/api/get-categories.php',{
        method:'GET',
        headers:{'X-CSRF-TOKEN':csrf}
    }).then(r=>r.json()).then(d=>{
        const sel = document.getElementById('categories');
        d.categories.forEach(c=>{
            const opt = document.createElement('option');
            opt.value=c.id;
            opt.text=c.name;
            sel.appendChild(opt);
        });
    });
}

function loadMyPosts(){
    fetch('/api/user/posts.php',{
        method:'GET',
        headers:{'X-CSRF-TOKEN':csrf}
    }).then(r=>r.json()).then(d=>{
        const div=document.getElementById('myPosts'); div.innerHTML='';
        d.posts.forEach(p=>{
            const el=document.createElement('div');
            el.innerHTML=`<strong>${p.title}</strong> [${p.status}]<br>${p.content}`;
            if(p.answers.length>0){
                p.answers.forEach(a=>{
                    const r=document.createElement('div');
                    r.style.color='green';
                    r.innerText='Admin: '+a.content;
                    el.appendChild(r);
                });
            }
            div.appendChild(el);
        });
    });
}

function submitPost(){
    const catIds=[...document.getElementById('categories').selectedOptions].map(o=>o.value);
    fetch('/api/create-post.php',{
        method:'POST',
        headers:{'Content-Type':'application/json','X-CSRF-TOKEN':csrf},
        body: JSON.stringify({
            title: document.getElementById('title').value,
            content: document.getElementById('content').value,
            categories: catIds
        })
    }).then(r=>r.json()).then(d=>{
        if(d.success){
            alert('Post submitted');
            loadMyPosts();
        } else alert(d.message);
    });
}

loadCategories();
loadMyPosts();
</script>
</body>
</html>
