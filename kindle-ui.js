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
const searchContainer = document.getElementById('search-container');
const searchInput = document.getElementById('search-input');
const closeSearch = document.getElementById('close-search');
const libraryGrid = document.getElementById('library-grid');
const libraryList = document.getElementById('library-list');
const collectionsGrid = document.getElementById('collections-grid');
const bookModal = document.getElementById('book-modal');
const modalClose = document.getElementById('modal-close');
const settingsMenu = document.getElementById('settings-menu');

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
    // Modal
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    if (bookModal) {
        bookModal.addEventListener('click', (e) => {
            if (e.target === bookModal) closeModal();
        });
    }

    // X-Ray button
    const xrayButton = document.getElementById('xray-button');
    if (xrayButton) {
        xrayButton.addEventListener('click', (e) => {
            e.stopPropagation();
            alert('X-Ray Feature\n\nExplore characters, places, and terms in this book.\n\nFeatures:\n• People - See all character mentions\n• Terms - Key locations and concepts\n• Notable Clips - Memorable passages');
        });
    }

    // Bottom Navigation
    const homeTab = document.getElementById('home-tab');
    const libraryTab = document.getElementById('library-tab');
    const currentBookButton = document.getElementById('current-book');

    if (homeTab) {
        homeTab.addEventListener('click', () => {
            homeTab.classList.add('active');
            libraryTab.classList.remove('active');
            // Home screen functionality (to be implemented with Issue #8)
            alert('Home Screen\n\nFeature coming soon:\n• Continue Reading carousel\n• Books You May Like recommendations\n• Recommended For You section');
        });
    }

    if (libraryTab) {
        libraryTab.addEventListener('click', () => {
            libraryTab.classList.add('active');
            homeTab.classList.remove('active');
            // Already showing library view
        });
    }

    if (currentBookButton) {
        currentBookButton.addEventListener('click', () => {
            // Open the most recently read book
            const recentBooks = [...currentBooks].filter(b => b.progress > 0 && b.progress < 100);
            if (recentBooks.length > 0) {
                recentBooks.sort((a, b) => b.dateAdded - a.dateAdded);
                openBookModal(recentBooks[0]);
            } else {
                alert('No book currently being read.\n\nStart reading a book to use this feature.');
            }
        });
    }

    // Library Menu Dropdown (Issue #5)
    const libraryMenuBtn = document.getElementById('library-menu');
    const libraryDropdown = document.getElementById('library-dropdown');

    if (libraryMenuBtn && libraryDropdown) {
        libraryMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            libraryDropdown.classList.toggle('hidden');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!libraryDropdown.contains(e.target) && e.target !== libraryMenuBtn) {
                libraryDropdown.classList.add('hidden');
            }
        });

        // View switching
        const viewButtons = libraryDropdown.querySelectorAll('[data-view]');
        viewButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const view = btn.getAttribute('data-view');
                currentView = view;

                // Update active state
                viewButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Toggle view
                if (view === 'grid') {
                    libraryGrid.classList.remove('hidden');
                    libraryList.classList.add('hidden');
                } else if (view === 'list') {
                    libraryGrid.classList.add('hidden');
                    libraryList.classList.remove('hidden');
                }

                libraryDropdown.classList.add('hidden');
            });
        });

        // Sort switching
        const sortButtons = libraryDropdown.querySelectorAll('[data-sort]');
        sortButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const sort = btn.getAttribute('data-sort');
                currentSort = sort;

                // Update active state
                sortButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Sort books
                sortBooks(sort);
                renderBooks();

                libraryDropdown.classList.add('hidden');
            });
        });
    }

    // Store button (Issue #6)
    const storeBtn = document.getElementById('store-btn');
    if (storeBtn) {
        storeBtn.addEventListener('click', () => {
            alert('Kindle Store\n\nBrowse and purchase books from the Kindle Store.\n\nThis would open the store on a real Kindle device.');
        });
    }

    // Search functionality (Issue #6)
    const topSearchInput = document.getElementById('top-search');
    if (topSearchInput) {
        topSearchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();

            if (query === '') {
                currentBooks = [...booksData];
            } else {
                currentBooks = booksData.filter(book =>
                    book.title.toLowerCase().includes(query) ||
                    book.author.toLowerCase().includes(query)
                );
            }

            renderBooks();
        });
    }

    // Tap-to-Reveal Top Toolbar
    const topToolbar = document.getElementById('top-toolbar');
    let toolbarHideTimeout = null;

    // Detect tap on top 15% of screen
    document.addEventListener('click', (e) => {
        const screenHeight = window.innerHeight;
        const clickY = e.clientY;

        // Only toggle if clicking in top 15% and not clicking the toolbar itself
        if (clickY < screenHeight * 0.15 && !topToolbar.contains(e.target)) {
            topToolbar.classList.toggle('hidden');

            // Clear existing timeout
            if (toolbarHideTimeout) {
                clearTimeout(toolbarHideTimeout);
            }

            // Auto-hide after 4 seconds if visible
            if (!topToolbar.classList.contains('hidden')) {
                toolbarHideTimeout = setTimeout(() => {
                    topToolbar.classList.add('hidden');
                }, 4000);
            }
        }
    });

    // Toolbar button actions
    const toolbarHome = document.getElementById('toolbar-home');
    const toolbarBack = document.getElementById('toolbar-back');
    const toolbarLight = document.getElementById('toolbar-light');
    const toolbarStore = document.getElementById('toolbar-store');
    const toolbarSearch = document.getElementById('toolbar-search');
    const toolbarMenu = document.getElementById('toolbar-menu');

    if (toolbarHome) {
        toolbarHome.addEventListener('click', () => {
            topToolbar.classList.add('hidden');
            alert('Home\n\nReturn to home screen');
        });
    }

    if (toolbarBack) {
        toolbarBack.addEventListener('click', () => {
            topToolbar.classList.add('hidden');
            alert('Back\n\nGo to previous screen');
        });
    }

    if (toolbarLight) {
        toolbarLight.addEventListener('click', () => {
            topToolbar.classList.add('hidden');
            alert('Front Light\n\nAdjust screen brightness (1-24 levels)\n\nThis feature would control the front light on a real Kindle.');
        });
    }

    if (toolbarStore) {
        toolbarStore.addEventListener('click', () => {
            topToolbar.classList.add('hidden');
            alert('Kindle Store\n\nBrowse and purchase books\n\nThis would open the Kindle Store on a real device.');
        });
    }

    if (toolbarSearch) {
        toolbarSearch.addEventListener('click', () => {
            topToolbar.classList.add('hidden');
            alert('Search\n\nSearch your library and the Kindle Store');
        });
    }

    if (toolbarMenu) {
        toolbarMenu.addEventListener('click', () => {
            topToolbar.classList.add('hidden');
            alert('Menu\n\nAdditional options:\n• Settings\n• Sync\n• Send to Kindle\n• Manage Your Content\n• Help');
        });
    }
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



// Sort Books
function sortBooks(sortBy) {
    switch (sortBy) {
        case 'recent':
            currentBooks.sort((a, b) => b.dateAdded - a.dateAdded);
            break;
        case 'title':
            currentBooks.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'author':
            currentBooks.sort((a, b) => a.author.localeCompare(b.author));
            break;
        default:
            currentBooks.sort((a, b) => b.dateAdded - a.dateAdded);
    }
}

// Render Books
function renderBooks(books = currentBooks) {
    // Clear both views
    libraryGrid.innerHTML = '';
    libraryList.innerHTML = '';

    books.forEach((book) => {
        // Create grid view item
        const gridItem = createBookGridItem(book);
        libraryGrid.appendChild(gridItem);

        // Create list view item
        const listItem = createBookListItem(book);
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

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Escape key closes modal
    if (e.key === 'Escape') {
        closeModal();
    }
});
