<?php
session_start();
require_once __DIR__ . '/../config/db.php';

if(!isset($_SESSION['admin_id'])){
    header('Location: admin-login.php');
    exit;
}

$adminName = $_SESSION['admin_name'];

// CSRF token
if(empty($_SESSION['csrf_token'])) $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
$csrf = $_SESSION['csrf_token'];
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<script src="https://cdn.jsdelivr.net/npm/sortablejs@1.15.2/Sortable.min.js"></script>
<title>Admin Dashboard</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
:root{
    --primary:#2563eb; --success:#16a34a; --danger:#dc2626;
    --bg:#f8fafc; --card:#fff; --text:#0f172a; --muted:#64748b; --radius:14px;
}
*{box-sizing:border-box;font-family:system-ui}
body{margin:0;background:var(--bg);color:var(--text)}
header{background:white;padding:16px 20px;display:flex;justify-content:space-between;align-items:center;box-shadow:0 2px 10px rgba(0,0,0,.05)}
header h2{margin:0}
nav{display:flex;gap:10px;margin:20px;flex-wrap:wrap}
nav button{padding:10px 14px;border:none;border-radius:10px;background:var(--primary);color:white;cursor:pointer;transition:.2s}
nav button.active{background:var(--success)}
nav button:hover{opacity:.9}
main{max-width:1200px;margin:auto;padding:20px}
.card{background:white;padding:20px;border-radius:var(--radius);margin-bottom:20px;box-shadow:0 5px 15px rgba(0,0,0,.05);animation:fadeUp .3s ease}
input,textarea,select{width:100%;padding:10px;margin:5px 0;border:1px solid #cbd5f5;border-radius:10px}
button.small{padding:6px 10px;font-size:14px}
#toast{position:fixed;bottom:20px;right:20px;padding:14px 18px;background:#0f172a;color:white;border-radius:12px;opacity:0;transform:translateY(20px);transition:.3s;z-index:2000}
#toast.show{opacity:1;transform:translateY(0)}
.hidden{display:none}
table{width:100%;border-collapse:collapse;margin-top:10px}
th,td{border:1px solid #cbd5f5;padding:8px;text-align:left}
th{background:#f1f5f9}
@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}


.switch{
    position:relative;display:inline-block;width:44px;height:24px
}
.switch input{display:none}
.slider{
    position:absolute;cursor:pointer;inset:0;background:#ccc;border-radius:24px;transition:.2s
}
.slider:before{
    content:"";position:absolute;height:18px;width:18px;left:3px;top:3px;
    background:white;border-radius:50%;transition:.2s
}
input:checked + .slider{background:var(--success)}
input:checked + .slider:before{transform:translateX(20px)}

.editor{
    min-height:80px;
    padding:8px;
    border:1px solid #cbd5f5;
    border-radius:10px;
    background:#fff;
}
.editor:focus{outline:none;border-color:#2563eb}

.toolbar{
    display:flex;gap:6px;margin-bottom:6px
}
.toolbar button{
    padding:4px 8px;
    border:1px solid #cbd5f5;
    background:#f8fafc;
    border-radius:6px;
    cursor:pointer;
}

.category-header{
    background:#eef2ff;
    cursor:pointer;
}
.category-header td{
    font-weight:bold;
}

.category-stats{
    font-size:13px;
    color:#475569;
}

tr[data-id]{cursor:grab}
tr[data-id]:active{cursor:grabbing}

/* Row colors */
tr.published{ background:#ecfdf5; }   /* greenish for published */
tr.unpublished{ background:#fef3f2; } /* reddish for unpublished */

.category-header{
    background:#eef2ff;
    cursor:pointer;
}
.category-header td{
    font-weight:bold;
}

/* Drag handle cursor */
tr[data-id]{ cursor:grab; }
tr[data-id]:active{ cursor:grabbing; }

/* Responsive filters/buttons */
.question-buttons{ display:flex; gap:8px; flex-wrap:wrap; margin-bottom:12px; }
.question-filters{ display:flex; gap:10px; flex-wrap:wrap; align-items:center; margin-bottom:12px; }
.question-filters input{ flex:1; min-width:200px; }
.question-filters select{ width:200px; }
@media(max-width:600px){
    .question-filters{ flex-direction:column; gap:6px; }
}


.post{
    background:white;
    border-radius:14px;
    padding:16px;
    margin-bottom:12px;
    box-shadow:0 5px 15px rgba(0,0,0,.05);
    border-left:6px solid transparent;
    cursor:grab;
}

.post.published{
    border-left-color: #16a34a;
    background:#f0fdf4;
}

.post.unpublished{
    border-left-color:#dc2626;
    background:#fef2f2;
}

.post b{
    font-size:16px;
}

.post .meta{
    font-size:12px;
    color:#64748b;
    margin-top:4px;
}

.post .reply{
    margin-top:10px;
    padding:10px;
    background:#f8fafc;
    border-radius:10px;
    border:1px solid #e2e8f0;
}

.post .actions{
    margin-top:10px;
    display:flex;
    gap:8px;
    align-items:center;
}

.post .status{
    font-size:12px;
    padding:4px 8px;
    border-radius:999px;
}

.status.published{
    background:#dcfce7;
    color:#166534;
}

.status.unpublished{
    background:#fee2e2;
    color:#991b1b;
}

.category-block{
    margin-bottom:30px;
}


.status-new_request { background:#eef5ff; }
.status-contacted_interested { background:#e6ffed; }
.status-contacted_not_interested { background:#ffecec; }
.status-contacted_followup { background:#fff8e1; }
.status-positive_close { background:#d4edda; }
.status-negative_close { background:#f8d7da; }



</style>
</head>
<body>

<header>
    <h2>Admin Dashboard</h2>
    <button onclick="logout()" style="background:var(--danger)">Logout</button>
</header>

<nav>
    
    <button class="tab-btn active" data-tab="questions">Questions</button>    
    <button class="tab-btn" data-tab="categories">Categories</button>
    <button class="tab-btn" data-tab="admins">Admins</button>
    <button class="tab-btn" data-tab="course">Courses Enquiry</button>
    <button class="tab-btn" data-tab="travel">Travel Insurance Enquiry</button>
    <button class="tab-btn" data-tab="health">Health Insurance Enquiry</button>
</nav>

<main>
    <!-- Admins -->
    <div id="admins" class="tab hidden">
        <div class="card" style="display:none;">
            <h3>Add Admin</h3>
            <input id="adminName" placeholder="Name">
            <input id="adminEmail" placeholder="Email">
            <input id="adminPassword" type="password" placeholder="Password">
            <button onclick="addAdmin()">Add Admin</button>
        </div>
        <div class="card">
            <div style="display:flex;justify-content:space-between;align-items:center">
            <h3>Admin List</h3>
            <button  onclick="openAddAdmin()">+ Add Admin</button>
        </div>
            <table id="adminTable">
                <thead><tr><th>Name</th><th>Email</th><th>Actions</th></tr></thead>
                <tbody></tbody>
            </table>
        </div>
    </div>

    <!-- Categories -->
<div id="categories" class="tab hidden">
    <div class="card">
        <div style="display:flex;justify-content:space-between;align-items:center">
            <h3>Categories</h3>
            <button onclick="openAddCategory()">+ Add Category</button>
        </div>

        <table id="categoryTable">
            <thead>
                <tr>
                    <th>Order</th>
                    <th>Name</th>
                    <th>Active</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>
</div>


    <!-- Questions -->
    <div id="questions" class="tab">
        

<!-- Search & Filter row -->
    <div style="display:flex;gap:10px;margin-bottom:10px; align-items:center;">
        <input id="searchQuestion" placeholder="Search title or content" style="flex:1">
        <select id="filterCategory" style="width:200px;">
            <option value="">All Categories</option>
        </select>
    </div>

    


<div class="card">
    <div style="display:flex;justify-content:space-between;align-items:center">
            <h3>User Questions</h3>
            <button onclick="openAddQuestion()">+ Add Question</button>
        </div>
    
    <!--<button class="small" onclick="bulkPublish(1)">Bulk Publish</button>
    <button class="small" onclick="bulkPublish(0)">Bulk Unpublish</button>-->    
    <div id="questionList"></div>
</div>
</div>


<!-- enquiry -->
<div id="course" class="tab hidden">
        <input type="text" id="search-course" placeholder="Search Courses Enquiries..." />
        <table id="courseTable">
            <thead></thead>
            <tbody></tbody>
        </table>
        <div id="coursePagination"></div>
    </div>
    <div id="travel" class="tab hidden">
        <input type="text" id="search-travel" placeholder="Search Travel Enquiries..." />
        <table id="travelTable">
            <thead></thead>
            <tbody></tbody>
        </table>
        <div id="travelPagination"></div>
    </div>
    <div id="health" class="tab hidden">
        <input type="text" id="search-health" placeholder="Search Health Enquiries..." />
        <table id="healthTable">
            <thead></thead>
            <tbody></tbody>
        </table>
        <div id="healthPagination"></div>
    </div>



<!-- UNIVERSAL MODAL -->
<div id="modal" class="hidden" style="position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:3000">
    <div style="background:white;max-width:500px;margin:10vh auto;padding:20px;border-radius:14px;position:relative">
        <span style="position:absolute;top:10px;right:14px;cursor:pointer;font-size:20px"
              onclick="closeModal()">×</span>
        <h3 id="modalTitle"></h3>
        <div id="modalBody"></div>
        <button id="modalSave" class="small">Save</button>
    </div>
</div>



</main>

<div id="toast"></div>

<script>
    let ACTIVE_EDITOR = null;
    const PAGE_SIZE = 10;
    let CATEGORY_PAGE = {};

    function buildPagination(categoryId, total, page){
    const totalPages = Math.ceil(total / PAGE_SIZE);
    if (totalPages <= 1) return '';

    let html = `<div class="pagination">`;

    if (page > 1) {
        html += `<button onclick="changePage(${categoryId}, ${page-1})">‹ Prev</button>`;
    }

    html += `<span> Page ${page} of ${totalPages} </span>`;

    if (page < totalPages) {
        html += `<button onclick="changePage(${categoryId}, ${page+1})">Next ›</button>`;
    }

    html += `</div>`;
    return html;
}

function changePage(categoryId, page){
    CATEGORY_PAGE[categoryId] = page;
    renderAll();
}


    document.addEventListener('focusin', e => {
    if (e.target.classList.contains('editor')) {
        ACTIVE_EDITOR = e.target;
    }
});

const csrf = '<?=htmlspecialchars($csrf,ENT_QUOTES)?>';
const toastBox = document.getElementById('toast');

function toast(msg){ toastBox.innerText=msg; toastBox.classList.add('show'); setTimeout(()=>toastBox.classList.remove('show'),3000); }





// ===== Modal popup =====

const modal = document.getElementById('modal');
const modalBody = document.getElementById('modalBody');
const modalTitle = document.getElementById('modalTitle');
const modalSave = document.getElementById('modalSave');
//const content = row.querySelector('.content').innerHTML;
//const answer  = row.querySelector('.answer').innerHTML;



function openModal(title, html, onSave){
    modalTitle.innerText = title;
    modalBody.innerHTML = html;
    modalSave.onclick = onSave;
    modal.classList.remove('hidden');
}
function closeModal(){
    modal.classList.add('hidden');
}


// ===== TABS =====
document.querySelectorAll('.tab-btn').forEach(btn=>{
    btn.onclick=()=>{
        document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.tab').forEach(tab=>tab.classList.add('hidden'));
        document.getElementById(btn.dataset.tab).classList.remove('hidden');
        if(btn.dataset.tab==='admins') loadAdmins();
        if(btn.dataset.tab==='categories') loadCategories();
        if(btn.dataset.tab==='questions') loadQuestions();
    }
});

// ===== LOGOUT =====
function logout(){
    fetch('/api/admin/logout.php',{headers:{'X-CSRF-TOKEN':csrf}}).then(()=>{location.href='admin-login.php';});
}

// ===== ADMINS =====
function loadAdmins(){
    fetch('/api/admin/get-admins.php',{headers:{'X-CSRF-TOKEN':csrf}})
    .then(r=>r.json()).then(d=>{
        const tbody = document.querySelector('#adminTable tbody');
        tbody.innerHTML='';
        d.admins.forEach(a=>{
            const tr=document.createElement('tr');
            tr.innerHTML=`<td>${a.name}</td><td>${a.email}</td>
            <td><button class="small" onclick="deleteAdmin(${a.id})">Delete</button></td>`;
            tbody.appendChild(tr);
        });
    });
}
function openAddAdmin(){
    openModal('Add Admin',`
        <input id="aName" placeholder="Name">
        <input id="aEmail" placeholder="Email">
        <input id="aPass" type="password" placeholder="Password">
    `,()=>{
        fetch('/api/admin/add-admin.php',{
            method:'POST',
            headers:{'Content-Type':'application/json','X-CSRF-TOKEN':csrf},
            body:JSON.stringify({
                name:aName.value,email:aEmail.value,password:aPass.value
            })
        }).then(r=>r.json()).then(d=>{
            toast(d.message);
            if(d.success){ closeModal(); loadAdmins(); }
        });
    });
}

function addAdmin(){
    const name=document.getElementById('adminName').value;
    const email=document.getElementById('adminEmail').value;
    const password=document.getElementById('adminPassword').value;
    fetch('/api/admin/add-admin.php',{
        method:'POST', headers:{'Content-Type':'application/json','X-CSRF-TOKEN':csrf},
        body:JSON.stringify({name,email,password})
    }).then(r=>r.json()).then(d=>{ toast(d.message); if(d.success) loadAdmins(); });
}
function deleteAdmin(id){
    if(!confirm('Delete this admin?')) return;
    fetch('/api/admin/delete-admin.php',{
        method:'POST', headers:{'Content-Type':'application/json','X-CSRF-TOKEN':csrf},
        body:JSON.stringify({id})
    }).then(r=>r.json()).then(d=>{ toast(d.message); if(d.success) loadAdmins(); });
}

// ===== CATEGORIES =====
function loadCategories(){
    fetch('/api/admin/get-categories.php',{
        headers:{'X-CSRF-TOKEN':csrf}
    })
    .then(r=>r.json())
    .then(d=>{
        const tbody=document.querySelector('#categoryTable tbody');
        tbody.innerHTML='';

        d.categories.forEach(c=>{
            const tr=document.createElement('tr');
            tr.dataset.id = c.id;

            tr.innerHTML=`
                <td class="drag">☰</td>
                <td>${c.name}</td>
                <td>
                    <label class="switch">
                        <input type="checkbox"
                            ${c.disabled==0?'checked':''}
                            onchange="toggleCategoryRecord(${c.id}, this.checked)">
                        <span class="slider"></span>
                    </label>
                </td>
                <td>
                    <button class="small" onclick="editCategory(${c.id}, '${c.name.replace(/'/g,"\\'")}', ${c.disabled})">
                        Edit
                    </button>
                    <!--<button class="small" onclick="deleteCategory(${c.id})">
                        Delete
                    </button>-->
                </td>
            `;
            tbody.appendChild(tr);
        });

        enableCategorySorting();
    });
}
function enableCategorySorting(){
    Sortable.create(
        document.querySelector('#categoryTable tbody'),
        {
            handle: '.drag',
            animation: 150,
            onEnd: saveCategoryOrder
        }
    );
}

function saveCategoryOrder(){
    const order = Array.from(
        document.querySelectorAll('#categoryTable tbody tr')
    ).map(tr=>tr.dataset.id);

    fetch('/api/admin/update-category-order.php',{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'X-CSRF-TOKEN':csrf
        },
        body:JSON.stringify({order})
    }).then(r=>r.json()).then(d=>toast(d.message));
}


function openAddCategory(){
    openModal(
        'Add Category',
        `<label>Name</label>
        <input id="catName" placeholder="Category name">

        <label style="display:block;margin-top:10px">Active</label>
        <label class="switch">
            <input type="checkbox" id="catActive" checked>
            <span class="slider"></span>
        </label>`,
        () => {
            fetch('/api/admin/add-category.php',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                    'X-CSRF-TOKEN':csrf
                },
                body:JSON.stringify({
                    name: document.getElementById('catName').value,
                    disabled: document.getElementById('catActive').checked ? 0 : 1
                })
            })
            .then(r=>r.json())
            .then(d=>{
                toast(d.message);
                if(d.success){
                    closeModal();
                    loadCategories();
                }
            });
        }
    );
}

function editCategory(id, name, disabled){
    openModal(
        'Edit Category',
        `
        <label>Name</label>
        <input id="catName" value="${name}">

        <label style="display:block;margin-top:10px">Active</label>
        <label class="switch">
            <input type="checkbox" id="catActive" ${disabled==0?'checked':''}>
            <span class="slider"></span>
        </label>
        `,
        () => {
            fetch('/api/admin/update-category.php',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                    'X-CSRF-TOKEN':csrf
                },
                body:JSON.stringify({
                    id,
                    name: document.getElementById('catName').value,
                    disabled: document.getElementById('catActive').checked ? 0 : 1
                })
            })
            .then(r=>r.json())
            .then(d=>{
                toast(d.message);
                if(d.success){
                    closeModal();
                    loadCategories();
                }
            });
        }
    );
}


// function addCategory(){
//     const name=document.getElementById('categoryName').value;
//     fetch('/api/admin/add-category.php',{
//         method:'POST', headers:{'Content-Type':'application/json','X-CSRF-TOKEN':csrf},
//         body:JSON.stringify({name})
//     }).then(r=>r.json()).then(d=>{ toast(d.message); if(d.success) loadCategories(); });
// }
// function editCategory(id, name){
//     openModal('Edit Category',
//         `<input id="catName" value="${name}">`,
//         ()=>{
//             fetch('/api/admin/update-category.php',{
//                 method:'POST',
//                 headers:{'Content-Type':'application/json','X-CSRF-TOKEN':csrf},
//                 body:JSON.stringify({id,name:document.getElementById('catName').value})
//             }).then(r=>r.json()).then(d=>{
//                 toast(d.message);
//                 if(d.success){ closeModal(); loadCategories(); }
//             });
//         }
//     );
// }

function toggleCategoryRecord(id, isActive){
    fetch('/api/admin/toggle-category.php',{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'X-CSRF-TOKEN':csrf
        },
        body:JSON.stringify({
            id,
            disabled: isActive ? 0 : 1
        })
    })
    .then(r=>r.json())
    .then(d=>toast(d.message));
}


// old code
// function toggleCategory(id){
//     fetch('/api/admin/toggle-category.php',{
//         method:'POST', headers:{'Content-Type':'application/json','X-CSRF-TOKEN':csrf},
//         body:JSON.stringify({id})
//     }).then(r=>r.json()).then(d=>{ toast(d.message); if(d.success) loadCategories(); });
// }
function deleteCategory(id){
    if(!confirm('Delete this category?')) return;
    fetch('/api/admin/delete-category.php',{
        method:'POST', headers:{'Content-Type':'application/json','X-CSRF-TOKEN':csrf},
        body:JSON.stringify({id})
    }).then(r=>r.json()).then(d=>{ toast(d.message); if(d.success) loadCategories(); });
}

function setStatusFilter(val){
    document.getElementById('filterStatus').value = val;
    renderQuestions(ALL_QUESTIONS, ALL_CATEGORIES);
}


// ===== QUESTIONS =====


let ALL_Q = [];
let ALL_C = [];
let COLLAPSED = {};

document.getElementById('searchQuestion').oninput = renderAll;
document.getElementById('filterCategory').onchange = renderAll;

// ================= LOAD =================
// check
function loadQuestions(){
     fetch('/api/admin/get-questions.php',{headers:{'X-CSRF-TOKEN':csrf}})
     .then(r=>r.json())
     .then(d=>{
         ALL_Q = d.questions;
         ALL_C = d.categories;

         const fc = document.getElementById('filterCategory');
         if(fc.options.length===1){
             d.categories.forEach(c=>{
                 fc.innerHTML += `<option value="${c.id}">${c.name}</option>`;
             });
         }
         renderAll();
     });
 }

// ================= RENDER =================
function renderAll(){
    // const tbody = document.querySelector('#questionTable tbody');
    // tbody.innerHTML='';

    // const search = document.getElementById('searchQuestion').value.toLowerCase();
    // const filterCat = document.getElementById('filterCategory').value;

    // ALL_C.forEach(cat=>{
    //     if(filterCat && +filterCat!==cat.id) return;

    //     const list = ALL_Q.filter(q=>{
    //         if(!q.categories.includes(cat.id)) return false;
    //         if(search && !(q.title.toLowerCase().includes(search)||q.content.toLowerCase().includes(search))) return false;
    //         return true;
    //     });

    //     if(!list.length) return;

    //     const stats = {
    //         total:list.length,
    //         published:list.filter(q=>q.published).length,
    //         unpublished:list.filter(q=>!q.published).length,
    //         unanswered:list.filter(q=>!q.answer||!q.answer.trim()).length
    //     };

    //     tbody.innerHTML += `
    //         <tr class="category-header" onclick="toggleCategory(${cat.id})">
    //             <td colspan="6">
    //                 ${cat.name}
    //                 <span class="category-stats">
    //                     | Total: ${stats.total}
    //                     | Published: ${stats.published}
    //                     | Unpublished: ${stats.unpublished}
    //                     | Unanswered: ${stats.unanswered}
    //                 </span>
    //             </td>
    //         </tr>
    //     `;

    //     if(COLLAPSED[cat.id]) return;

    //     const catTbody = document.createDocumentFragment();
    //     list.forEach(q=>catTbody.appendChild(buildRow(q)));
    //     tbody.appendChild(catTbody);

    //     // Enable drag sorting **within category**
    //     enableDragSorting(cat.id);
    // });
    const container = document.getElementById('questionList');
    container.innerHTML = '';

    const search = document.getElementById('searchQuestion').value.toLowerCase();
    const filterCat = document.getElementById('filterCategory').value;

    ALL_C.forEach(cat=>{
        if(filterCat && +filterCat !== cat.id) return;

        const list = ALL_Q.filter(q=>{
            if(!q.categories.includes(cat.id)) return false;
            if(search && !(q.title.toLowerCase().includes(search) || q.content.toLowerCase().includes(search))) return false;
            return true;
        });

        if(!list.length) return;

        // 🔹 Sort by category-specific priority
        list.sort((a, b) => {
            const pa = a.categories.find(c => c.id === cat.id)?.priority ?? 9999;
            const pb = b.categories.find(c => c.id === cat.id)?.priority ?? 9999;
            return pa - pb;
        });

        const page = CATEGORY_PAGE[cat.id] || 1;
        const start = (page - 1) * PAGE_SIZE;
        const end   = start + PAGE_SIZE;
        const pageItems = list.slice(start, end);

        const catBlock = document.createElement('div');
        catBlock.className = 'category-block';
        catBlock.innerHTML = `
            <h3 style="margin-bottom:10px">${cat.name}</h3>
            <div class="category-posts" data-category-id="${cat.id}"></div>
            ${buildPagination(cat.id, list.length, page)}
        `;
        container.appendChild(catBlock);

        const postWrap = catBlock.querySelector('.category-posts');
        pageItems.forEach(q => postWrap.appendChild(buildPost(q, cat.id)));

        enableQuestionSorting(postWrap, cat.id);
    });

    // Render uncategorized posts
    const uncategorizedList = ALL_Q.filter(q => q.categories.length === 0);
    if (uncategorizedList.length && (!filterCat || filterCat === '0')) {

        const page = CATEGORY_PAGE[0] || 1;
        const start = (page - 1) * PAGE_SIZE;
        const end   = start + PAGE_SIZE;
        const pageItems = uncategorizedList.slice(start, end);

        const uncBlock = document.createElement('div');
        uncBlock.className = 'category-block';
        uncBlock.innerHTML = `
            <h3 style="margin-bottom:10px">Uncategorized</h3>
            <div class="category-posts" data-category="0"></div>
            ${buildPagination(0, uncategorizedList.length, page)}
        `;
        container.appendChild(uncBlock);

        const postWrap = uncBlock.querySelector('.category-posts');
        pageItems.forEach(q => postWrap.appendChild(buildPost(q)));

        enableQuestionSorting(postWrap, 0); // 0 = uncategorized
    }
}

// function enableQuestionSorting(container, categoryId){
//     Sortable.create(container,{
//         animation:150,
//         onEnd:()=>{
//             const order = [...container.children].map((el,i)=>({
//                 id: el.dataset.id,
//                 category_id: categoryId,
//                 position: i
//             }));

//             fetch('/api/admin/update-question-priority.php',{
//                 method:'POST',
//                 headers:{
//                     'Content-Type':'application/json',
//                     'X-CSRF-TOKEN':csrf
//                 },
//                 body:JSON.stringify({order})
//             });
//         }
//     });
// }

function enableQuestionSorting(container, categoryId) {
    // Make sure the container has a data-category-id attribute
    //const categoryId = container.dataset.categoryId;
    if (!categoryId) {
        console.error('Container missing data-category-id');
        return;
    }

    Sortable.create(container, {
        animation: 150,
        onEnd: () => {
            // Build order array with post_id, category_id, priority
            const order = [...container.children].map((el, i) => ({
                post_id: parseInt(el.dataset.id),
                category_id: categoryId,
                priority: i + 1 // priority starts from 1
            }));

            fetch('/api/admin/update-question-priority.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrf
                },
                body: JSON.stringify({ order })
            })
            .then(r => r.json())
            .then(d => {
                if (d.success) {
                    toast('Question priorities updated');
                } else {
                    toast('Error updating priorities: ' + d.message);
                }
            });
        }
    });
}


function openAddQuestion() {
    const categoryOptions = ALL_C.map(c => `<option value="${c.id}">${c.name}</option>`).join('');

    openModal(
        'Add New Question',
        `
        <label>Title</label>
        <input id="qTitle">

        <label>Question</label>
        ${toolbarHTML()}
        <div id="qContent" class="editor" contenteditable="true" data-placeholder="Write question here..."></div>

        <label>Categories</label>
        <select id="qCategories" multiple>${categoryOptions}</select>

        <label>Answer</label>
        ${toolbarHTML()}
        <div id="qAnswer" class="editor" contenteditable="true" data-placeholder="Write answer here..."></div>

        <label>Status</label>
        <label class="switch">
            <input type="checkbox" id="qActive" checked>
            <span class="slider"></span>
        </label>
        `,
        () => saveNewQuestion()
    );
}


function saveNewQuestion() {
    const categories = Array.from(
        document.getElementById('qCategories').selectedOptions
    ).map(o => o.value);

    const content = document.getElementById('qContent').innerHTML.trim();
    const answer  = document.getElementById('qAnswer').innerHTML.trim();
    const title   = document.getElementById('qTitle').value.trim();
    const published = document.getElementById('qActive').checked ? 1 : 0;

    if(!title || !content || content === '<br>') {
        toast('Title and question content are required');
        return;
    }

    const payload = {
        title,
        content,
        answer,
        category_ids: categories,
        published
    };

    fetch('/api/admin/add-question.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrf
        },
        body: JSON.stringify(payload)
    })
    .then(r => r.json())
    .then(d => {
        toast(d.message);
        if(d.success) {
            closeModal();
            loadQuestions(); // refresh the list
        }
    });
}



function buildPost(q){
    const div = document.createElement('div');
    div.className = `post ${q.published ? 'published' : 'unpublished'}`;
    div.dataset.id = q.id;

    div.innerHTML = `
        <b>${q.title}</b>
        <p>${q.content}</p>

        <div class="meta">
            Categories: ${q.category_names || ''}
        </div>

        ${q.answer ? `
            <div class="reply">
                <b>Answer:</b><br>${q.answer}
            </div>` : ''}

        <div class="actions">
            <span class="status ${q.published ? 'published' : 'unpublished'}">
                ${q.published ? 'Published' : 'Unpublished'}
            </span>

            <button class="small" onclick="editQuestion(${q.id})">Edit</button>
            <button class="small" onclick="toggleQuestion(${q.id})">
                ${q.published ? 'Unpublish' : 'Publish'}
            </button>
            <button class="small" onclick="deleteQuestion(${q.id})">Delete</button>
        </div>
    `;
    return div;
}


// Drag & drop sorting **within category**
function enableDragSorting(categoryId){
    const rows = [...document.querySelectorAll('#questionTable tbody tr')]
        .filter(r => !r.classList.contains('category-header') && ALL_Q.find(q=>q.id==r.dataset.id).categories.includes(categoryId));

    Sortable.create(rows[0]?.parentNode, {
        handle: null,
        animation: 150,
        draggable: 'tr',
        filter: '.category-header',
        onEnd: saveOrder
    });
}

// ================= BUILD ROW =================
function buildRow(q){
    const tr=document.createElement('tr');
    tr.dataset.id=q.id;
    tr.className = q.published ? 'published' : 'unpublished';
    tr.draggable=true;

    const categoryNames = ALL_C.filter(c=>q.categories.includes(c.id)).map(c=>c.name).join(', ');


    // tr.innerHTML=`
    //     <td><input type="checkbox" class="bulk" value="${q.id}"></td>
    //     <td><input class="title" value="${q.title}"></td>

    //     <td>
    //         ${toolbarHTML()}
    //         <div class="editor content" contenteditable="true">${q.content}</div>
    //     </td>

    //     <td>
    //         ${toolbarHTML()}
    //         <div class="editor answer" contenteditable="true">${q.answer||''}</div>
    //     </td>

    //     <td>
    //         <label class="switch">
    //             <input type="checkbox" ${q.published?'checked':''}
    //                 onchange="toggleQuestion(${q.id})">
    //             <span class="slider"></span>
    //         </label>
    //     </td>

    //     <td>
    //         <button class="small" onclick="saveRow(${q.id},this)">Save</button>
    //         <button class="small" onclick="deleteQuestion(${q.id})">Delete</button>
    //     </td>
    // `;
    // return tr;

    tr.innerHTML = `
        <td><input type="checkbox" class="bulk" value="${q.id}"></td>
        <td>${q.title}</td>
        <td>${categoryNames}</td>
        <td>${q.answer || ''}</td>
        <td>${q.published ? 'Published' : 'Unpublished'}</td>
        <td>
            <button class="small" onclick="editQuestion(${q.id})">Edit</button>
            <button class="small" onclick="deleteQuestion(${q.id})">Delete</button>
        </td>
    `;
    return tr;
}

// ================= TOOLBAR =================
function toolbarHTML(){
    return `
    <div class="toolbar">
        <button onclick="cmd(event,'bold')"><b>B</b></button>
        <button onclick="cmd(event,'italic')"><i>I</i></button>
        <button onclick="cmd(event,'underline')"><u>U</u></button>
        <button onclick="cmd(event,'insertUnorderedList')">• List</button>
        <button onclick="cmd(event,'insertOrderedList')">1. List</button>
        <button onclick="linkCmd(event)">Link</button>
    </div>`;
}

function cmd(e, c){
    e.preventDefault();
    if (!ACTIVE_EDITOR) return;
    ACTIVE_EDITOR.focus();
    document.execCommand(c, false, null);
}
function linkCmd(e){
    e.preventDefault();
    if (!ACTIVE_EDITOR) return;

    const url = prompt('Enter URL');
    if (url){
        ACTIVE_EDITOR.focus();
        document.execCommand('createLink', false, url);
    }
}

function clean_html($html){
    return htmlspecialchars($html, ENT_QUOTES | ENT_HTML5, 'UTF-8');
}


// ================= SAVE =================
function saveRow(id,btn){
    const row=btn.closest('tr');
    fetch('/api/admin/update-question.php',{
        method:'POST',
        headers:{'Content-Type':'application/json','X-CSRF-TOKEN':csrf},
        body:JSON.stringify({
            id,
            title:row.querySelector('.title').value,
            content:row.querySelector('.content').innerHTML,
            answer:row.querySelector('.answer').innerHTML
        })
    }).then(r=>r.json()).then(d=>toast(d.message));
}

// ================= COLLAPSE =================
function toggleCategory(id){
    COLLAPSED[id]=!COLLAPSED[id];
    renderAll();
}

// ================= BULK =================
function toggleAll(cb){
    document.querySelectorAll('.bulk').forEach(c=>c.checked=cb.checked);
}

function bulkPublish(val){
    const ids=[...document.querySelectorAll('.bulk:checked')].map(c=>c.value);
    if(!ids.length) return toast('No questions selected');

    fetch('/api/admin/bulk-publish.php',{
        method:'POST',
        headers:{'Content-Type':'application/json','X-CSRF-TOKEN':csrf},
        body:JSON.stringify({ids,published:val})
    }).then(r=>r.json()).then(d=>{
        toast(d.message);
        loadQuestions();
    });
}

// ================= DRAG =================
let drag;
document.addEventListener('dragstart',e=>{
    drag=e.target.closest('tr[data-id]');
});
document.addEventListener('dragover',e=>{
    if(e.target.closest('tr[data-id]')) e.preventDefault();
});
document.addEventListener('drop',e=>{
    const t=e.target.closest('tr[data-id]');
    if(t&&drag&&t!==drag){
        t.before(drag);
        saveOrder();
    }
});

function saveOrder(){
    const order=[...document.querySelectorAll('tr[data-id]')]
        .map((tr,i)=>({id:tr.dataset.id,position:i}));
    fetch('/api/admin/update-order.php',{
        method:'POST',
        headers:{'Content-Type':'application/json','X-CSRF-TOKEN':csrf},
        body:JSON.stringify({order})
    });
}



function renderQuestions(questions, categories){
    const tbody = document.querySelector('#questionTable tbody');
    tbody.innerHTML = '';

    const search = document.getElementById('searchQuestion').value.toLowerCase();
    const cat = document.getElementById('filterCategory').value;
    const status = document.getElementById('filterStatus').value;

    questions
    .filter(q=>{
        if (search && !(
            q.title.toLowerCase().includes(search) ||
            q.content.toLowerCase().includes(search)
        )) return false;

        if (cat && !q.categories.includes(parseInt(cat))) return false;

        if (status === 'published' && !q.published) return false;
        if (status === 'unpublished' && q.published) return false;
        if (status === 'unanswered' && !(!q.answer || q.answer.trim()==='')) return false;

        return true;
    })
    .forEach(q=>{
        // 🔁 YOUR EXISTING <tr> CREATION LOGIC HERE
    });
}


function renderGroupedByCategory(questions, categories){
    const tbody = document.querySelector('#questionTable tbody');
    tbody.innerHTML = '';

    categories.forEach(cat=>{
        const catQuestions = questions.filter(q =>
            q.categories.includes(cat.id)
        );
        if (!catQuestions.length) return;

        tbody.innerHTML += `
            <tr style="background:#eef2ff">
                <td colspan="6"><b>${cat.name}</b></td>
            </tr>
        `;

        catQuestions.forEach(q=>{
            // render question row
        });
    });
}

// old code 
// function saveOrder(){
//     const order = Array.from(
//         document.querySelectorAll('#questionTable tr[data-id]')
//     ).map((tr,i)=>({
//         id: tr.dataset.id,
//         position: i
//     }));

//     fetch('/api/admin/update-order.php',{
//         method:'POST',
//         headers:{'Content-Type':'application/json','X-CSRF-TOKEN':csrf},
//         body:JSON.stringify({order})
//     });
// }

// old code
// function loadQuestions(){
//     fetch('/api/admin/get-questions.php',{headers:{'X-CSRF-TOKEN':csrf}})
//     .then(r=>r.json()).then(d=>{
//         const tbody=document.querySelector('#questionTable tbody');
//         tbody.innerHTML='';
//         d.questions.forEach(q=>{
//             const tr=document.createElement('tr');
//             const selectedCategories = q.categories || [];
//             const categoryOptions = d.categories.map(c=>{
//                 const selected = selectedCategories.includes(c.id)?'selected':'';
//                 return `<option value="${c.id}" ${selected}>${c.name}</option>`;
//             }).join('');
//             tr.setAttribute('data-id', q.id);
//             tr.innerHTML=`
                    
//             <!--<td><input style="width:100%" value="${q.title}" onchange="updateQuestion(${q.id},this.value,q.content,${JSON.stringify(selectedCategories)})"></td>-->
//             <td><input style="width:100%" value="${q.title}" class="title" ></td>
//             <!--<td><textarea style="width:100%" onchange="updateQuestion(${q.id},q.title,this.value,${JSON.stringify(selectedCategories)})">${q.content}</textarea></td>-->
//             <td><div class="editor content" contenteditable="true">${q.content}</div></td>
//             <td>
//                 <!--<select multiple onchange="updateQuestion(${q.id},q.title,q.content,Array.from(this.selectedOptions).map(o=>o.value))">
//                     ${categoryOptions}
//                 </select>-->
//                 <select multiple class="categories">
//                     ${categoryOptions}
//                 </select>
//             </td>
//             <td><label class="switch">
//     <input type="checkbox" ${q.published?'checked':''}
//         onchange="toggleQuestion(${q.id})">
//     <span class="slider"></span>
// </label></td>

//             <!--<td>${q.published ? 'Published' : 'Pending'}</td>-->
//             <!--<td><input style="width:100%" value="${q.answer||''}" onchange="answerQuestion(${q.id},this.value)"></td>-->
//             <td><input style="width:100%" value="${q.answer||''}" class="answer"></td>
//             <td>
//                 <button class="small" onclick="editQuestion(${q.id})">Edit</button>
//                 <button class="small" onclick="saveQuestion(${q.id}, this)">Save</button>
//                 <!--<button class="small" onclick="toggleQuestion(${q.id})">${q.published ? 'Unpublish' : 'Publish'}</button>-->
//                 <button class="small" onclick="deleteQuestion(${q.id})">Delete</button>
//             </td>`;
//             tbody.appendChild(tr);
//         });
//     });
// }

// function editQuestion(id){
//     fetch('/api/admin/get-question.php?id='+id,{headers:{'X-CSRF-TOKEN':csrf}})
//     .then(r=>r.json()).then(q=>{
//         openModal('Edit Question',`
//             <input id="qTitle" value="${q.title}">
//             <textarea id="qContent">${q.content}</textarea>
//             <textarea id="qAnswer">${q.answer||''}</textarea>
//         `,()=>{
//             fetch('/api/admin/update-question.php',{
//                 method:'POST',
//                 headers:{'Content-Type':'application/json','X-CSRF-TOKEN':csrf},
//                 body:JSON.stringify({
//                     id,
//                     title:document.getElementById('qTitle').value,
//                     content:document.getElementById('qContent').value,
//                     answer:document.getElementById('qAnswer').value
//                 })
//             }).then(r=>r.json()).then(d=>{
//                 toast(d.message);
//                 if(d.success){ closeModal(); loadQuestions(); }
//             });
//         });
//     });
// }

function editQuestion(id){
    fetch('/api/admin/get-question.php?id=' + id,{headers:{'X-CSRF-TOKEN':csrf}})
    .then(r => r.json())
    .then(d => {
        if (!d.success) return toast(d.message);

        const q = d.question;

        const categoryOptions = d.categories.map(c => {
            const selected = q.categories.includes(c.id) ? 'selected' : '';
            return `<option value="${c.id}" ${selected}>${c.name}</option>`;
        }).join('');

        openModal(
            'Edit Question',
            `
            <label>Title</label>
            <input id="qTitle" value="${q.title}">

            <label>Question</label>
            ${toolbarHTML()}
    <div id="qContent" class="editor" contenteditable="true" data-placeholder="Write question here...">
     ${q.content || ''}
    </div>

            <label>Categories</label>
            <select id="qCategories" multiple>${categoryOptions}</select>

            <label>Answer</label>
            ${toolbarHTML()}
    <div id="qAnswer" class="editor" contenteditable="true" data-placeholder="Write answer here...">
     ${q.answer || ''}
    </div>

            <label>Status</label>
            <label class="switch">
                <input type="checkbox" id="qActive" ${q.published?'checked':''}  onchange="toggleQuestion(${q.id})">
                <span class="slider"></span>
            </label>
            `,
            () => saveQuestionEdit(id)
        );
    });
}


function saveQuestionEdit(id){
    const categories = Array.from(
        document.getElementById('qCategories').selectedOptions
    ).map(o => o.value);

    const contentEl = document.getElementById('qContent');
    const answerEl  = document.getElementById('qAnswer');

    const content = contentEl.innerHTML.trim();
    const answer  = answerEl.innerHTML.trim();

    if(!content || content === '<br>'){
        toast('Question content is required');
        return;
    }

    const payload = {
        id,
        title: document.getElementById('qTitle').value.trim(),
        content,
        answer,
        category_ids: categories,
        disabled: document.getElementById('qActive').checked ? 0 : 1
    };

    // 🔹 DEBUG: check data before sending
    //console.log("Payload to send:", JSON.stringify(payload, null, 2));

    fetch('/api/admin/update-question.php',{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'X-CSRF-TOKEN': csrf
        },
        body: JSON.stringify(payload)
    })
    .then(r=>r.json())
    .then(d=>{
        toast(d.message);
        if(d.success){
            closeModal();
            updateQuestionRow(d.question); // 🔥 no reload
        }
    });
}


