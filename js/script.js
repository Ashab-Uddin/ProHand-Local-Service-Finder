/** * PROHAND - CORE JAVASCRIPT
 * Professional Service Finder Logic
 */

// --- 1. CONFIGURATION & STATE ---
const CONFIG = {
    API_BASE_URL: 'https://homehero-sandy.vercel.app',
    SLIDE_INTERVAL: 5000,
    VALID_PAGES: ['home', 'services', 'login', 'register', 'myservices', 'addservices', 'mybooking', 'profile']
};

const state = {
    currentSlide: 0,
    user: JSON.parse(localStorage.getItem('user')) || null
};

// --- 2. CORE ROUTING SYSTEM ---
function navigate() {
    const hash = window.location.hash.substring(1) || 'home';
    const pageId = CONFIG.VALID_PAGES.includes(hash) ? hash : 'home';
    
    // Switch Visibility
    document.querySelectorAll('div[id]').forEach(div => {
        if (CONFIG.VALID_PAGES.includes(div.id)) {
            div.style.display = (div.id === pageId) ? 'block' : 'none';
        }
    });

    // Trigger Page-Specific Data Loading
    switch(pageId) {
        case 'myservices': loadMyServices(); break;
        case 'mybooking':  loadBookings(); break;
        case 'profile':    loadProfile(); break;
        case 'home':       resetSlider(); break;
    }
    
    // Always refresh navbar on navigation
    updateNavbar();
}

window.addEventListener('hashchange', navigate);
window.addEventListener('DOMContentLoaded', () => {
    navigate();
    loadLatestServices(); // This fetches your top-rated service cards
    updateNavbar();
});

// --- 3. UI COMPONENTS ---
// function createServiceCard(service, isBookable = true) {
//     const stars = Array.from({length: 5}, (_, i) => `
//         <svg class="star ${i < Math.floor(service.rating) ? '' : 'empty'}" viewBox="0 0 24 24">
//             <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
//         </svg>
//     `).join('');

//     return `
//         <div class="service-card">
//             <div class="card-image">
//                 <img src="${service.thumbnail}" alt="${service.title}" loading="lazy">
//                 <div class="card-category">${service.category}</div>
//             </div>
//             <div class="card-content">
//                 <h3 class="card-title">${service.title}</h3>
//                 <p class="card-desc">${service.shortDescription || service.description}</p>
//                 <div class="rating">
//                     <div class="stars">${stars}</div>
//                     <span class="rating-text">(${service.rating})</span>
//                 </div>
//                 <div class="card-footer">
//                     <p class="card-price">$${service.price}</p>
//                     ${isBookable ? `<button class="btn book-btn" data-id="${service.id || service.title}">Book Now</button>` : ''}
//                 </div>
//             </div>
//         </div>
//     `;
// }

// --- 4. NAVIGATION & AUTH UI ---
function updateNavbar() {
    const navContainer = document.getElementById('main-nav-links');
    const authBtnContainer = document.getElementById('auth-btn');
    if (!navContainer || !authBtnContainer) return;

    const user = JSON.parse(localStorage.getItem('user'));

    const icons = {
        home: `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>`,
        services: `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>`,
        myservices: `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>`,
        add: `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 4v16m8-8H4"/></svg>`,
        booking: `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z"/></svg>`,
        profile: `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>`
    };

    let navHtml = `
        <a href="#home" class="nav-link">${icons.home} Home</a>
        <a href="#services" class="nav-link">${icons.services} Services</a>
    `;

    if (user) {
        navHtml += `
            <a href="#myservices" class="nav-link">${icons.myservices} My Services</a>
            <a href="#addservices" class="nav-link">${icons.add} Add Service</a>
            <a href="#mybooking" class="nav-link">${icons.booking} My Bookings</a>
            <a href="#profile" class="nav-link">${icons.profile} Profile</a>
        `;
        authBtnContainer.innerHTML = `<button onclick="handleLogout()" class="login-btn" style="background-color: #ef4444;">Logout</button>`;
    } else {
        authBtnContainer.innerHTML = `<a href="#login" class="login-btn">Login</a>`;
    }

    navContainer.innerHTML = navHtml;
}

function handleLogout() {
    localStorage.removeItem('user');
    state.user = null;
    updateNavbar();
    window.location.hash = '#home';
}

// --- 5. DATA LOADING (RESTORED) ---
async function loadLatestServices() {
    const list = document.getElementById('services-list');
    if (!list) return;

    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/latest-services`);
        const services = await response.json();
        // Shows top-rated services on the home page
        list.innerHTML = services.map(s => createServiceCard(s)).join('');
    } catch (err) {
        list.innerHTML = `<p class="error">Failed to load services. Please try again later.</p>`;
    }
}

function loadMyServices() {
    const container = document.getElementById('my-services-list');
    if (!container) return;
    const myServices = JSON.parse(localStorage.getItem('myServices')) || [];
    
    container.innerHTML = myServices.length 
        ? myServices.map(s => createServiceCard(s, false)).join('')
        : `<p>You haven't added any services yet.</p>`;
}

// --- 6. SLIDER LOGIC ---
function updateSliderUI() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    
    slides.forEach((s, i) => s.classList.toggle('active', i === state.currentSlide));
    dots.forEach((d, i) => d.classList.toggle('active', i === state.currentSlide));
}

function nextSlide() {
    const slides = document.querySelectorAll('.slide');
    if (slides.length === 0) return;
    state.currentSlide = (state.currentSlide + 1) % slides.length;
    updateSliderUI();
}

function resetSlider() {
    state.currentSlide = 0;
    updateSliderUI();
}

setInterval(nextSlide, CONFIG.SLIDE_INTERVAL);