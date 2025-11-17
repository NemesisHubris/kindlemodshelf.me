// Sample Book Data
const booksData = [
    {
        id: 1,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        cover: "https://covers.openlibrary.org/b/id/7222246-L.jpg",
        progress: 65,
        downloaded: true,
        type: "books",
        dateAdded: new Date('2024-11-15')
    },
    {
        id: 2,
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        cover: "https://covers.openlibrary.org/b/id/8228691-L.jpg",
        progress: 42,
        downloaded: true,
        type: "books",
        dateAdded: new Date('2024-11-10')
    },
    {
        id: 3,
        title: "1984",
        author: "George Orwell",
        cover: "https://covers.openlibrary.org/b/id/7222246-L.jpg",
        progress: 0,
        downloaded: false,
        type: "books",
        dateAdded: new Date('2024-11-08')
    },
    {
        id: 4,
        title: "Pride and Prejudice",
        author: "Jane Austen",
        cover: "https://covers.openlibrary.org/b/id/8200794-L.jpg",
        progress: 100,
        downloaded: true,
        type: "books",
        dateAdded: new Date('2024-11-01')
    },
    {
        id: 5,
        title: "The Catcher in the Rye",
        author: "J.D. Salinger",
        cover: "https://covers.openlibrary.org/b/id/8235171-L.jpg",
        progress: 23,
        downloaded: true,
        type: "books",
        dateAdded: new Date('2024-10-28')
    },
    {
        id: 6,
        title: "Harry Potter and the Sorcerer's Stone",
        author: "J.K. Rowling",
        cover: "https://covers.openlibrary.org/b/id/10521270-L.jpg",
        progress: 78,
        downloaded: true,
        type: "books",
        dateAdded: new Date('2024-10-25')
    },
    {
        id: 7,
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        cover: "https://covers.openlibrary.org/b/id/8494690-L.jpg",
        progress: 0,
        downloaded: false,
        type: "books",
        dateAdded: new Date('2024-10-20')
    },
    {
        id: 8,
        title: "Fahrenheit 451",
        author: "Ray Bradbury",
        cover: "https://covers.openlibrary.org/b/id/8229248-L.jpg",
        progress: 56,
        downloaded: true,
        type: "books",
        dateAdded: new Date('2024-10-15')
    },
    {
        id: 9,
        title: "The Lord of the Rings",
        author: "J.R.R. Tolkien",
        cover: "https://covers.openlibrary.org/b/id/8812151-L.jpg",
        progress: 34,
        downloaded: true,
        type: "books",
        dateAdded: new Date('2024-10-10')
    },
    {
        id: 10,
        title: "Jane Eyre",
        author: "Charlotte Brontë",
        cover: "https://covers.openlibrary.org/b/id/8238522-L.jpg",
        progress: 0,
        downloaded: false,
        type: "books",
        dateAdded: new Date('2024-10-05')
    },
    {
        id: 11,
        title: "Animal Farm",
        author: "George Orwell",
        cover: "https://covers.openlibrary.org/b/id/7222264-L.jpg",
        progress: 88,
        downloaded: true,
        type: "books",
        dateAdded: new Date('2024-09-30')
    },
    {
        id: 12,
        title: "Brave New World",
        author: "Aldous Huxley",
        cover: "https://covers.openlibrary.org/b/id/7222248-L.jpg",
        progress: 15,
        downloaded: true,
        type: "books",
        dateAdded: new Date('2024-09-25')
    },
    {
        id: 13,
        title: "The Alchemist",
        author: "Paulo Coelho",
        cover: "https://covers.openlibrary.org/b/id/8421983-L.jpg",
        progress: 0,
        downloaded: false,
        type: "books",
        dateAdded: new Date('2024-09-20')
    },
    {
        id: 14,
        title: "Moby-Dick",
        author: "Herman Melville",
        cover: "https://covers.openlibrary.org/b/id/8239596-L.jpg",
        progress: 45,
        downloaded: true,
        type: "books",
        dateAdded: new Date('2024-09-15')
    },
    {
        id: 15,
        title: "The Picture of Dorian Gray",
        author: "Oscar Wilde",
        cover: "https://covers.openlibrary.org/b/id/8235935-L.jpg",
        progress: 71,
        downloaded: true,
        type: "books",
        dateAdded: new Date('2024-09-10')
    },
    {
        id: 16,
        title: "The Odyssey",
        author: "Homer",
        cover: "https://covers.openlibrary.org/b/id/8235143-L.jpg",
        progress: 0,
        downloaded: false,
        type: "books",
        dateAdded: new Date('2024-09-05'),
        isNew: true
    },
    {
        id: 17,
        title: "Wuthering Heights",
        author: "Emily Brontë",
        cover: "https://covers.openlibrary.org/b/id/8235621-L.jpg",
        progress: 62,
        downloaded: true,
        type: "books",
        dateAdded: new Date('2024-08-30')
    },
    {
        id: 18,
        title: "Dracula",
        author: "Bram Stoker",
        cover: "https://covers.openlibrary.org/b/id/8235711-L.jpg",
        progress: 100,
        downloaded: true,
        type: "books",
        dateAdded: new Date('2024-08-25'),
        isRead: true
    }
];

