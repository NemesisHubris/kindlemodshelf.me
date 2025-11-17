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
        dateAdded: new Date('2024-11-15'),
        publisher: "Scribner",
        publicationDate: "1925",
        location: 1245,
        totalLocations: 1920,
        timeLeftInBook: "1h 23m",
        timeLeftInChapter: "12m"
    },
    {
        id: 2,
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        cover: "https://covers.openlibrary.org/b/id/8228691-L.jpg",
        progress: 42,
        downloaded: true,
        type: "books",
        dateAdded: new Date('2024-11-10'),
        publisher: "J.B. Lippincott & Co.",
        publicationDate: "1960",
        location: 1680,
        totalLocations: 4000,
        timeLeftInBook: "3h 45m",
        timeLeftInChapter: "18m"
    },
    {
        id: 3,
        title: "1984",
        author: "George Orwell",
        cover: "https://covers.openlibrary.org/b/id/7222246-L.jpg",
        progress: 0,
        downloaded: false,
        type: "books",
        dateAdded: new Date('2024-11-08'),
        publisher: "Secker & Warburg",
        publicationDate: "1949",
        location: 0,
        totalLocations: 3850,
        timeLeftInBook: "6h 42m",
        timeLeftInChapter: "Not started"
    },
    {
        id: 4,
        title: "Pride and Prejudice",
        author: "Jane Austen",
        cover: "https://covers.openlibrary.org/b/id/8200794-L.jpg",
        progress: 100,
        downloaded: true,
        type: "books",
        dateAdded: new Date('2024-11-01'),
        publisher: "T. Egerton",
        publicationDate: "1813",
        location: 4500,
        totalLocations: 4500,
        timeLeftInBook: "Finished",
        timeLeftInChapter: "Finished"
    },
    {
        id: 5,
        title: "The Catcher in the Rye",
        author: "J.D. Salinger",
        cover: "https://covers.openlibrary.org/b/id/8235171-L.jpg",
        progress: 23,
        downloaded: true,
        type: "books",
        dateAdded: new Date('2024-10-28'),
        publisher: "Little, Brown",
        publicationDate: "1951",
        location: 650,
        totalLocations: 2850,
        timeLeftInBook: "3h 12m",
        timeLeftInChapter: "25m"
    },
    {
        id: 6,
        title: "Harry Potter and the Sorcerer's Stone",
        author: "J.K. Rowling",
        cover: "https://covers.openlibrary.org/b/id/10521270-L.jpg",
        progress: 78,
        downloaded: true,
        type: "books",
        dateAdded: new Date('2024-10-25'),
        publisher: "Scholastic",
        publicationDate: "1997",
        location: 3890,
        totalLocations: 5000,
        timeLeftInBook: "52m",
        timeLeftInChapter: "8m"
    },
    {
        id: 7,
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        cover: "https://covers.openlibrary.org/b/id/8494690-L.jpg",
        progress: 0,
        downloaded: false,
        type: "books",
        dateAdded: new Date('2024-10-20'),
        publisher: "George Allen & Unwin",
        publicationDate: "1937",
        location: 0,
        totalLocations: 4200,
        timeLeftInBook: "7h 15m",
        timeLeftInChapter: "Not started"
    },
    {
        id: 8,
        title: "Fahrenheit 451",
        author: "Ray Bradbury",
        cover: "https://covers.openlibrary.org/b/id/8229248-L.jpg",
        progress: 56,
        downloaded: true,
        type: "books",
        dateAdded: new Date('2024-10-15'),
        publisher: "Ballantine Books",
        publicationDate: "1953",
        location: 1680,
        totalLocations: 3000,
        timeLeftInBook: "2h 5m",
        timeLeftInChapter: "15m"
    },
    {
        id: 9,
        title: "The Lord of the Rings",
        author: "J.R.R. Tolkien",
        cover: "https://covers.openlibrary.org/b/id/8812151-L.jpg",
        progress: 34,
        downloaded: true,
        type: "books",
        dateAdded: new Date('2024-10-10'),
        publisher: "George Allen & Unwin",
        publicationDate: "1954",
        location: 4250,
        totalLocations: 12500,
        timeLeftInBook: "12h 45m",
        timeLeftInChapter: "32m"
    },
    {
        id: 10,
        title: "Jane Eyre",
        author: "Charlotte Brontë",
        cover: "https://covers.openlibrary.org/b/id/8238522-L.jpg",
        progress: 0,
        downloaded: false,
        type: "books",
        dateAdded: new Date('2024-10-05'),
        publisher: "Smith, Elder & Co.",
        publicationDate: "1847",
        location: 0,
        totalLocations: 6800,
        timeLeftInBook: "9h 30m",
        timeLeftInChapter: "Not started"
    },
    {
        id: 11,
        title: "Animal Farm",
        author: "George Orwell",
        cover: "https://covers.openlibrary.org/b/id/7222264-L.jpg",
        progress: 88,
        downloaded: true,
        type: "books",
        dateAdded: new Date('2024-09-30'),
        publisher: "Secker & Warburg",
        publicationDate: "1945",
        location: 1496,
        totalLocations: 1700,
        timeLeftInBook: "18m",
        timeLeftInChapter: "6m"
    },
    {
        id: 12,
        title: "Brave New World",
        author: "Aldous Huxley",
        cover: "https://covers.openlibrary.org/b/id/7222248-L.jpg",
        progress: 15,
        downloaded: true,
        type: "books",
        dateAdded: new Date('2024-09-25'),
        publisher: "Chatto & Windus",
        publicationDate: "1932",
        location: 585,
        totalLocations: 3900,
        timeLeftInBook: "4h 52m",
        timeLeftInChapter: "22m"
    },
    {
        id: 13,
        title: "The Alchemist",
        author: "Paulo Coelho",
        cover: "https://covers.openlibrary.org/b/id/8421983-L.jpg",
        progress: 0,
        downloaded: false,
        type: "books",
        dateAdded: new Date('2024-09-20'),
        publisher: "HarperCollins",
        publicationDate: "1988",
        location: 0,
        totalLocations: 2450,
        timeLeftInBook: "4h 15m",
        timeLeftInChapter: "Not started"
    },
    {
        id: 14,
        title: "Moby-Dick",
        author: "Herman Melville",
        cover: "https://covers.openlibrary.org/b/id/8239596-L.jpg",
        progress: 45,
        downloaded: true,
        type: "books",
        dateAdded: new Date('2024-09-15'),
        publisher: "Richard Bentley",
        publicationDate: "1851",
        location: 5400,
        totalLocations: 12000,
        timeLeftInBook: "10h 22m",
        timeLeftInChapter: "28m"
    },
    {
        id: 15,
        title: "The Picture of Dorian Gray",
        author: "Oscar Wilde",
        cover: "https://covers.openlibrary.org/b/id/8235935-L.jpg",
        progress: 71,
        downloaded: true,
        type: "books",
        dateAdded: new Date('2024-09-10'),
        publisher: "Ward, Lock & Co.",
        publicationDate: "1890",
        location: 2485,
        totalLocations: 3500,
        timeLeftInBook: "1h 35m",
        timeLeftInChapter: "11m"
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
        isNew: true,
        publisher: "Penguin Classics",
        publicationDate: "800 BC",
        location: 0,
        totalLocations: 7500,
        timeLeftInBook: "11h 20m",
        timeLeftInChapter: "Not started"
    },
    {
        id: 17,
        title: "Wuthering Heights",
        author: "Emily Brontë",
        cover: "https://covers.openlibrary.org/b/id/8235621-L.jpg",
        progress: 62,
        downloaded: true,
        type: "books",
        dateAdded: new Date('2024-08-30'),
        publisher: "Thomas Cautley Newby",
        publicationDate: "1847",
        location: 3100,
        totalLocations: 5000,
        timeLeftInBook: "2h 48m",
        timeLeftInChapter: "16m"
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
        isRead: true,
        publisher: "Archibald Constable and Company",
        publicationDate: "1897",
        location: 6200,
        totalLocations: 6200,
        timeLeftInBook: "Finished",
        timeLeftInChapter: "Finished"
    }
];

