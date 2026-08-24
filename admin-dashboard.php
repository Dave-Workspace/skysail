<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if(!isset($_SESSION['user_id']) || $_SESSION['role']!=='admin') {
    header("Location: admin-login.php");
    exit;
}

require_once __DIR__.'/config/config.php';
require_once __DIR__.'/lib/Security.php';
?>
<!DOCTYPE html>
<html>
<head>
<title>Admin Dashboard</title>
<style>
body{font-family:Arial,sans-serif;}
table {width:100%; border-collapse: collapse;}
th, td {border:1px solid #ccc; padding:5px; text-align:left;}
input[type=text], textarea {width:100%;}
.reply-input {width:100%;}
.status-select {width:100px;}
.category-checkbox {margin-right:5px;}
button {margin-top:5px;}
.category-list {margin-bottom:20px; border:1px solid #ccc; padding:10px;}
.disabled {text-decoration:line-through;color:red;}
</style>
</head>
<body>
<h2>Admin Dashboard</h2>

<h3>Manage Categories</h3>
<div class="category-list">
    <input type="text" id="newCategory" placeholder="New Category">
    <button onclick="createCategory()">Add Category</button>
    <div id="categoriesContainer"></div>
</div>

<h3>Manage Posts</h3>
<table id="postsTable">
<thead>
<tr>
<th>ID</th><th>Title</th><th>Content</th><th>Categories</th><th>Reply</th><th>Status</th><th>Update</th>
</tr>
</thead>
<tbody></tbody>
</table>

<script>
const csrf='<?= $_SESSION['csrf_token'] ?>';
let categories=[];

function loadCategories(){
    fetch('/api/get-categories.php',{headers:{'X-CSRF-TOKEN':csrf}})
    .then(r=>r.json())
    .then(d=>{
        if(d.success){
            categories=d.categories;
            renderCategoryList();
        }
    });
}

function renderCategoryList(){
    const container=document.getElementById('categoriesContainer');
    container.innerHTML='';
    categories.forEach(c=>{
        const div=document.createElement('div');
        div.innerHTML=`<input type="text" value="${c.name}" id="cat-${c.id}">
                       <button onclick="updateCategory(${c.id})">Update</button>
                       <button onclick="toggleCategory(${c.id})">${c.disabled?'Enable':'Disable'}</button>`;
        if(c.disabled) div.classList.add('disabled');
        container.appendChild(div);
    });
}

function createCategory(){
    const name=document.getElementById('newCategory').value.trim();
    if(!name) return alert('Enter category name');
    fetch('/api/admin/category-update.php',{
        method:'POST',
        headers:{'Content-Type':'application/json','X-CSRF-TOKEN':csrf},
        body: JSON.stringify({action:'create',name})
    }).then(r=>r.json()).then(d=>{
        if(d.success) loadCategories();
        else alert(d.message);
    });
}

function updateCategory(id){
    const name=document.getElementById('cat-'+id).value.trim();
    fetch('/api/admin/category-update.php',{
        method:'POST',
        headers:{'Content-Type':'application/json','X-CSRF-TOKEN':csrf},
        body: JSON.stringify({action:'update',id,name})
    }).then(r=>r.json()).then(d=>{
        if(d.success) loadCategories();
        else alert(d.message);
    });
}

function toggleCategory(id){
    fetch('/api/admin/category-update.php',{
        method:'POST',
        headers:{'Content-Type':'application/json','X-CSRF-TOKEN':csrf},
        body: JSON.stringify({action:'toggle',id})
    }).then(r=>r.json()).then(d=>{
        if(d.success) loadCategories();
        else alert(d.message);
    });
}

/* --- POSTS --- */
function loadPosts(){
    fetch('/api/admin/posts.php',{headers:{'X-CSRF-TOKEN':csrf}})
    .then(r=>r.json()).then(d=>{
        const tbody=document.querySelector('#postsTable tbody');
        tbody.innerHTML='';
        d.posts.forEach(p=>{
            const tr=document.createElement('tr');
            let catCheckboxes = categories.map(c=>{
                const checked = p.categories.includes(c.id) ? 'checked':''; 
                const disabled = c.disabled ? 'disabled':''; 
                return `<label><input type="checkbox" class="category-checkbox" value="${c.id}" ${checked} ${disabled}>${c.name}</label>`;
            }).join('<br>');

            tr.innerHTML=`
                <td>${p.id}</td>
                <td><input type="text" class="post-title" value="${p.title}"></td>
                <td><textarea class="post-content">${p.content}</textarea></td>
                <td>${catCheckboxes}</td>
                <td><textarea class="reply-input">${p.admin_reply||''}</textarea></td>
                <td>
                    <select class="status-select">
                        <option value="pending" ${p.status=='pending'?'selected':''}>Pending</option>
                        <option value="published" ${p.status=='published'?'selected':''}>Publish</option>
                        <option value="dropped" ${p.status=='dropped'?'selected':''}>Drop</option>
                    </select>
                </td>
                <td><button onclick="updatePost(${p.id}, this)">Update</button></td>
            `;
            tbody.appendChild(tr);
        });
    });
}

function updatePost(postId, btn){
    const tr=btn.closest('tr');
    const title=tr.querySelector('.post-title').value.trim();
    const content=tr.querySelector('.post-content').value.trim();
    const reply=tr.querySelector('.reply-input').value.trim();
    const status=tr.querySelector('.status-select').value;
    const catIds=[...tr.querySelectorAll('.category-checkbox:checked')].map(c=>c.value);

    fetch('/api/admin/post-update.php',{
        method:'POST',
        headers:{'Content-Type':'application/json','X-CSRF-TOKEN':csrf},
        body: JSON.stringify({
            post_id:postId,
            content,
            title,
            reply,
            status,
            categories:catIds
        })
    }).then(r=>r.json()).then(d=>{
        if(d.success) { alert('Updated'); loadPosts(); }
        else alert(d.message);
    });
}

loadCategories();
loadPosts();
</script>
</body>
</html>
