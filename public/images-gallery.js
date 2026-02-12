const IMAGES_PER_LOAD = 30;
const PLACEHOLDER_SRC = 'data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=';
const RANDOMIZATION_INTERVAL = 24 * 60 * 60 * 1000;
const RANDOMIZED_ORDER_KEY = 'gallery_randomized_order';
const RANDOMIZATION_TIMESTAMP_KEY = 'gallery_randomization_time';
const SEARCH_DEBOUNCE_MS = 150;

// Concurrency control — limit simultaneous image downloads
const MAX_CONCURRENT_LOADS = 4;
let activeLoads = 0;
const loadQueue = [];

let allData = null;
let allImages = [];
let authorIndex = {};
let loadedCount = 0;
let isLoading = false;
let isSearchMode = false;
let cachedPlaceholderBg = '';
let searchDebounceTimer = null;

const galleryRoot = document.getElementById('gallery-root');
const loadingIndicator = document.getElementById('loading-indicator');
const streamView = document.getElementById('stream-view');
const searchView = document.getElementById('search-view');
const searchResults = document.getElementById('search-results');

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

function getRandomizedOrder() {
  if (!shouldRandomizeOrder()) {
    let cached = null;
    try { cached = localStorage.getItem(RANDOMIZED_ORDER_KEY); } catch(e) {}
    if (cached) {
      try {
        const indices = JSON.parse(cached);
        if (Array.isArray(indices) && indices.length === allImages.length) {
          return indices.map(i => allImages[i]);
        }
      } catch (e) {
        console.warn('Could not parse cached randomized order');
      }
    }
  }

  const indices = Array.from({ length: allImages.length }, (_, i) => i);
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

  return indices.map(i => allImages[i]);
}

function buildAuthorIndex() {
  authorIndex = {};
  for (let i = 0; i < allImages.length; i++) {
    const img = allImages[i];
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
          allImages.push({ author, filename });
        });
      }
    });

    if (allImages.length === 0) {
      galleryRoot.textContent = 'No images found.';
      return;
    }

    allImages = getRandomizedOrder();
    buildAuthorIndex();
    enableScrollLoading();
    loadMoreImages(IMAGES_PER_LOAD);

    const searchBar = document.getElementById('search-bar');
    searchBar.addEventListener('input', handleSearchInput);
  })
  .catch(error => {
    console.error('Error loading gallery:', error);
    galleryRoot.textContent = 'Could not load image list. Please contact the site owner.';
  });

// Event delegation for image clicks
document.addEventListener('click', function(event) {
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
    const msg = document.createElement('div');
    msg.className = 'no-results';
    msg.textContent = 'No authors match your search.';
    searchResults.appendChild(msg);
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
      img.dataset.fullPath = `images/${author}/${imgData.filename}`;
      img.dataset.author = author;
      img.dataset.filename = imgData.filename;
      img.src = PLACEHOLDER_SRC;
      img.style.background = bg;

      imgWrapper.appendChild(img);
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
  img.dataset.fullPath = `images/${author}/${filename}`;
  img.dataset.author = author;
  img.dataset.filename = filename;
  img.src = PLACEHOLDER_SRC;
  img.style.background = bg;

  cell.appendChild(img);
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

let currentAuthor = null;
let closeViewerTimer = null;

function openViewer(thumbnail) {
  if (closeViewerTimer) {
    clearTimeout(closeViewerTimer);
    closeViewerTimer = null;
  }

  const author = thumbnail.dataset.author;
  const filename = thumbnail.dataset.filename;
  currentAuthor = author;

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
  const authorImages = authorIndex[author] || [];
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
    sidebarThumb.dataset.fullPath = `images/${author}/${imgData.filename}`;
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

// Theme changes — invalidate cached placeholder color
document.addEventListener('themechange', () => {
  cachedPlaceholderBg = '';
  const bg = getPlaceholderBackground();
  const unloadedImages = document.querySelectorAll('.img-thumb[data-loaded="0"], .search-image[data-loaded="0"], .sidebar-thumb[data-loaded="0"]');
  unloadedImages.forEach(img => {
    img.style.background = bg;
  });
});
