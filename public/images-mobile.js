const IMAGES_PER_LOAD = 20;
const PLACEHOLDER_SRC = 'data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=';
const RANDOMIZATION_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours
const RANDOMIZED_ORDER_KEY = 'gallery_randomized_order';
const RANDOMIZATION_TIMESTAMP_KEY = 'gallery_randomization_time';

let allData = null;
let allImages = [];
let loadedCount = 0;
let isLoading = false;
let isSearchMode = false;
let currentModalIndex = -1;

const galleryRoot = document.getElementById('mobile-gallery-root');
const loadingIndicator = document.getElementById('mobile-loading');
const noResults = document.getElementById('mobile-no-results');
const searchInput = document.getElementById('mobile-search');

const modal = document.getElementById('mobile-modal');
const modalImg = document.getElementById('mobile-modal-img');
const modalDownload = document.getElementById('mobile-modal-download');
const modalClose = document.querySelector('.mobile-modal-close');
const modalAuthor = document.getElementById('mobile-modal-author');
const modalFilename = document.getElementById('mobile-modal-filename');
const prevBtn = document.getElementById('mobile-modal-prev');
const nextBtn = document.getElementById('mobile-modal-next');

function shouldRandomizeOrder() {
  const lastRandomTime = localStorage.getItem(RANDOMIZATION_TIMESTAMP_KEY);
  if (!lastRandomTime) return true;
  const timeSinceLastRandom = Date.now() - parseInt(lastRandomTime);
  return timeSinceLastRandom > RANDOMIZATION_INTERVAL;
}

function getRandomizedOrder() {
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

  const randomized = [...allImages].sort(() => Math.random() - 0.5);

  try {
    localStorage.setItem(RANDOMIZED_ORDER_KEY, JSON.stringify(randomized));
    localStorage.setItem(RANDOMIZATION_TIMESTAMP_KEY, Date.now().toString());
  } catch (e) {
    console.warn('Could not save randomized order to localStorage:', e);
  }

  return randomized;
}

function getPlaceholderBackground() {
  return getComputedStyle(document.documentElement).getPropertyValue('--placeholder-bg').trim();
}

fetch('images.json')
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
      galleryRoot.innerHTML = '';
      noResults.style.display = 'block';
      return;
    }

    allImages = getRandomizedOrder();
    loadMoreImages(IMAGES_PER_LOAD);
  })
  .catch(error => {
    console.error('Error loading gallery:', error);
    noResults.textContent = 'Could not load image list.';
    noResults.style.display = 'block';
  });

function loadMoreImages(count) {
  if (isSearchMode || isLoading || loadedCount >= allImages.length) return;

  isLoading = true;
  loadingIndicator.style.display = 'block';

  const endIndex = Math.min(loadedCount + count, allImages.length);
  setTimeout(() => {
    for (let i = loadedCount; i < endIndex; i++) {
      addImageToGallery(allImages[i]);
    }
    loadedCount = endIndex;
    isLoading = false;
    loadingIndicator.style.display = 'none';
  }, 40);
}

function addImageToGallery(imgData) {
  const { author, filename } = imgData;
  const imgFullPath = `images/${author}/${filename}`;

  const item = document.createElement('div');
  item.className = 'mobile-gallery-item';

  const img = document.createElement('img');
  img.alt = filename;
  img.loading = 'lazy';
  img.decoding = 'async';
  img.dataset.author = author;
  img.dataset.filename = filename;
  img.dataset.fullPath = imgFullPath;
  img.src = PLACEHOLDER_SRC;
  img.style.background = getPlaceholderBackground();

  img.addEventListener('click', () => {
    currentModalIndex = allImages.findIndex(img => img.author === author && img.filename === filename);
    openModal(currentModalIndex);
  });

  // Lazy load image
  img.addEventListener('load', () => {
    img.style.background = '';
  }, { once: true });

  item.appendChild(img);
  galleryRoot.appendChild(item);

  // Load image when visible
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !img.src.includes('images/')) {
        img.src = imgFullPath;
      }
    });
  }, { rootMargin: '300px' });
  observer.observe(img);
}

function openModal(index) {
  if (index < 0 || index >= allImages.length) return;

  currentModalIndex = index;
  const imgData = allImages[index];
  const { author, filename } = imgData;
  const src = `images/${author}/${filename}`;

  modalAuthor.textContent = `By ${author}`;
  modalFilename.textContent = filename;
  modalDownload.href = src;
  modalDownload.download = filename;
  modalImg.src = src;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  updateModalButtons();
}

function closeModal() {
  modal.classList.remove('active');
  document.body.style.overflow = '';
  currentModalIndex = -1;
}

function updateModalButtons() {
  prevBtn.disabled = currentModalIndex <= 0;
  nextBtn.disabled = currentModalIndex >= allImages.length - 1;
}

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', e => {
  if (e.target === modal) closeModal();
});

prevBtn.addEventListener('click', () => {
  if (currentModalIndex > 0) {
    openModal(currentModalIndex - 1);
  }
});

nextBtn.addEventListener('click', () => {
  if (currentModalIndex < allImages.length - 1) {
    openModal(currentModalIndex + 1);
  }
});

document.addEventListener('keydown', e => {
  if (!modal.classList.contains('active')) return;
  if (e.key === 'Escape') closeModal();
  if (e.key === 'ArrowLeft') prevBtn.click();
  if (e.key === 'ArrowRight') nextBtn.click();
});

// Search functionality
searchInput.addEventListener('input', e => {
  const query = e.target.value.trim().toLowerCase();

  if (query === '') {
    isSearchMode = false;
    galleryRoot.innerHTML = '';
    noResults.style.display = 'none';
    loadedCount = 0;
    loadMoreImages(IMAGES_PER_LOAD);
    return;
  }

  isSearchMode = true;
  const matches = allImages.filter(img => img.author.toLowerCase().includes(query));

  galleryRoot.innerHTML = '';
  if (matches.length === 0) {
    noResults.style.display = 'block';
    return;
  }

  noResults.style.display = 'none';
  matches.forEach(imgData => addImageToGallery(imgData));
});

// Infinite scroll for mobile
window.addEventListener('scroll', () => {
  if (isSearchMode || isLoading || loadedCount >= allImages.length) return;

  const scrollY = window.scrollY;
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;

  if (scrollY + windowHeight > documentHeight - 500) {
    loadMoreImages(IMAGES_PER_LOAD);
  }
});