// State Management
let currentBooks = [...booksData];
let currentFilter = 'all';
let currentSort = 'recent';
let currentView = 'grid';

// DOM Elements
const searchBtn = document.getElementById('search-btn');
const searchContainer = document.getElementById('search-container');
const searchInput = document.getElementById('search-input');
const closeSearch = document.getElementById('close-search');
const libraryGrid = document.getElementById('library-grid');
const libraryList = document.getElementById('library-list');
const filterBtns = document.querySelectorAll('.filter-btn');
const sortSelect = document.getElementById('sort-select');
const viewToggle = document.getElementById('view-toggle');
const bookModal = document.getElementById('book-modal');
const modalClose = document.getElementById('modal-close');
const menuBtn = document.getElementById('menu-btn');
const settingsMenu = document.getElementById('settings-menu');
const homeBtn = document.getElementById('home-btn');
const backBtn = document.getElementById('back-btn');
const storeBtn = document.getElementById('store-btn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateTime();
    setInterval(updateTime, 60000); // Update time every minute
    renderBooks();
    setupEventListeners();
});

// Update Time in Status Bar
function updateTime() {
    const timeElement = document.querySelector('.time');
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    timeElement.textContent = `${displayHours}:${minutes} ${ampm}`;
}

// Setup Event Listeners
function setupEventListeners() {
    // Search
    searchBtn.addEventListener('click', toggleSearch);
    closeSearch.addEventListener('click', toggleSearch);
    searchInput.addEventListener('input', handleSearch);

    // Filters
    filterBtns.forEach(btn => {
        btn.addEventListener('click', handleFilter);
    });

    // Sort
    sortSelect.addEventListener('change', handleSort);

    // View Toggle
    viewToggle.addEventListener('click', toggleView);

    // Modal
    modalClose.addEventListener('click', closeModal);
    bookModal.addEventListener('click', (e) => {
        if (e.target === bookModal) closeModal();
    });

    // Settings Menu
    menuBtn.addEventListener('click', toggleSettings);

    // Navigation buttons
    homeBtn.addEventListener('click', () => {
        alert('Home button clicked - would navigate to home');
    });

    backBtn.addEventListener('click', () => {
        alert('Back button clicked - would navigate back');
    });

    storeBtn.addEventListener('click', () => {
        alert('Store button clicked - would open Kindle Store');
    });
}

// Toggle Search
function toggleSearch() {
    searchContainer.classList.toggle('active');
    if (searchContainer.classList.contains('active')) {
        searchInput.focus();
    } else {
        searchInput.value = '';
        currentBooks = [...booksData];
        applyFiltersAndSort();
    }
}

