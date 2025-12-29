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
    const navLinks = document.getElementById("main-nav-links");
    if (!authBtn || !navLinks) return;

    const user = localStorage.getItem("user");
    const path = window.location.pathname;
    const hash = window.location.hash;

    // Determine active page
    const isHome = (path.includes("index.html") || path.includes("index.php") || path.endsWith("/") || path.endsWith("index")) && (!hash || hash === "#home");
    const isServices = path.includes("services.html") || path.includes("services.php");
    const isAddServicesPage = path.includes("addServices.html");
    const isBookServicePage = path.includes("bookservice.html");
    const isMyServices = hash === "#myservices";
    const isProfile = hash === "#profile";

    if (user === "true") {
        // Update Logout Button
        authBtn.innerHTML = `
            <button onclick="logout()" class="login-btn" style="background:#ef4444">
                Logout
            </button>
        `;

        // Update Dynamic Nav Links
        navLinks.innerHTML = `
            <a href="../index/index.html" class="nav-item ${isHome ? 'active' : ''}">
                <i class="fas fa-house"></i>
                <span>Home</span>
            </a>
            <a href="../index/services.html" class="nav-item ${isServices ? 'active' : ''}">
                <i class="fas fa-gears"></i>
                <span>Services</span>
            </a>
            <a href="#myservices" class="nav-item ${isMyServices ? 'active' : ''}">
                <i class="fas fa-briefcase"></i>
                <span>My Services</span>
            </a>
            <a href="../index/addServices.html" class="nav-item ${isAddServicesPage ? 'active' : ''}">
                <i class="fas fa-file-circle-plus"></i>
                <span>Add Services</span>
            </a>
            <a href="../index/bookservice.html" class="nav-item ${isBookServicePage ? 'active' : ''}">
                <i class="fas fa-bookmark"></i>
                <span>My Bookings</span>
            </a>
            <a href="#profile" class="nav-item ${isProfile ? 'active' : ''}">
                <i class="fas fa-user"></i>
                <span>Profile</span>
            </a>
        `;
    } else {
        // Guest State
        authBtn.innerHTML = `
            <a href="../index/login.html" class="login-btn">Login</a>
        `;
        navLinks.innerHTML = `
            <a href="../index/index.html" class="nav-item ${isHome ? 'active' : ''}">
                <i class="fas fa-house"></i>
                <span>Home</span>
            </a>
            <a href="../index/services.html" class="nav-item ${isServices ? 'active' : ''}">
                <i class="fas fa-gears"></i>
                <span>Services</span>
            </a>
        `;
    }
}

// Update active state on hash change
window.addEventListener("hashchange", updateNavbar);

// ---------- AUTO-FILL LOGIN FROM REGISTRATION ----------
document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname.includes("login.html")) {
        const regEmail = localStorage.getItem("regEmail");
        const regPass = localStorage.getItem("regPassword");

        if (regEmail && regPass) {
            const emailInput = document.querySelector('input[name="email"]');
            const passInput = document.querySelector('input[name="password"]');

            if (emailInput && passInput) {
                emailInput.value = regEmail;
                passInput.value = regPass;

                // Clear temporary registration storage
                localStorage.removeItem("regEmail");
                localStorage.removeItem("regPassword");

                // Auto submit the form
                const loginForm = document.getElementById("loginForm");
                if (loginForm) {
                    setTimeout(() => {
                        loginForm.dispatchEvent(new Event('submit'));
                    }, 500); // Small delay to show the pre-filled form briefly
                }
            }
        }
    }
});


// ---------- AUTHENTICATION & REDIRECTS ----------

// LOGOUT
function logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userPassword");
    localStorage.removeItem("userName");
    window.location.href = "../index/index.html";
}


