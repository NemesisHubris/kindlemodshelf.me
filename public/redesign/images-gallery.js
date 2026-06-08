const IMAGES_PER_LOAD = 30;
const PLACEHOLDER_SRC = 'data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=';
const RANDOMIZATION_INTERVAL = 24 * 60 * 60 * 1000;
const RANDOMIZED_ORDER_KEY = 'gallery_randomized_order';
const RANDOMIZATION_TIMESTAMP_KEY = 'gallery_randomization_time';
const SEARCH_DEBOUNCE_MS = 150;
const favoritesApi = window.KindleModsFavorites || null;
const urlParams = new URLSearchParams(window.location.search);

// Concurrency control — limit simultaneous image downloads
const MAX_CONCURRENT_LOADS = 4;
let activeLoads = 0;
const loadQueue = [];

let allData = null;
let masterImages = [];
let allImages = [];
let authorIndex = {};
let loadedCount = 0;
let isLoading = false;
let isSearchMode = false;
let cachedPlaceholderBg = '';
let searchDebounceTimer = null;
let isFavoritesMode = urlParams.get('favorites') === '1';

const galleryRoot = document.getElementById('gallery-root');
const loadingIndicator = document.getElementById('loading-indicator');
const streamView = document.getElementById('stream-view');
const searchView = document.getElementById('search-view');
const searchResults = document.getElementById('search-results');
const allImagesLink = document.getElementById('all-images-link');
const favoritesToggleLink = document.getElementById('favorites-toggle-link');
const favoritesCount = document.getElementById('favorites-count');

const imageObserver = new IntersectionObserver(handleImageIntersection, {
  root: null,
  rootMargin: '300px 0px 300px 0px',
  threshold: 0.01
});

let scrollEnabled = false;

function getPlaceholderBackground() {
  if (!cachedPlaceholderBg) {
    cachedPlaceholderBg = getComputedStyle(document.documentElement).getPropertyValue('--placeholder-bg').trim();
  }
  return cachedPlaceholderBg;
}

function shouldRandomizeOrder() {
  let lastRandomTime = null;
  try { lastRandomTime = localStorage.getItem(RANDOMIZATION_TIMESTAMP_KEY); } catch(e) {}
  if (!lastRandomTime) return true;
  const timeSinceLastRandom = Date.now() - parseInt(lastRandomTime);
  return timeSinceLastRandom > RANDOMIZATION_INTERVAL;
}

function getRandomizedOrder(sourceImages = masterImages) {
  if (!shouldRandomizeOrder()) {
    let cached = null;
    try { cached = localStorage.getItem(RANDOMIZED_ORDER_KEY); } catch(e) {}
    if (cached) {
      try {
        const indices = JSON.parse(cached);
        if (Array.isArray(indices) && indices.length === sourceImages.length) {
          return indices.map(i => sourceImages[i]);
        }
      } catch (e) {
        console.warn('Could not parse cached randomized order');
      }
    }
  }

  const indices = Array.from({ length: sourceImages.length }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  try {
    localStorage.setItem(RANDOMIZED_ORDER_KEY, JSON.stringify(indices));
    localStorage.setItem(RANDOMIZATION_TIMESTAMP_KEY, Date.now().toString());
  } catch (e) {
    console.warn('Could not save randomized order to localStorage:', e);
  }

  return indices.map(i => sourceImages[i]);
}

function buildAuthorIndex(images = allImages) {
  authorIndex = {};
  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    if (!authorIndex[img.author]) {
      authorIndex[img.author] = [];
    }
    authorIndex[img.author].push(img);
  }
}

// --- Concurrent load queue ---

function enqueueLoad(img) {
  // Don't double-queue
  if (img.dataset.loaded === '1' || img.dataset.queued === '1') return;
  img.dataset.queued = '1';
  loadQueue.push(img);
  drainQueue();
}

function dequeueLoad(img) {
  if (img.dataset.queued !== '1') return;
  img.dataset.queued = '0';
  const idx = loadQueue.indexOf(img);
  if (idx !== -1) loadQueue.splice(idx, 1);
}

function drainQueue() {
  while (activeLoads < MAX_CONCURRENT_LOADS && loadQueue.length > 0) {
    const img = loadQueue.shift();
    // Skip if unloaded while waiting in queue
    if (!img.isConnected || img.dataset.queued !== '1') {
      img.dataset.queued = '0';
      continue;
    }
    img.dataset.queued = '0';
    startLoad(img);
  }
}

