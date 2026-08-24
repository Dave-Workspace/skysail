document.querySelectorAll(".fancy_button").forEach(btn => {
    btn.innerText = "Apply Now";
});


document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("year").textContent = new Date().getFullYear();
});