function updateQuestionRow(q){
    if (!q || !q.id) {
        //console.error('Invalid question object', q);
        return loadQuestions(); // fallback
    }
    const row = document.querySelector(`#questionTable tr[data-id="${q.id}"]`);
    if(!row) return loadQuestions();

    row.querySelector('.title').value = q.title;
    row.querySelector('.content').value = q.content;
    row.querySelector('.answer').value = q.answer || '';
    row.querySelector('.status').innerText = q.published ? 'Published' : 'Pending';
}





function saveQuestion(postId, btn) {
    const row = btn.closest('tr');

    const title = row.querySelector('.title').value;
    const content = row.querySelector('.content').value;
    const answer = row.querySelector('.answer').value;

    const categories = Array.from(
        row.querySelector('.categories').selectedOptions
    ).map(o => o.value);

    fetch('/api/admin/answer-question.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrf
        },
        body: JSON.stringify({
            post_id: postId,
            title,
            content,
            answer,
            categories
        })
    })
    .then(r => r.json())
    .then(d => {
        toast(d.message);
        if (d.success) {
            loadQuestions(); // refresh row
        }
    });
}


function updateQuestion(id,title,content,category_ids){
    fetch('/api/admin/update-question.php',{
        method:'POST', headers:{'Content-Type':'application/json','X-CSRF-TOKEN':csrf},
        body:JSON.stringify({id,title,content,category_ids})
    }).then(r=>r.json()).then(d=>toast(d.message));
}