function startLoad(img) {
  activeLoads++;
  const imgPath = img.dataset.fullPath;

  const loader = new Image();
  loader.decoding = 'async';

  loader.onload = function() {
    if (img.isConnected && img.dataset.loaded !== '1') {
      img.src = imgPath;
      img.dataset.loaded = '1';
      img.classList.add('loaded');
    }
    activeLoads--;
    drainQueue();
  };

  loader.onerror = function() {
    img.dataset.loaded = '0';
    activeLoads--;
    drainQueue();
  };

  loader.src = imgPath;
}

function unloadImage(img) {
  if (img.dataset.loaded !== '1' && img.dataset.queued !== '1') return;
  dequeueLoad(img);
  if (img.dataset.loaded === '1') {
    img.dataset.loaded = '0';
    img.src = PLACEHOLDER_SRC;
    img.classList.remove('loaded');
  }
}

// --- Intersection Observer ---

function handleImageIntersection(entries) {
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  entries.forEach(entry => {
    const img = entry.target;
    if (entry.isIntersecting) {
      enqueueLoad(img);
      return;
    }

    const rect = entry.boundingClientRect;
    if (rect.bottom < -1200 || rect.top > viewportHeight + 1200) {
      unloadImage(img);
    }
  });
}

// --- Data loading ---

fetch('/images.json')
  .then(res => {
    if (!res.ok) throw new Error('Could not load images.json');
    return res.json();
  })
  .then(data => {
    allData = data;

    Object.keys(data).sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' })).forEach(author => {
      const images = data[author];
      if (Array.isArray(images)) {
        images.forEach(filename => {
          masterImages.push({ author, filename });
        });
      }
    });

    if (masterImages.length === 0) {
      renderEmptyState(galleryRoot, 'No images found.');
      return;
    }

    refreshGalleryData();

    const searchBar = document.getElementById('search-bar');
    if (searchBar) searchBar.addEventListener('input', handleSearchInput);
    if (favoritesApi) {
      window.addEventListener(favoritesApi.CHANGE_EVENT, handleFavoritesChanged);
    }
  })
  .catch(error => {
    console.error('Error loading gallery:', error);
    galleryRoot.textContent = 'Could not load image list. Please contact the site owner.';
  });

// Event delegation for image clicks
document.addEventListener('click', function(event) {
  const favoriteBtn = event.target.closest('.favorite-btn');
  if (favoriteBtn) {
    event.preventDefault();
    event.stopPropagation();
    handleFavoriteToggle(favoriteBtn);
    return;
  }

  const img = event.target.closest('.img-thumb, .search-image');
  if (img) {
    openViewer(img);
  }
});

// --- Search ---

function handleSearchInput(event) {
  if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
  const query = event.target.value.trim().toLowerCase();

  if (query === '') {
    handleSearch('');
    return;
  }

  searchDebounceTimer = setTimeout(() => {
    searchDebounceTimer = null;
    handleSearch(query);
  }, SEARCH_DEBOUNCE_MS);
}

function handleSearch(query) {
  if (query === '') {
    isSearchMode = false;
    streamView.style.display = '';
    searchView.style.display = 'none';
    enableScrollLoading();
    loadedCount = 0;
    resetGallery();
    loadMoreImages(IMAGES_PER_LOAD);
    return;
  }

  isSearchMode = true;
  streamView.style.display = 'none';
  searchView.style.display = '';
    disableScrollLoading();

  const matchingAuthors = Object.keys(authorIndex)
    .filter(author => author.toLowerCase().includes(query))
    .sort();

  searchResults.innerHTML = '';

  if (matchingAuthors.length === 0) {
    renderEmptyState(searchResults, isFavoritesMode ? 'No favorites match that author.' : 'No authors match your search.');
    return;
  }

  const fragment = document.createDocumentFragment();
  const bg = getPlaceholderBackground();

  matchingAuthors.forEach(author => {
    const authorHeader = document.createElement('div');
    authorHeader.className = 'search-author-header';
    authorHeader.textContent = author;
    fragment.appendChild(authorHeader);

    const imagesGrid = document.createElement('div');
    imagesGrid.className = 'search-images-grid';

    authorIndex[author].forEach(imgData => {
      const imgWrapper = document.createElement('div');
      imgWrapper.className = 'search-image-card';

      const img = document.createElement('img');
      img.className = 'search-image';
      img.alt = imgData.filename;
      img.loading = 'lazy';
      img.decoding = 'async';
      img.dataset.loaded = '0';
      img.dataset.queued = '0';
      img.dataset.fullPath = `/images/${author}/${imgData.filename}`;
      img.dataset.author = author;
      img.dataset.filename = imgData.filename;
      img.src = PLACEHOLDER_SRC;
      img.style.background = bg;

      imgWrapper.appendChild(img);
      imgWrapper.appendChild(createFavoriteButton(author, imgData.filename, { compact: true }));
      imagesGrid.appendChild(imgWrapper);
      imageObserver.observe(img);
    });

    fragment.appendChild(imagesGrid);
  });

  searchResults.appendChild(fragment);
}