// LOGIN
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const formData = new FormData(this);
        const email = formData.get("email");
        const password = formData.get("password");

        fetch("../php/auth/login.php", {
            method: "POST",
            body: formData
        })
            .then(res => res.text())
            .then(data => {
                alert(data);
                if (data.includes("Login successful")) {
                    const parts = data.split("|");
                    localStorage.setItem("user", "true");
                    localStorage.setItem("userEmail", email);
                    localStorage.setItem("userPassword", password);
                    if (parts[1]) localStorage.setItem("userName", parts[1]);
                    window.location.href = "../index/index.html";
                }
            });
    });
}


// REGISTER
const registerForm = document.getElementById("registerForm");
if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const formData = new FormData(this);
        const email = formData.get("email");
        const password = formData.get("password");

        fetch("../php/auth/register.php", {
            method: "POST",
            body: formData
        })
            .then(res => res.text())
            .then(data => {
                alert(data);
                if (data === "Registration successful") {
                    localStorage.setItem("regEmail", email);
                    localStorage.setItem("regPassword", password);
                    window.location.href = "../index/login.html";
                }
            });
    });
}


// ---------- MOBILE MENU ----------
function toggleMobileMenu() {
    const navLinks = document.querySelector(".nav-links");
    if (navLinks) {
        navLinks.classList.toggle("show");
    }
}

// ---------- HERO SLIDER ----------
let currentSlide = 0;
const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");

function showSlide(index) {
    if (slides.length === 0) return;

    slides.forEach(s => s.classList.remove("active"));
    dots.forEach(d => d.classList.remove("active"));

    if (index >= slides.length) currentSlide = 0;
    else if (index < 0) currentSlide = slides.length - 1;
    else currentSlide = index;

    slides[currentSlide].classList.add("active");
    dots[currentSlide].classList.add("active");
}

function nextSlide() { showSlide(currentSlide + 1); }
function prevSlide() { showSlide(currentSlide - 1); }
function goToSlide(index) { showSlide(index); }

// Auto slide
setInterval(nextSlide, 5000);

// ---------- MODAL & SERVICE FEATURES ----------

