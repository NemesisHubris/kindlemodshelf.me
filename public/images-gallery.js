const IMAGES_PER_LOAD = 30;
const THUMBNAIL_WIDTH = 400;
const THUMBNAIL_HEIGHT = 533;
const THUMBNAIL_QUALITY = 0.82;
const PLACEHOLDER_SRC = 'data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=';
const CANVAS_BACKGROUND = '#081524';
const RANDOMIZATION_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const RANDOMIZED_ORDER_KEY = 'gallery_randomized_order';
const RANDOMIZATION_TIMESTAMP_KEY = 'gallery_randomization_time';

let allData = null;
let allImages = []; // Flat list of all {author, filename} objects
let loadedCount = 0;
let isLoading = false;
let isSearchMode = false;

const thumbnailCache = new Map();

const galleryRoot = document.getElementById('gallery-root');
const loadingIndicator = document.getElementById('loading-indicator');
const streamView = document.getElementById('stream-view');
const searchView = document.getElementById('search-view');
const searchResults = document.getElementById('search-results');
const thumbnailCanvas = document.getElementById('thumbnail-canvas');
const thumbnailCtx = thumbnailCanvas.getContext('2d');

const imageObserver = new IntersectionObserver(handleImageIntersection, {
  root: null,
  rootMargin: '600px 0px 600px 0px',
  threshold: 0.1
});

let scrollEnabled = false;

function getPlaceholderBackground() {
  return getComputedStyle(document.documentElement).getPropertyValue('--placeholder-bg').trim();
}

function shouldRandomizeOrder() {
  const lastRandomTime = localStorage.getItem(RANDOMIZATION_TIMESTAMP_KEY);
  if (!lastRandomTime) return true;

  const timeSinceLastRandom = Date.now() - parseInt(lastRandomTime);
  return timeSinceLastRandom > RANDOMIZATION_INTERVAL;
}

function getRandomizedOrder() {
  // Check if we should use cached randomized order
  if (!shouldRandomizeOrder()) {
    const cached = localStorage.getItem(RANDOMIZED_ORDER_KEY);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        console.warn('Could not parse cached randomized order');
      }
    }
  }

  // Create new randomized order
  const randomized = [...allImages].sort(() => Math.random() - 0.5);

  // Save to localStorage
  try {
    localStorage.setItem(RANDOMIZED_ORDER_KEY, JSON.stringify(randomized));
    localStorage.setItem(RANDOMIZATION_TIMESTAMP_KEY, Date.now().toString());
  } catch (e) {
    console.warn('Could not save randomized order to localStorage:', e);
  }

  return randomized;
}

fetch('images.json')
  .then(res => {
    if (!res.ok) throw new Error('Could not load images.json');
    return res.json();
  })
  .then(data => {
    allData = data;

    // Flatten all images into a single array with author info
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

    // Randomize the order
    allImages = getRandomizedOrder();

    enableScrollLoading();
    loadMoreImages(IMAGES_PER_LOAD);

    const searchBar = document.getElementById('search-bar');
    searchBar.addEventListener('input', handleSearch);
  })
  .catch(error => {
    console.error('Error loading gallery:', error);
    galleryRoot.textContent = 'Could not load image list. Please contact the site owner.';
  });

function handleSearch(event) {
  const query = event.target.value.trim().toLowerCase();

  if (query === '') {
    // Show stream view, hide search view
    isSearchMode = false;
    streamView.style.display = '';
    searchView.style.display = 'none';
    enableScrollLoading();
    loadedCount = 0;
    resetGallery();
    loadMoreImages(IMAGES_PER_LOAD);
    return;
  }

  // Show search view, hide stream view
  isSearchMode = true;
  streamView.style.display = 'none';
  searchView.style.display = '';
  disableScrollLoading();

  const matches = allImages.filter(img => img.author.toLowerCase().includes(query));

  searchResults.innerHTML = '';

  if (matches.length === 0) {
    const msg = document.createElement('div');
    msg.className = 'no-results';
    msg.textContent = 'No authors match your search.';
    searchResults.appendChild(msg);
    return;
  }

  // Group images by author for search results
  const authorGroups = {};
  matches.forEach(imgData => {
    if (!authorGroups[imgData.author]) {
      authorGroups[imgData.author] = [];
    }
    authorGroups[imgData.author].push(imgData);
  });

  // Display search results with author headers - COMPLETELY SEPARATE LAYOUT
  Object.keys(authorGroups).sort().forEach(author => {
    // Author header
    const authorHeader = document.createElement('div');
    authorHeader.className = 'search-author-header';
    authorHeader.textContent = author;
    searchResults.appendChild(authorHeader);

    // Author's images grid
    const imagesGrid = document.createElement('div');
    imagesGrid.className = 'search-images-grid';

    authorGroups[author].forEach(imgData => {
      const imgWrapper = document.createElement('div');
      imgWrapper.className = 'search-image-card';

      const img = document.createElement('img');
      img.className = 'search-image';
      img.alt = imgData.filename;
      img.loading = 'lazy';
      img.decoding = 'async';
      img.dataset.loaded = '0';
      img.dataset.loading = '0';
      img.dataset.fullPath = `images/${author}/${imgData.filename}`;
      img.dataset.author = author;
      img.dataset.filename = imgData.filename;
      img.src = PLACEHOLDER_SRC;
      img.style.background = getPlaceholderBackground();

      img.addEventListener('click', function () {
        if (this.dataset.loaded !== '1') {
          loadImage(this);
        }
        openViewer(this);
      });

      imgWrapper.appendChild(img);
      imagesGrid.appendChild(imgWrapper);
      imageObserver.observe(img);
    });

    searchResults.appendChild(imagesGrid);
  });
}