// --- Infinite scroll ---

function handleScroll() {
  if (isSearchMode || isLoading || loadedCount >= allImages.length) return;
  const scrollY = window.scrollY;
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  if (scrollY + windowHeight > documentHeight - 400) {
    loadMoreImages(IMAGES_PER_LOAD);
  }
}

function loadMoreImages(count) {
  if (isSearchMode || isLoading || loadedCount >= allImages.length) return;

  isLoading = true;
  loadingIndicator.style.display = 'block';

  const endIndex = Math.min(loadedCount + count, allImages.length);
  const fragment = document.createDocumentFragment();
  const bg = getPlaceholderBackground();

  for (let i = loadedCount; i < endIndex; i++) {
    fragment.appendChild(createImageCell(allImages[i], bg));
  }

  galleryRoot.appendChild(fragment);
  loadedCount = endIndex;
  isLoading = false;
  loadingIndicator.style.display = 'none';

  if (loadedCount >= allImages.length) {
    disableScrollLoading();
  }
}

function createImageCell(imgData, bg) {
  const { author, filename } = imgData;

  const cell = document.createElement('div');
  cell.className = 'img-thumb-wrap';

  const img = document.createElement('img');
  img.className = 'img-thumb';
  img.alt = '';
  img.loading = 'lazy';
  img.decoding = 'async';
  img.dataset.loaded = '0';
  img.dataset.queued = '0';
  img.dataset.fullPath = `/images/${author}/${filename}`;
  img.dataset.author = author;
  img.dataset.filename = filename;
  img.src = PLACEHOLDER_SRC;
  img.style.background = bg;

  cell.appendChild(img);
  cell.appendChild(createFavoriteButton(author, filename));
  imageObserver.observe(img);
  return cell;
}

function resetGallery() {
  const thumbs = galleryRoot.querySelectorAll('.img-thumb');
  thumbs.forEach(img => {
    dequeueLoad(img);
    imageObserver.unobserve(img);
  });
  galleryRoot.innerHTML = '';
  loadedCount = 0;
  isLoading = false;
}

function enableScrollLoading() {
  if (scrollEnabled) return;
  window.addEventListener('scroll', handleScroll, { passive: true });
  scrollEnabled = true;
}

function disableScrollLoading() {
  if (!scrollEnabled) return;
  window.removeEventListener('scroll', handleScroll);
  scrollEnabled = false;
}

// --- Modal Viewer ---

const modal = document.getElementById('img-viewer-modal');
const modalImg = document.getElementById('img-viewer-img');
const modalDownload = document.getElementById('img-viewer-download');
const modalResize = document.getElementById('img-viewer-resize');
const modalClose = document.getElementById('img-viewer-close');
const modalAuthor = document.getElementById('img-viewer-author');
const modalFilename = document.getElementById('img-viewer-filename');
const modalLoader = document.getElementById('img-viewer-loader');
const sidebarImages = document.getElementById('sidebar-images');
const modalFavorite = document.getElementById('img-viewer-favorite');

let currentAuthor = null;
let currentFilename = null;
let closeViewerTimer = null;

function heartIconMarkup() {
  return `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.05" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="m12 20.4-1.15-1.05C5.2 14.24 2 11.33 2 7.75 2 5.1 4.08 3 6.72 3c1.5 0 2.94.69 3.88 1.78C11.54 3.69 12.98 3 14.48 3 17.12 3 19.2 5.1 19.2 7.75c0 3.58-3.2 6.49-8.85 11.6Z"></path>
    </svg>
  `;
}

