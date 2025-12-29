// ===============================
// PROHAND - CLEAN JAVASCRIPT
// ===============================

// ---------- NAVBAR LOGIN STATE ----------
document.addEventListener("DOMContentLoaded", () => {
    updateNavbar();
});

// ---------- UPDATE NAVBAR ----------
function updateNavbar() {
    const authBtn = document.getElementById("auth-btn");
    if (!authBtn) return;

    const user = localStorage.getItem("user");

    if (user) {
        authBtn.innerHTML = `
            <button onclick="logout()" class="login-btn" style="background:#ef4444">
                Logout
            </button>
        `;
    } else {
        authBtn.innerHTML = `
            <a href="login.html" class="login-btn">Login</a>
        `;
    }
}

// ---------- LOGOUT ----------
function logout() {
    localStorage.removeItem("user");
    window.location.href = "index.html";
}

// LOGIN
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", e => {
        e.preventDefault();
        fetch("../php/auth/login.php", {
            method: "POST",
            body: new FormData(loginForm)
        })
        .then(res => res.text())
        .then(data => {
            if (data === "Login successful") {
                window.location.href = "services.html";
            } else {
                alert(data);
            }
        });
    });
}

// REGISTER
const registerForm = document.getElementById("registerForm");
if (registerForm) {
    registerForm.addEventListener("submit", e => {
        e.preventDefault();
        fetch("../php/auth/register.php", {
            method: "POST",
            body: new FormData(registerForm)
        })
        .then(res => res.text())
        .then(data => {
            alert(data);
            if (data === "Registration successful") {
                window.location.href = "login.html";
            }
        });
    });
}