// Collections Data
const collectionsData = [
    {
        id: 1,
        name: "Classics",
        bookIds: [1, 2, 3, 4, 5, 10, 17],
        dateCreated: new Date('2024-11-01')
    },
    {
        id: 2,
        name: "Science Fiction",
        bookIds: [3, 8, 12],
        dateCreated: new Date('2024-10-15')
    },
    {
        id: 3,
        name: "Fantasy",
        bookIds: [6, 7, 9, 16],
        dateCreated: new Date('2024-10-20')
    },
    {
        id: 4,
        name: "Currently Reading",
        bookIds: [1, 2, 6, 8, 15, 17],
        dateCreated: new Date('2024-11-10')
    },
    {
        id: 5,
        name: "To Read",
        bookIds: [3, 7, 10, 13, 16],
        dateCreated: new Date('2024-09-01')
    }
];

// State Management
let currentBooks = [...booksData];
let currentFilter = 'all';
let currentSort = 'recent';
let currentView = 'grid';
let showingCollections = false;

// DOM Elements
const searchBtn = document.getElementById('search-btn');
const searchContainer = document.getElementById('search-container');
const searchInput = document.getElementById('search-input');
const closeSearch = document.getElementById('close-search');
const libraryGrid = document.getElementById('library-grid');
const libraryList = document.getElementById('library-list');
const collectionsGrid = document.getElementById('collections-grid');
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
    simulateInitialSync();
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

    // X-Ray button
    const xrayButton = document.getElementById('xray-button');
    if (xrayButton) {
        xrayButton.addEventListener('click', (e) => {
            e.stopPropagation();
            alert('X-Ray Feature\n\nExplore characters, places, and terms in this book.\n\nFeatures:\n• People - See all character mentions\n• Terms - Key locations and concepts\n• Notable Clips - Memorable passages');
        });
    }

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