function answerQuestion(post_id,answer){
    fetch('/api/admin/answer-question.php',{
        method:'POST', headers:{'Content-Type':'application/json','X-CSRF-TOKEN':csrf},
        body:JSON.stringify({post_id,answer})
    }).then(r=>r.json()).then(d=>toast(d.message));
}

function toggleQuestion(id){
    fetch('/api/admin/toggle-question.php',{
        method:'POST', headers:{'Content-Type':'application/json','X-CSRF-TOKEN':csrf},
        body:JSON.stringify({id})
    }).then(r=>r.json()).then(d=>{ toast(d.message); loadQuestions(); });
}

function deleteQuestion(id){
    if(!confirm('Delete this question?')) return;
    fetch('/api/admin/delete-question.php',{
        method:'POST', headers:{'Content-Type':'application/json','X-CSRF-TOKEN':csrf},
        body:JSON.stringify({id})
    }).then(r=>r.json()).then(d=>{ toast(d.message); loadQuestions(); });
}

// ===== INITIAL LOAD =====
loadAdmins();
loadCategories();
loadQuestions();




const ENQUIRY_TYPES = ['course','travel','health'];
const STATUS_OPTIONS = [
  {value:'new_request', label:'New Request'},
  {value:'contacted_interested', label:'Contacted – Interested'},
  {value:'contacted_not_interested', label:'Contacted – Not Interested'},
  {value:'contacted_followup', label:'Contacted – Follow-up Required'},
  {value:'positive_close', label:'Positive Close'},
  {value:'negative_close', label:'Negative Close'}
];