// ---------- MODAL & SERVICE FEATURES ----------
function openServiceDetail(id, title, category, img, desc, price, unit) {
    console.log("Opening service detail:", title);
    const user = localStorage.getItem("user");

    if (user !== "true") {
        alert("Please login to view service details.");
        window.location.href = "../index/login.html";
        return;
    }

    let modal = document.getElementById("serviceDetailModal");

    // AUTO-INJECT MODAL IF MISSING
    if (!modal) {
        const modalHTML = `
            <div id="serviceDetailModal" class="modal">
                <div class="modal-content">
                    <span class="back-link" onclick="closeModal()">← Back To Products</span>
                    <div class="detail-grid">
                        <div class="detail-left">
                            <img id="modalImg" src="" alt="Service Image">
                            <div class="service-desc">
                                <h3>Service Description</h3>
                                <p id="modalDesc"></p>
                                <div class="price-tag">$<span id="modalPrice"></span> <span id="modalUnit"></span></div>
                                <div class="rating">
                                    <span class="stars">★★★★☆</span>
                                    <span class="review-count">(22 reviews)</span>
                                </div>
                            </div>
                        </div>
                        <div class="detail-right">
                            <h2 id="modalTitle"></h2>
                            <div class="detail-category" id="modalCategory"></div>
                            <div class="info-box">
                                <h3>Service Details</h3>
                                <div class="info-item">
                                    <span class="info-label">Service ID:</span>
                                    <span class="info-value" id="modalServiceIdDisplay"></span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Status:</span>
                                    <span class="info-value status-pending">Verified</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Created:</span>
                                    <span class="info-value">Dec 2025</span>
                                </div>
                            </div>
                            <div class="info-box provider-info">
                                <h3>Provider Information</h3>
                                <p id="modalProviderName">ProHand Verified</p>
                                <p id="modalProviderLocation">Dhaka, Bangladesh</p>
                                <p id="modalProviderEmail">support@prohand.com</p>
                            </div>
                            <button class="book-btn" onclick="openBookingForm()">Book This Service</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- BOOKING FORM MODAL -->
            <div id="bookingFormModal" class="modal">
                <div class="modal-content modal-content-small compact-modal">
                    <div class="form-header">
                        <h2 style="font-weight: 800; color: #1e293b;">Book This Service!</h2>
                        <hr style="margin: 1rem 0; opacity: 0.1;">
                    </div>
                    <form id="submit-booking-form">
                        <input type="hidden" id="booking-service-id" name="service_id">
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                           <div class="form-group">
                                <label style="font-weight: 600; color: #475569;">Name</label>
                                <input type="text" id="booking-user-name" readonly style="background:#f8fafc; border: 1.5px solid #e2e8f0;">
                           </div>
                           <div class="form-group">
                                <label style="font-weight: 600; color: #475569;">Email</label>
                                <input type="email" id="booking-user-email" name="user_email" readonly style="background:#f8fafc; border: 1.5px solid #e2e8f0;">
                           </div>
                        </div>

                        <div class="form-group">
                            <label style="font-weight: 600; color: #475569;">Booking Date</label>
                            <input type="date" name="booking_date" required style="border: 1.5px solid #e2e8f0;">
                        </div>

                        <div class="form-group">
                            <label style="font-weight: 600; color: #475569;">Your Price</label>
                            <input type="number" name="offered_price" placeholder="Enter your offered price" required style="border: 1.5px solid #e2e8f0;">
                        </div>

                        <div class="form-group">
                            <label style="font-weight: 600; color: #475569;">Service ID</label>
                            <input type="text" id="booking-service-display" readonly style="background:#f8fafc; border: 1.5px solid #e2e8f0;">
                        </div>

                        <button type="submit" class="submit-btn" style="background:#3b82f6; padding: 0.8rem; margin-top: 1rem;">Submit Booking</button>
                        
                        <div style="text-align: right; margin-top: 10px;">
                            <button type="button" class="btn-delete" style="background: #f1f5f9; border: none; color: #64748b; padding: 0.6rem 1.2rem; font-size: 0.9rem;" onclick="closeBookingModal()">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
            `;
        document.body.insertAdjacentHTML('afterbegin', modalHTML);
        modal = document.getElementById("serviceDetailModal");
    }

    // Populate Modal Data
    document.getElementById("modalTitle").innerText = title;
    document.getElementById("modalCategory").innerText = category || "Service";
    document.getElementById("modalImg").src = img;
    document.getElementById("modalDesc").innerText = desc || "No description available.";
    document.getElementById("modalPrice").innerText = price || "0";
    document.getElementById("modalUnit").innerText = unit || "";
    document.getElementById("modalServiceIdDisplay").innerText = id || "N/A";

    // Store data for the booking form
    const bookingForm = document.getElementById("submit-booking-form");
    if (bookingForm) {
        document.getElementById("booking-service-id").value = id;
        document.getElementById("booking-service-display").value = id;
        document.getElementById("booking-user-name").value = localStorage.getItem("userName") || "User";
        document.getElementById("booking-user-email").value = localStorage.getItem("userEmail") || "";
    }

    // Show Modal
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
}

function openBookingForm() {
    closeModal();
    const bookingModal = document.getElementById("bookingFormModal");
    if (bookingModal) {
        bookingModal.style.display = "block";
        document.body.style.overflow = "hidden";
    }
}

function closeBookingModal() {
    const bookingModal = document.getElementById("bookingFormModal");
    if (bookingModal) {
        bookingModal.style.display = "none";
        document.body.style.overflow = "auto";
    }
}

function closeModal() {
    const modal = document.getElementById("serviceDetailModal");
    if (modal) modal.style.display = "none";
    document.body.style.overflow = "auto";
}