// Simulate Initial Sync
function simulateInitialSync() {
    const syncIcon = document.getElementById('sync-icon');
    if (syncIcon) {
        // Show sync icon for 2 seconds to simulate syncing
        syncIcon.classList.remove('hidden');
        setTimeout(() => {
            syncIcon.classList.add('hidden');
        }, 2000);
    }
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

    // Check if Collections filter was selected
    if (currentFilter === 'collections') {
        showingCollections = true;
        renderCollections();
    } else {
        showingCollections = false;
        applyFiltersAndSort();
    }
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
    // Don't toggle view when showing collections
    if (showingCollections) return;

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

// Render Collections
function renderCollections() {
    // Hide book views
    libraryGrid.classList.add('hidden');
    libraryList.classList.add('hidden');
    // Show collections view
    collectionsGrid.classList.remove('hidden');

    // Clear collections grid
    collectionsGrid.innerHTML = '';

    collectionsData.forEach((collection, index) => {
        const collectionItem = createCollectionItem(collection);
        // Add smooth appearance animation with stagger
        setTimeout(() => {
            collectionItem.classList.add('smooth-appear');
        }, index * 30);
        collectionsGrid.appendChild(collectionItem);
    });
}

// Create Collection Item
function createCollectionItem(collection) {
    const item = document.createElement('div');
    item.className = 'collection-item';
    item.onclick = () => openCollection(collection);

    const icon = document.createElement('svg');
    icon.className = 'collection-icon';
    icon.setAttribute('viewBox', '0 0 24 24');
    icon.innerHTML = `
        <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>
    `;

    const name = document.createElement('div');
    name.className = 'collection-name';
    name.textContent = collection.name;

    const count = document.createElement('div');
    count.className = 'collection-count';
    const bookCount = collection.bookIds.length;
    count.textContent = `${bookCount} ${bookCount === 1 ? 'item' : 'items'}`;

    item.appendChild(icon);
    item.appendChild(name);
    item.appendChild(count);

    return item;
}

// Open Collection
function openCollection(collection) {
    // Filter books to show only those in this collection
    currentBooks = booksData.filter(book => collection.bookIds.includes(book.id));
    currentFilter = 'all';
    showingCollections = false;

    // Hide collections view, show book view
    collectionsGrid.classList.add('hidden');
    libraryGrid.classList.remove('hidden');

    // Update filter buttons
    filterBtns.forEach(btn => btn.classList.remove('active'));
    filterBtns[0].classList.add('active'); // Activate "All" button

    renderBooks(currentBooks);
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

    const cover = document.createElement('img');
    cover.className = 'book-cover';
    cover.src = book.cover;
    cover.alt = book.title;
    cover.onerror = () => {
        cover.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="220" height="330" viewBox="0 0 220 330"%3E%3Crect width="220" height="330" fill="%23DDDDDD"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="12" fill="%23666666"%3ENo Cover%3C/text%3E%3C/svg%3E';
    };

    item.appendChild(cover);

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
    const modalPublisher = document.getElementById('modal-publisher');
    const modalProgress = document.getElementById('modal-progress');
    const modalLocation = document.getElementById('modal-location');
    const modalTimeLeft = document.getElementById('modal-time-left');

    modalCover.src = book.cover;
    modalCover.alt = book.title;
    modalTitle.textContent = book.title;
    modalAuthor.textContent = `by ${book.author}`;

    // Publisher and publication date
    if (book.publisher && book.publicationDate) {
        modalPublisher.textContent = `${book.publisher} (${book.publicationDate})`;
    } else {
        modalPublisher.textContent = '';
    }

    // Progress display
    if (book.progress === 0) {
        modalProgress.textContent = 'Not started';
    } else if (book.progress === 100) {
        modalProgress.textContent = 'Finished reading';
    } else {
        modalProgress.textContent = `${book.progress}% complete`;
    }

    // Location display (Kindle-style)
    if (book.location !== undefined && book.totalLocations) {
        modalLocation.textContent = `Location ${book.location} of ${book.totalLocations}`;
    } else {
        modalLocation.textContent = '';
    }

    // Time left display (Kindle-style)
    if (book.timeLeftInBook && book.timeLeftInChapter) {
        if (book.progress === 0) {
            modalTimeLeft.textContent = `Time to read: ${book.timeLeftInBook}`;
        } else if (book.progress === 100) {
            modalTimeLeft.textContent = '';
        } else {
            modalTimeLeft.textContent = `Time left in book: ${book.timeLeftInBook} • Time left in chapter: ${book.timeLeftInChapter}`;
        }
    } else {
        modalTimeLeft.textContent = '';
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