const PAGE_SIZE_ENQ = 10;
let enquiryData = {course:[], travel:[], health:[]};
let currentPage = {course:1, travel:1, health:1};

// ===== Tabs =====
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.onclick = () => {
        document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.tab').forEach(t=>t.classList.add('hidden'));
        document.getElementById(btn.dataset.tab).classList.remove('hidden');
        renderEnquiries(btn.dataset.tab);
    };
});

// ===== Load Enquiries =====
function loadEnquiries(type){
    fetch(`/api/admin/get-${type}-enquiries.php`,{headers:{'X-CSRF-TOKEN':csrf}})
        .then(r=>r.json())
        .then(d=>{
            enquiryData[type] = d.enquiries;
            renderEnquiries(type);
        });
}

// ===== Render Table =====
function renderEnquiries(type){
    const tbody = document.querySelector(`#${type}Table tbody`);
    const searchInput = document.getElementById(`search-${type}`);
    const searchTerm = searchInput.value.toLowerCase();

    // Filter based on search
    const filtered = enquiryData[type].filter(e=>{
        return Object.values(e).some(val=>String(val).toLowerCase().includes(searchTerm));
    });

    // Pagination
    const page = currentPage[type] || 1;
    const start = (page-1)*PAGE_SIZE_ENQ;
    const paginated = filtered.slice(start, start+PAGE_SIZE_ENQ);

    // Build header dynamically based on type
    const table = document.getElementById(`${type}Table`);
    let headers = ['Name','Contact','Email'];
    if(type==='course') headers.push('Level','Field of Study','Program','Province','City');
    if(type==='travel' || type==='health') headers.push('Age');
    headers.push('Notes','Status','Actions');

    table.querySelector('thead').innerHTML = '<tr>'+headers.map(h=>`<th>${h}</th>`).join('')+'</tr>';

    tbody.innerHTML = '';
    paginated.forEach(e=>{
        const tr = document.createElement('tr');
        tr.dataset.id = e.id;
        tr.classList.add(`status-${e.status}`);

        let cells = [e.name, e.contact||'', e.email];
        if(type==='course') cells.push(e.level||'', e.field||'', e.program||'', e.province||'', e.city||'');
        if(type==='travel' || type==='health') cells.push(e.age||'');
        cells.push(e.notes||'');

        // Status select
        const statusSelect = `<select class="status-select" data-type="${type}">
            ${STATUS_OPTIONS.map(s=>`<option value="${s.value}" ${s.value===e.status?'selected':''}>${s.label}</option>`).join('')}
        </select>`;
        cells.push(statusSelect);

        // Actions
        cells.push(`<button class="delete-btn" data-type="${type}">Delete</button>`);

        tr.innerHTML = cells.map(c=>`<td>${c}</td>`).join('');
        tbody.appendChild(tr);
    });

    // Bind events
    tbody.querySelectorAll('.status-select').forEach(sel=>{
        sel.onchange = function(){
            const tr = this.closest('tr');
            const id = this.closest('tr').dataset.id;
            const type = this.dataset.type;
            // Remove old status classes
    tr.classList.remove(
        'status-new_request',
        'status-contacted_interested',
        'status-contacted_not_interested',
        'status-contacted_followup',
        'status-positive_close',
        'status-negative_close'
    );

    // Add new class
    tr.classList.add(`status-${this.value}`);

            fetch(`/api/admin/update-${type}-status.php`,{
                method:'POST',
                headers:{'Content-Type':'application/json','X-CSRF-TOKEN':csrf},
                body: JSON.stringify({id, status:this.value})
            }).then(r=>r.json()).then(d=>toast(d.message));
        };
    });

    tbody.querySelectorAll('.delete-btn').forEach(btn=>{
        btn.onclick = function(){
            if(!confirm('Delete this record?')) return;
            const id = this.closest('tr').dataset.id;
            const type = this.dataset.type;
            fetch(`/api/admin/delete-${type}-enquiry.php`,{
                method:'POST',
                headers:{'Content-Type':'application/json','X-CSRF-TOKEN':csrf},
                body: JSON.stringify({id})
            }).then(r=>r.json()).then(d=>{
                toast(d.message);
                loadEnquiries(type);
            });
        };
    });

    // Pagination controls
    const totalPages = Math.ceil(filtered.length/PAGE_SIZE_ENQ);
    const paginationDiv = document.getElementById(`${type}Pagination`);
    let html = '';
    if(totalPages>1){
        if(page>1) html += `<button onclick="goPage('${type}',${page-1})">‹ Prev</button>`;
        html += `<span> Page ${page} of ${totalPages} </span>`;
        if(page<totalPages) html += `<button onclick="goPage('${type}',${page+1})">Next ›</button>`;
    }
    paginationDiv.innerHTML = html;
}

function goPage(type,page){
    currentPage[type] = page;
    renderEnquiries(type);
}

// Bind search inputs
ENQUIRY_TYPES.forEach(type=>{
    document.getElementById(`search-${type}`).oninput = ()=>renderEnquiries(type);
});

// Initial load
ENQUIRY_TYPES.forEach(loadEnquiries);

</script>

</body>
</html>