// Handle Search
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase().trim();

    if (searchTerm === '') {
        currentBooks = [...booksData];
    } else {
        currentBooks = booksData.filter(book =>
            book.title.toLowerCase().includes(searchTerm) ||
            book.author.toLowerCase().includes(searchTerm)
        );
    }

    applyFiltersAndSort();
}

// Handle Filter
function handleFilter(e) {
    // Update active button
    filterBtns.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');

    currentFilter = e.target.dataset.filter;
    applyFiltersAndSort();
}

// Handle Sort
function handleSort(e) {
    currentSort = e.target.value;
    applyFiltersAndSort();
}

// Apply Filters and Sort
function applyFiltersAndSort() {
    let filtered = [...currentBooks];

    // Apply filter
    if (currentFilter !== 'all') {
        if (currentFilter === 'downloaded') {
            filtered = filtered.filter(book => book.downloaded);
        } else {
            filtered = filtered.filter(book => book.type === currentFilter);
        }
    }

    // Apply sort
    switch (currentSort) {
        case 'title':
            filtered.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'author':
            filtered.sort((a, b) => a.author.localeCompare(b.author));
            break;
        case 'recent':
        default:
            filtered.sort((a, b) => b.dateAdded - a.dateAdded);
            break;
    }

    renderBooks(filtered);
}

// Toggle View
function toggleView() {
    if (currentView === 'grid') {
        currentView = 'list';
        libraryGrid.classList.add('hidden');
        libraryList.classList.remove('hidden');
        viewToggle.classList.add('list-active');
    } else {
        currentView = 'grid';
        libraryGrid.classList.remove('hidden');
        libraryList.classList.add('hidden');
        viewToggle.classList.remove('list-active');
    }

    applyFiltersAndSort();
}

// Render Books
function renderBooks(books = currentBooks) {
    // Clear both views
    libraryGrid.innerHTML = '';
    libraryList.innerHTML = '';

    books.forEach((book, index) => {
        // Create grid view item
        const gridItem = createBookGridItem(book);
        // Add smooth appearance animation with stagger
        setTimeout(() => {
            gridItem.classList.add('smooth-appear');
        }, index * 30);
        libraryGrid.appendChild(gridItem);

        // Create list view item
        const listItem = createBookListItem(book);
        setTimeout(() => {
            listItem.classList.add('smooth-appear');
        }, index * 30);
        libraryList.appendChild(listItem);
    });
}

// Create Book Grid Item
function createBookGridItem(book) {
    const item = document.createElement('div');
    item.className = 'book-item';
    item.onclick = () => openBookModal(book);

    const coverContainer = document.createElement('div');
    coverContainer.className = 'book-cover-container';

    const cover = document.createElement('img');
    cover.className = 'book-cover';
    cover.src = book.cover;
    cover.alt = book.title;
    cover.onerror = () => {
        cover.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="140" height="210" viewBox="0 0 140 210"%3E%3Crect width="140" height="210" fill="%23E0E0E0"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="14" fill="%23666666"%3ENo Cover%3C/text%3E%3C/svg%3E';
    };

    coverContainer.appendChild(cover);

    // Add new badge if applicable
    if (book.isNew) {
        const newBadge = document.createElement('div');
        newBadge.className = 'book-badge new-badge';
        newBadge.textContent = 'NEW';
        coverContainer.appendChild(newBadge);
    }

    // Add downloaded badge if applicable
    if (book.downloaded && !book.isNew) {
        const badge = document.createElement('div');
        badge.className = 'book-badge';
        badge.innerHTML = `
            <svg class="checkmark" viewBox="0 0 20 20" fill="white">
                <path d="M8.5 14l-4-4 1.4-1.4 2.6 2.6 6.6-6.6 1.4 1.4z"/>
            </svg>
            Downloaded
        `;
        coverContainer.appendChild(badge);
    }

    // Add read badge if applicable
    if (book.isRead) {
        const readBadge = document.createElement('div');
        readBadge.className = 'book-badge read-badge';
        readBadge.textContent = 'FINISHED';
        coverContainer.appendChild(readBadge);
    }

    // Add progress bar if book has been started
    if (book.progress > 0 && book.progress < 100) {
        const progressContainer = document.createElement('div');
        progressContainer.className = 'progress-bar-container';

        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.style.width = `${book.progress}%`;

        progressContainer.appendChild(progressBar);
        coverContainer.appendChild(progressContainer);
    }

    const title = document.createElement('div');
    title.className = 'book-title';
    title.textContent = book.title;

    const author = document.createElement('div');
    author.className = 'book-author';
    author.textContent = book.author;

    item.appendChild(coverContainer);
    item.appendChild(title);
    item.appendChild(author);

    return item;
}