function handleScroll() {
  if (isSearchMode || isLoading || loadedCount >= allImages.length) return;
  const scrollY = window.scrollY;
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  if (scrollY + windowHeight > documentHeight - 200) {
    loadMoreImages(IMAGES_PER_LOAD);
  }
}

function loadMoreImages(count) {
  if (isSearchMode || isLoading || loadedCount >= allImages.length) return;

  isLoading = true;
  loadingIndicator.style.display = 'block';

  const endIndex = Math.min(loadedCount + count, allImages.length);
  setTimeout(() => {
    for (let i = loadedCount; i < endIndex; i++) {
      addImageToStream(allImages[i]);
    }
    loadedCount = endIndex;
    isLoading = false;
    loadingIndicator.style.display = 'none';
    if (loadedCount >= allImages.length) {
      disableScrollLoading();
    }
  }, 40);
}

function addImageToStream(imgData) {
  const { author, filename } = imgData;
  const imgFullPath = `images/${author}/${filename}`;

  const cell = document.createElement('div');
  cell.className = 'img-thumb-wrap';

  const img = document.createElement('img');
  img.className = 'img-thumb';
  img.alt = '';
  img.loading = 'lazy';
  img.decoding = 'async';
  img.dataset.loaded = '0';
  img.dataset.loading = '0';
  img.dataset.fullPath = imgFullPath;
  img.dataset.author = author;
  img.dataset.filename = filename;
  img.src = PLACEHOLDER_SRC;
  img.style.background = getPlaceholderBackground();

  img.addEventListener('click', function () {
    if (this.dataset.loaded !== '1') {
      loadImage(this);
    }
    openViewer(this);
  });

  cell.appendChild(img);
  galleryRoot.appendChild(cell);
  imageObserver.observe(img);
}

function createThumbnail(imgPath, callback) {
  if (thumbnailCache.has(imgPath)) {
    callback(thumbnailCache.get(imgPath));
    return;
  }

  const originalImg = new Image();
  originalImg.crossOrigin = 'anonymous';

  originalImg.onload = function () {
    thumbnailCanvas.width = THUMBNAIL_WIDTH;
    thumbnailCanvas.height = THUMBNAIL_HEIGHT;
    thumbnailCtx.imageSmoothingEnabled = true;
    thumbnailCtx.imageSmoothingQuality = 'high';

    thumbnailCtx.fillStyle = CANVAS_BACKGROUND;
    thumbnailCtx.fillRect(0, 0, THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT);

    const aspectRatio = originalImg.width / originalImg.height;
    let drawWidth = THUMBNAIL_WIDTH;
    let drawHeight = THUMBNAIL_WIDTH / aspectRatio;

    if (drawHeight > THUMBNAIL_HEIGHT) {
      drawHeight = THUMBNAIL_HEIGHT;
      drawWidth = THUMBNAIL_HEIGHT * aspectRatio;
    }

    const x = (THUMBNAIL_WIDTH - drawWidth) / 2;
    const y = (THUMBNAIL_HEIGHT - drawHeight) / 2;

    thumbnailCtx.drawImage(originalImg, x, y, drawWidth, drawHeight);

    try {
      const thumbnailUrl = thumbnailCanvas.toDataURL('image/jpeg', THUMBNAIL_QUALITY);
      thumbnailCache.set(imgPath, thumbnailUrl);
      if (thumbnailCache.size > 60) {
        const oldestKey = thumbnailCache.keys().next().value;
        thumbnailCache.delete(oldestKey);
      }
      callback(thumbnailUrl);
    } catch (e) {
      console.warn('Could not generate thumbnail for', imgPath, e);
      callback(imgPath);
    }
  };

  originalImg.onerror = function () {
    console.warn('Could not load image:', imgPath);
    callback(imgPath);
  };

  originalImg.src = imgPath;
}