function openViewer(thumbnail) {
  if (closeViewerTimer) {
    clearTimeout(closeViewerTimer);
    closeViewerTimer = null;
  }

  const author = thumbnail.dataset.author;
  const filename = thumbnail.dataset.filename;
  currentAuthor = author;
  currentFilename = filename;

  modal.style.display = 'flex';
  modal.classList.remove('active');
  modalLoader.classList.add('active');
  modalImg.style.opacity = '0';

  const src = thumbnail.dataset.fullPath;

  modalAuthor.textContent = author;
  modalFilename.textContent = filename;
  modalDownload.href = src;
  if (filename) {
    modalDownload.download = filename;
  }
  updateFavoriteButton(modalFavorite, author, filename);

  loadSidebarImages(author);

  modalImg.onload = function () {
    modalLoader.classList.remove('active');
    modalImg.style.opacity = '1';
    requestAnimationFrame(() => modal.classList.add('active'));
  };

  modalImg.onerror = function () {
    modalLoader.classList.remove('active');
    modalImg.style.opacity = '1';
  };

  modalImg.src = src;
  requestAnimationFrame(() => modal.classList.add('active'));
}

function loadSidebarImages(author) {
  const authorImages = masterImages.filter(img => img.author === author);
  sidebarImages.innerHTML = '';

  const fragment = document.createDocumentFragment();
  const bg = getPlaceholderBackground();

  authorImages.forEach(imgData => {
    const sidebarItem = document.createElement('div');
    sidebarItem.className = 'sidebar-image-item';
    sidebarItem.title = imgData.filename;

    const sidebarThumb = document.createElement('img');
    sidebarThumb.className = 'sidebar-thumb';
    sidebarThumb.alt = imgData.filename;
    sidebarThumb.loading = 'lazy';
    sidebarThumb.decoding = 'async';
    sidebarThumb.dataset.fullPath = `/images/${author}/${imgData.filename}`;
    sidebarThumb.dataset.author = author;
    sidebarThumb.dataset.filename = imgData.filename;
    sidebarThumb.dataset.loaded = '0';
    sidebarThumb.dataset.queued = '0';
    sidebarThumb.src = PLACEHOLDER_SRC;
    sidebarThumb.style.background = bg;

    if (imgData.filename === modalFilename.textContent) {
      sidebarItem.classList.add('active');
      setTimeout(() => {
        sidebarItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }

    sidebarThumb.addEventListener('click', () => {
      openViewer(sidebarThumb);
    });

    sidebarItem.appendChild(sidebarThumb);
    sidebarItem.appendChild(createFavoriteButton(author, imgData.filename, { compact: true }));
    fragment.appendChild(sidebarItem);
    imageObserver.observe(sidebarThumb);
  });

  sidebarImages.appendChild(fragment);
}

function closeViewer() {
  modal.classList.remove('active');
  closeViewerTimer = setTimeout(() => {
    closeViewerTimer = null;
    modal.style.display = 'none';
    modalImg.src = '';
    modalDownload.href = '#';
    modalLoader.classList.remove('active');
    sidebarImages.innerHTML = '';
    currentAuthor = null;
    currentFilename = null;
  }, 200);
}

modalClose.onclick = closeViewer;
modal.onclick = event => {
  if (event.target === modal) closeViewer();
};
document.addEventListener('keydown', event => {
  if (modal.classList.contains('active') && (event.key === 'Escape' || event.key === 'Esc')) {
    closeViewer();
  }
});

// Resize button
const resizeButton = document.getElementById('img-viewer-resize');
if (resizeButton) {
  resizeButton.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const img = document.getElementById('img-viewer-img');
    if (!img || !img.src) {
      console.error('No image source found');
      return;
    }
    if (typeof openCropper === 'function') {
      openCropper(img.src);
    } else {
      console.error('openCropper is not defined');
      alert('Cropper tool not ready. Please refresh the page.');
    }
  });
} else {
  console.error('Resize button element not found in DOM');
}

if (modalFavorite) {
  modalFavorite.addEventListener('click', event => {
    event.preventDefault();
    if (!currentAuthor || !currentFilename) return;
    if (!favoritesApi) return;
    favoritesApi.toggleFavorite(currentAuthor, currentFilename);
    updateFavoriteButton(modalFavorite, currentAuthor, currentFilename);
  });
}

function favoriteKey(author, filename) {
  return favoritesApi ? favoritesApi.favoriteKey(author, filename) : `${author}|||${filename}`;
}