// Create Book List Item
function createBookListItem(book) {
    const item = document.createElement('div');
    item.className = 'book-list-item';
    item.onclick = () => openBookModal(book);

    const coverContainer = document.createElement('div');
    coverContainer.className = 'book-cover-container';

    const cover = document.createElement('img');
    cover.className = 'book-cover';
    cover.src = book.cover;
    cover.alt = book.title;
    cover.onerror = () => {
        cover.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="60" height="90" viewBox="0 0 60 90"%3E%3Crect width="60" height="90" fill="%23E0E0E0"/%3E%3C/svg%3E';
    };

    coverContainer.appendChild(cover);

    const info = document.createElement('div');
    info.className = 'book-list-info';

    const title = document.createElement('div');
    title.className = 'book-title';
    title.textContent = book.title;

    const author = document.createElement('div');
    author.className = 'book-author';
    author.textContent = book.author;

    const progressText = document.createElement('div');
    progressText.className = 'book-list-progress';

    // Create progress dots (20 dots representing 5% each)
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'progress-dots';
    const numDots = 20;
    const filledDots = Math.floor((book.progress / 100) * numDots);

    for (let i = 0; i < numDots; i++) {
        const dot = document.createElement('div');
        dot.className = 'progress-dot';
        if (i < filledDots) {
            dot.classList.add('filled');
        }
        dotsContainer.appendChild(dot);
    }

    const progressLabel = document.createElement('span');
    if (book.progress === 0) {
        progressLabel.textContent = 'Not started';
    } else if (book.progress === 100) {
        progressLabel.textContent = 'Finished';
    } else {
        progressLabel.textContent = `${book.progress}%`;
    }

    progressText.appendChild(dotsContainer);
    progressText.appendChild(progressLabel);

    info.appendChild(title);
    info.appendChild(author);
    info.appendChild(progressText);

    item.appendChild(coverContainer);
    item.appendChild(info);

    return item;
}

// Open Book Modal
function openBookModal(book) {
    const modalCover = document.getElementById('modal-cover');
    const modalTitle = document.getElementById('modal-title');
    const modalAuthor = document.getElementById('modal-author');
    const modalProgress = document.getElementById('modal-progress');

    modalCover.src = book.cover;
    modalCover.alt = book.title;
    modalTitle.textContent = book.title;
    modalAuthor.textContent = `by ${book.author}`;

    if (book.progress === 0) {
        modalProgress.textContent = 'Not started';
    } else if (book.progress === 100) {
        modalProgress.textContent = 'Finished reading';
    } else {
        modalProgress.textContent = `${book.progress}% complete`;
    }

    bookModal.classList.add('active');
}

// Close Modal
function closeModal() {
    bookModal.classList.remove('active');
}

// Toggle Settings Menu
function toggleSettings() {
    settingsMenu.classList.toggle('active');
}

// Close settings menu when clicking outside
document.addEventListener('click', (e) => {
    if (!settingsMenu.contains(e.target) && !menuBtn.contains(e.target)) {
        settingsMenu.classList.remove('active');
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Escape key closes modal and search
    if (e.key === 'Escape') {
        closeModal();
        if (searchContainer.classList.contains('active')) {
            toggleSearch();
        }
        settingsMenu.classList.remove('active');
    }

    // Ctrl/Cmd + F opens search
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        if (!searchContainer.classList.contains('active')) {
            toggleSearch();
        }
    }
});
