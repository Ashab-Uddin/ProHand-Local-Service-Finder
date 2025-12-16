// Firebase config (replace with your actual config)
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id"
};

// Simple routing
function showPage(pageId) {
    document.querySelectorAll('div[id]').forEach(div => {
        if (['home', 'services', 'login', 'register', 'myservices', 'addservices', 'mybooking', 'profile'].includes(div.id)) {
            div.classList.add('hidden');
        }
    });
    if (document.getElementById(pageId)) {
        document.getElementById(pageId).classList.remove('hidden');
    }
}

window.addEventListener('hashchange', () => {
    const hash = window.location.hash.substring(1) || 'home';
    showPage(hash);
    if (hash === 'myservices') {
        loadMyServices();
    } else if (hash === 'mybooking') {
        loadBookings();
    } else if (hash === 'profile') {
        loadProfile();
    }
});

// Initial load
showPage('home');

// Hero slider
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');

function updateSlider() {
    slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentSlide);
    });
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    updateSlider();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateSlider();
}

function goToSlide(index) {
    currentSlide = index;
    updateSlider();
}

setInterval(nextSlide, 5000);

// Theme toggle
function toggleTheme(isDark) {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Mobile menu
function toggleMobileMenu() {
    document.getElementById('mobile-menu').classList.toggle('hidden');
}

// Update auth button
function updateAuthButton() {
    const user = JSON.parse(localStorage.getItem('user'));
    const authBtn = document.getElementById('auth-btn');
    if (user) {
        authBtn.innerHTML = `<button onclick="logout()" class="login-btn">Logout</button>`;
    } else {
        authBtn.innerHTML = `<a href="#login" class="login-btn">Login</a>`;
    }
}

function logout() {
    localStorage.removeItem('user');
    updateAuthButton();
    window.location.hash = '#home';
}

// Initial update
updateAuthButton();

// Load services
async function loadServices() {
    try {
        const response = await fetch('https://homehero-sandy.vercel.app/latest-services');
        const services = await response.json();
        const servicesList = document.getElementById('services-list');
        services.forEach(service => {
            const card = document.createElement('div');
            card.className = 'service-card';
            card.innerHTML = `
                <div class="card-image">
                    <img src="${service.thumbnail}" alt="${service.title}">
                    <div class="card-category">${service.category}</div>
                </div>
                <div class="card-content">
                    <h3 class="card-title">${service.title}</h3>
                    <p class="card-desc">${service.shortDescription}</p>
                    <div class="rating">
                        <div class="stars">
                            ${[...Array(5)].map((_, i) => `<svg class="star ${i < Math.floor(service.rating) ? '' : 'empty'}" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`).join('')}
                        </div>
                        <span class="rating-text">(${service.rating})</span>
                    </div>
                    <p class="card-price">$${service.price}</p>
                    <button class="btn book-btn" data-service-id="${service.id || service.title}">Book Now</button>
                </div>
            `;
            servicesList.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading services:', error);
    }
}

loadServices();

// Book service
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('book-btn')) {
        const serviceId = e.target.dataset.serviceId;
        let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
        bookings.push({ serviceId, date: new Date().toISOString() });
        localStorage.setItem('bookings', JSON.stringify(bookings));
        alert('Service booked!');
    }
});

// Load my services
function loadMyServices() {
    const services = JSON.parse(localStorage.getItem('myServices')) || [];
    const list = document.getElementById('my-services-list');
    list.innerHTML = '';
    services.forEach(service => {
        const card = document.createElement('div');
        card.className = 'service-card';
        card.innerHTML = `
            <div class="card-image">
                <img src="${service.thumbnail}" alt="${service.title}">
                <div class="card-category">${service.category}</div>
            </div>
            <div class="card-content">
                <h3 class="card-title">${service.title}</h3>
                <p class="card-desc">${service.description}</p>
                <div class="rating">
                    <div class="stars">
                        ${[...Array(5)].map((_, i) => `<svg class="star ${i < Math.floor(service.rating) ? '' : 'empty'}" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`).join('')}
                    </div>
                    <span class="rating-text">(${service.rating})</span>
                </div>
                <p class="card-price">$${service.price}</p>
            </div>
        `;
        list.appendChild(card);
    });
}


// Load bookings
function loadBookings() {
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const list = document.getElementById('my-bookings-list');
    list.innerHTML = '';
    bookings.forEach(booking => {
        const item = document.createElement('div');
        item.innerHTML = `<p>Booked: ${booking.serviceId} on ${new Date(booking.date).toLocaleDateString()}</p>`;
        list.appendChild(item);
    });
}

// Load profile
function loadProfile() {
    const user = JSON.parse(localStorage.getItem('user')) || { name: 'Guest', email: 'guest@example.com' };
    const info = document.getElementById('profile-info');
    info.innerHTML = `<p>Name: ${user.name}</p><p>Email: ${user.email}</p>`;
}

// Add service form
document.getElementById('add-service-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('service-title').value;
    const description = document.getElementById('service-description').value;
    const category = document.getElementById('service-category').value;
    const price = document.getElementById('service-price').value;
    const thumbnail = document.getElementById('service-thumbnail').value;
    const service = { title, description, category, price, thumbnail, rating: 5 };
    let services = JSON.parse(localStorage.getItem('myServices')) || [];
    services.push(service);
    localStorage.setItem('myServices', JSON.stringify(services));
    alert('Service added!');
    window.location.hash = '#myservices';
});

// Login form
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    // Simulate login
    localStorage.setItem('user', JSON.stringify({ email, name: email.split('@')[0] }));
    alert('Logged in successfully');
    updateAuthButton();
    window.location.hash = '#home';
});

// Register form
document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    // Simulate register
    localStorage.setItem('user', JSON.stringify({ name, email }));
    alert('Registered successfully');
    updateAuthButton();
    window.location.hash = '#login';
});
// Add any dynamic JS you need here (for interactive behaviors)
document.addEventListener('DOMContentLoaded', () => {
    // Placeholder for any footer-related JS logic if needed
});

