// ===============================
// SERVICES PAGE PAGINATION
// ===============================

// Configuration
const ITEMS_PER_PAGE = 8; // 2 rows × 4 columns = 8 cards
let currentPage = 1;
let totalPages = 0;
let allServiceCards = [];

// Initialize pagination when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    initializePagination();
});

function initializePagination() {
    // Get all service cards
    allServiceCards = Array.from(document.querySelectorAll('.service-card'));

    if (allServiceCards.length === 0) {
        console.log('No service cards found');
        return;
    }

    // Calculate total pages
    totalPages = Math.ceil(allServiceCards.length / ITEMS_PER_PAGE);

    // Generate page numbers
    generatePageNumbers();

    // Show first page
    showPage(1);
}

function generatePageNumbers() {
    const paginationNumbers = document.getElementById('paginationNumbers');

    if (!paginationNumbers) return;

    paginationNumbers.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('div');
        pageBtn.className = 'page-number';
        pageBtn.textContent = i;
        pageBtn.onclick = () => goToPage(i);

        if (i === currentPage) {
            pageBtn.classList.add('active');
        }

        paginationNumbers.appendChild(pageBtn);
    }
}

function showPage(pageNumber) {
    // Validate page number
    if (pageNumber < 1 || pageNumber > totalPages) return;

    currentPage = pageNumber;

    // Hide all cards first
    allServiceCards.forEach(card => {
        card.classList.remove('visible');
    });

    // Calculate which cards to show
    const startIndex = (pageNumber - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    // Show cards for current page
    for (let i = startIndex; i < endIndex && i < allServiceCards.length; i++) {
        allServiceCards[i].classList.add('visible');
    }

    // Update page number buttons
    updatePageNumbers();

    // Update prev/next buttons
    updateNavigationButtons();

    // Scroll to top of services
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updatePageNumbers() {
    const pageNumbers = document.querySelectorAll('.page-number');

    pageNumbers.forEach((btn, index) => {
        if (index + 1 === currentPage) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (prevBtn) {
        prevBtn.disabled = currentPage === 1;
    }

    if (nextBtn) {
        nextBtn.disabled = currentPage === totalPages;
    }
}

function changePage(direction) {
    const newPage = currentPage + direction;

    if (newPage >= 1 && newPage <= totalPages) {
        showPage(newPage);
    }
}

function goToPage(pageNumber) {
    showPage(pageNumber);
}

// Display pagination info (optional)
function displayPaginationInfo() {
    const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const endItem = Math.min(currentPage * ITEMS_PER_PAGE, allServiceCards.length);

    console.log(`Showing ${startItem}-${endItem} of ${allServiceCards.length} services (Page ${currentPage}/${totalPages})`);
}

console.log("Services Pagination Loaded");