function loadImage(img) {
  if (img.dataset.loaded === '1' || img.dataset.loading === '1') return;
  img.dataset.loading = '1';
  const imgPath = img.dataset.fullPath;

  const applyThumbnail = thumbnailUrl => {
    if (!img.isConnected || img.dataset.loading !== '1') return;
    img.src = thumbnailUrl;
    img.dataset.loaded = '1';
    img.dataset.loading = '0';
    img.classList.add('loaded');
  };

  if (thumbnailCache.has(imgPath)) {
    applyThumbnail(thumbnailCache.get(imgPath));
    return;
  }

  createThumbnail(imgPath, applyThumbnail);
}

function unloadImage(img) {
  if (img.dataset.loaded !== '1') return;
  img.dataset.loaded = '0';
  img.dataset.loading = '0';
  img.src = PLACEHOLDER_SRC;
  img.classList.remove('loaded');
}

function handleImageIntersection(entries) {
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  entries.forEach(entry => {
    const img = entry.target;
    if (entry.isIntersecting) {
      loadImage(img);
      return;
    }

    const rect = entry.boundingClientRect;
    const aboveThreshold = rect.bottom < -1400;
    const belowThreshold = rect.top > viewportHeight + 1400;

    if (aboveThreshold || belowThreshold) {
      unloadImage(img);
    }
  });
}

function resetGallery() {
  const thumbs = galleryRoot.querySelectorAll('.img-thumb');
  thumbs.forEach(img => imageObserver.unobserve(img));
  galleryRoot.innerHTML = '';
  loadedCount = 0;
  isLoading = false;
}

function enableScrollLoading() {
  if (scrollEnabled) return;
  window.addEventListener('scroll', handleScroll);
  scrollEnabled = true;
}

function disableScrollLoading() {
  if (!scrollEnabled) return;
  window.removeEventListener('scroll', handleScroll);
  scrollEnabled = false;
}

// Modal Viewer
const modal = document.getElementById('img-viewer-modal');
const modalImg = document.getElementById('img-viewer-img');
const modalDownload = document.getElementById('img-viewer-download');
const modalClose = document.getElementById('img-viewer-close');
const modalAuthor = document.getElementById('img-viewer-author');
const modalFilename = document.getElementById('img-viewer-filename');
const modalLoader = document.getElementById('img-viewer-loader');
const sidebarImages = document.getElementById('sidebar-images');

let currentAuthor = null;
let currentImageIndex = null;

function openViewer(thumbnail) {
  const author = thumbnail.dataset.author;
  const filename = thumbnail.dataset.filename;

  currentAuthor = author;
  currentImageIndex = allImages.findIndex(img => img.author === author && img.filename === filename);

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

  // Load sidebar images for this author
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
  const authorImages = allImages.filter(img => img.author === author);
  sidebarImages.innerHTML = '';

  authorImages.forEach(imgData => {
    const sidebarItem = document.createElement('div');
    sidebarItem.className = 'sidebar-image-item';
    sidebarItem.title = imgData.filename;

    const sidebarThumb = document.createElement('img');
    sidebarThumb.className = 'sidebar-thumb';
    sidebarThumb.alt = imgData.filename;
    sidebarThumb.dataset.fullPath = `images/${author}/${imgData.filename}`;
    sidebarThumb.dataset.author = author;
    sidebarThumb.dataset.filename = imgData.filename;
    sidebarThumb.src = PLACEHOLDER_SRC;
    sidebarThumb.style.background = getPlaceholderBackground();

    // Check if this is the currently viewed image
    if (imgData.filename === modalFilename.textContent) {
      sidebarItem.classList.add('active');
      // Scroll into view
      setTimeout(() => {
        sidebarItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }

    sidebarThumb.addEventListener('click', () => {
      openViewer(sidebarThumb);
    });

    sidebarItem.appendChild(sidebarThumb);
    sidebarImages.appendChild(sidebarItem);
    imageObserver.observe(sidebarThumb);
  });
}

function closeViewer() {
  modal.classList.remove('active');
  setTimeout(() => {
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