function favoriteMap() {
  const map = new Map();
  if (!favoritesApi) return map;
  favoritesApi.loadFavorites().forEach(entry => {
    map.set(favoriteKey(entry.author, entry.filename), entry);
  });
  return map;
}

function getFavoritedImages() {
  if (!favoritesApi) return [];
  const favorites = favoriteMap();
  return masterImages
    .filter(img => favorites.has(favoriteKey(img.author, img.filename)))
    .sort((a, b) => {
      const aTime = favorites.get(favoriteKey(a.author, a.filename))?.addedAt || 0;
      const bTime = favorites.get(favoriteKey(b.author, b.filename))?.addedAt || 0;
      return bTime - aTime;
    });
}

function createFavoriteButton(author, filename, { compact = false } = {}) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = compact ? 'favorite-btn favorite-btn-compact' : 'favorite-btn';
  button.dataset.author = author;
  button.dataset.filename = filename;
  button.setAttribute('aria-label', 'Add to favorites');
  button.innerHTML = heartIconMarkup();
  updateFavoriteButton(button, author, filename);
  return button;
}

function updateFavoriteButton(button, author, filename) {
  if (!button) return;
  const isFavorite = favoritesApi ? favoritesApi.isFavorite(author, filename) : false;
  button.classList.toggle('is-favorite', isFavorite);
  button.setAttribute('aria-pressed', String(isFavorite));
  button.setAttribute('aria-label', isFavorite ? 'Remove from favorites' : 'Add to favorites');
  if (button.querySelector('span')) {
    button.querySelector('span').textContent = isFavorite ? 'Favorited' : 'Favorite';
  }
}

function handleFavoriteToggle(button) {
  if (!favoritesApi) return;
  const author = button.dataset.author;
  const filename = button.dataset.filename;
  favoritesApi.toggleFavorite(author, filename);
  updateFavoriteButton(button, author, filename);
  if (currentAuthor === author && currentFilename === filename) {
    updateFavoriteButton(modalFavorite, author, filename);
  }
}

function syncFavoriteButtons(scope = document) {
  if (!favoritesApi) return;
  scope.querySelectorAll('.favorite-btn').forEach(button => {
    updateFavoriteButton(button, button.dataset.author, button.dataset.filename);
  });
}

function updateModeTabs() {
  document.body.dataset.galleryMode = isFavoritesMode ? 'favorites' : 'all';
  if (allImagesLink) {
    allImagesLink.classList.toggle('is-active', !isFavoritesMode);
  }
  if (favoritesToggleLink) {
    favoritesToggleLink.classList.toggle('is-active', isFavoritesMode);
  }
  if (favoritesCount && favoritesApi) {
    favoritesCount.textContent = String(favoritesApi.loadFavorites().length);
  }
}

function renderEmptyState(container, message) {
  container.innerHTML = '';
  const msg = document.createElement('div');
  msg.className = 'no-results';
  msg.textContent = message;
  container.appendChild(msg);
}

function refreshGalleryData() {
  allImages = isFavoritesMode ? getFavoritedImages() : getRandomizedOrder(masterImages);
  buildAuthorIndex(allImages);
  updateModeTabs();

  const searchBar = document.getElementById('search-bar');
  const query = searchBar ? searchBar.value.trim().toLowerCase() : '';

  if (query) {
    handleSearch(query);
    return;
  }

  isSearchMode = false;
  streamView.style.display = '';
  searchView.style.display = 'none';
  resetGallery();

  if (allImages.length === 0) {
    disableScrollLoading();
    renderEmptyState(galleryRoot, isFavoritesMode ? 'No favorites yet. Heart images in the gallery to save them here.' : 'No images found.');
    return;
  }

  enableScrollLoading();
  loadMoreImages(IMAGES_PER_LOAD);
}

function handleFavoritesChanged() {
  updateModeTabs();
  syncFavoriteButtons(document);
  if (currentAuthor && currentFilename) {
    updateFavoriteButton(modalFavorite, currentAuthor, currentFilename);
  }
  if (isFavoritesMode) {
    refreshGalleryData();
  }
}

// Theme changes — invalidate cached placeholder color
document.addEventListener('themechange', () => {
  cachedPlaceholderBg = '';
  const bg = getPlaceholderBackground();
  const unloadedImages = document.querySelectorAll('.img-thumb[data-loaded="0"], .search-image[data-loaded="0"], .sidebar-thumb[data-loaded="0"]');
  unloadedImages.forEach(img => {
    img.style.background = bg;
  });
});