// Handle Booking Form Submission
document.addEventListener("submit", (e) => {
    if (e.target && e.target.id === "submit-booking-form") {
        e.preventDefault();
        const formData = new FormData(e.target);

        fetch("../php/booking/process_booking.php", {
            method: "POST",
            body: formData
        })
            .then(res => res.json())
            .then(data => {
                alert(data.message);
                if (data.status === "success") {
                    closeBookingModal();
                    window.location.href = "bookservice.html";
                }
            })
            .catch(err => {
                console.error("Error:", err);
                alert("Failed to submit booking.");
            });
    }
});

// ---------- GLOBAL CLICK LISTENER ----------
document.addEventListener("click", (e) => {
    if (e.target && e.target.classList.contains("view-btn")) {
        const card = e.target.closest(".service-card");
        if (!card) return;

        const id = card.getAttribute("data-id") || Math.random().toString(36).substr(2, 9);
        const title = card.querySelector("h3")?.innerText || "Service Detail";
        const category = card.querySelector(".badge")?.innerText || "Services";
        const img = card.querySelector("img")?.src || "";
        const desc = card.querySelector("p")?.innerText || "Professional service by ProHand experts.";
        const priceEl = card.querySelector(".price");
        const price = priceEl ? priceEl.innerText.replace("$", "").trim() : "0";
        const unitEl = card.querySelector(".unit");
        const unit = unitEl ? unitEl.innerText.trim() : "";

        openServiceDetail(id, title, category, img, desc, price, unit);
    }

    const detailModal = document.getElementById("serviceDetailModal");
    const bookingModal = document.getElementById("bookingFormModal");
    if (e.target == detailModal) closeModal();
    if (e.target == bookingModal) closeBookingModal();
});

// ---------- SECTION NAVIGATION ----------
function showSection() {
    const hash = window.location.hash || "#home";
    const sections = ["mybookings", "profile", "myservices"];
    const homeSections = [".hero-slider", ".features", ".hero-cta", ".top-rated", ".about", ".testimonials"];
    const path = window.location.pathname;

    // Skip home-specific logic if we are not on the home page
    if (!path.includes("index.html") && !path.endsWith("/") && !path.endsWith("index")) return;
    sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add("hidden");
    });

    // Handle visibility based on hash
    if (hash === "#home" || hash === "") {
        homeSections.forEach(selector => {
            const el = document.querySelector(selector);
            if (el) el.classList.remove("hidden");
        });
    } else {
        // Hide home sections when on another "page"
        homeSections.forEach(selector => {
            const el = document.querySelector(selector);
            if (el) el.classList.add("hidden");
        });

        const targetId = hash.replace("#", "");
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
            targetEl.classList.remove("hidden");
            window.scrollTo(0, 0);
        }

        // Pre-fill email in Add Service form if logged in
        if (hash === "#addservices") {
            const emailInput = document.getElementById("provider-email");
            const nameInput = document.getElementById("provider-name");
            const userEmail = localStorage.getItem("userEmail");
            const userName = localStorage.getItem("userName");

            if (emailInput && userEmail) emailInput.value = userEmail;
            if (nameInput && userName) nameInput.value = userName;
        }
    }
}

// Initial call and listener
window.addEventListener("hashchange", showSection);
document.addEventListener("DOMContentLoaded", showSection);


// ---------- ADD SERVICE FORM SUBMISSION ----------
document.addEventListener("submit", (e) => {
    if (e.target && e.target.id === "add-service-form") {
        e.preventDefault();
        const formData = new FormData(e.target);

        // Add user info if needed
        const userEmail = localStorage.getItem("userEmail");
        formData.append("user_email", userEmail);

        fetch("../php/services/add_service.php", {
            method: "POST",
            body: formData
        })
            .then(res => res.text())
            .then(data => {
                alert(data);
                if (data.includes("Service added successfully")) {
                    e.target.reset();
                    window.location.hash = "#myservices"; // Redirect to their services
                }
            })
            .catch(err => {
                console.error("Error:", err);
                alert("Failed to submit service. Please try again.");
            });
    }
});

console.log("ProHand JS Loaded");
