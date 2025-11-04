/**
 * Screenshot Gallery System for KindleModShelf
 * Provides lightbox viewing, keyboard navigation, and lazy loading
 */

(function() {
  'use strict';

  // State management
  let currentGallery = null;
  let currentIndex = 0;
  let images = [];

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    createModal();
    attachEventListeners();
    initLazyLoading();
  }

  // Create the modal viewer if it doesn't exist
  function createModal() {
    if (document.getElementById('screenshot-viewer-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'screenshot-viewer-modal';
    modal.innerHTML = `
      <div id="screenshot-viewer-content">
        <div class="screenshot-viewer-topbar">
          <div class="screenshot-viewer-info">
            <h3 id="screenshot-viewer-title">Screenshot</h3>
            <p id="screenshot-viewer-caption"></p>
          </div>
          <div class="screenshot-viewer-actions">
            <button class="viewer-button" id="screenshot-viewer-close" aria-label="Close viewer">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
              Close
            </button>
          </div>
        </div>
        <div class="screenshot-viewer-canvas">
          <button class="screenshot-nav prev" id="screenshot-nav-prev" aria-label="Previous image">‹</button>
          <img id="screenshot-viewer-img" alt="Screenshot" />
          <button class="screenshot-nav next" id="screenshot-nav-next" aria-label="Next image">›</button>
          <div class="viewer-keyboard-hint">Use ← → keys to navigate • ESC to close</div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  // Attach event listeners to screenshot items
  function attachEventListeners() {
    // Handle clicks on screenshot items
    document.addEventListener('click', function(e) {
      const item = e.target.closest('.screenshot-item');
      if (item) {
        e.preventDefault();
        openViewer(item);
      }
    });

    // Modal close button
    document.addEventListener('click', function(e) {
      if (e.target.id === 'screenshot-viewer-close' ||
          e.target.closest('#screenshot-viewer-close')) {
        closeViewer();
      }
    });

    // Click outside to close
    document.addEventListener('click', function(e) {
      if (e.target.id === 'screenshot-viewer-modal') {
        closeViewer();
      }
    });

    // Navigation buttons
    document.addEventListener('click', function(e) {
      if (e.target.id === 'screenshot-nav-prev' ||
          e.target.closest('#screenshot-nav-prev')) {
        navigateGallery(-1);
      }
      if (e.target.id === 'screenshot-nav-next' ||
          e.target.closest('#screenshot-nav-next')) {
        navigateGallery(1);
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
      const modal = document.getElementById('screenshot-viewer-modal');
      if (!modal || !modal.classList.contains('active')) return;

      switch(e.key) {
        case 'Escape':
          closeViewer();
          break;
        case 'ArrowLeft':
          navigateGallery(-1);
          e.preventDefault();
          break;
        case 'ArrowRight':
          navigateGallery(1);
          e.preventDefault();
          break;
      }
    });
  }

  // Open the viewer with the selected image
  function openViewer(item) {
    const modal = document.getElementById('screenshot-viewer-modal');
    const img = item.querySelector('.screenshot-img');
    const caption = item.querySelector('.screenshot-caption');

    if (!modal || !img) return;

    // Get the gallery this item belongs to
    currentGallery = item.closest('.screenshot-gallery');
    if (currentGallery) {
      images = Array.from(currentGallery.querySelectorAll('.screenshot-item'));
      currentIndex = images.indexOf(item);
    } else {
      images = [item];
      currentIndex = 0;
    }

    // Update viewer content
    updateViewer();

    // Show modal
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('active'), 10);

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  }

  // Close the viewer
  function closeViewer() {
    const modal = document.getElementById('screenshot-viewer-modal');
    if (!modal) return;

    modal.classList.remove('active');
    setTimeout(() => {
      modal.style.display = 'none';
    }, 250);

    // Restore body scroll
    document.body.style.overflow = '';

    // Clear state
    currentGallery = null;
    currentIndex = 0;
    images = [];
  }

  // Navigate through gallery
  function navigateGallery(direction) {
    if (images.length === 0) return;

    currentIndex += direction;

    // Wrap around
    if (currentIndex < 0) currentIndex = images.length - 1;
    if (currentIndex >= images.length) currentIndex = 0;

    updateViewer();
  }

  // Update viewer with current image
  function updateViewer() {
    if (!images[currentIndex]) return;

    const item = images[currentIndex];
    const img = item.querySelector('.screenshot-img');
    const caption = item.querySelector('.screenshot-caption');

    const viewerImg = document.getElementById('screenshot-viewer-img');
    const viewerTitle = document.getElementById('screenshot-viewer-title');
    const viewerCaption = document.getElementById('screenshot-viewer-caption');
    const prevBtn = document.getElementById('screenshot-nav-prev');
    const nextBtn = document.getElementById('screenshot-nav-next');

    if (!viewerImg) return;

    // Update image
    const imgSrc = img.dataset.src || img.src;
    viewerImg.src = imgSrc;
    viewerImg.alt = img.alt || 'Screenshot';

    // Update title and caption
    if (caption && caption.textContent.trim()) {
      viewerCaption.textContent = caption.textContent;
      viewerCaption.style.display = 'block';
    } else {
      viewerCaption.style.display = 'none';
    }

    // Update title with counter if multiple images
    if (images.length > 1) {
      viewerTitle.textContent = `Screenshot ${currentIndex + 1} / ${images.length}`;
    } else {
      viewerTitle.textContent = 'Screenshot';
    }

    // Update navigation buttons
    if (prevBtn && nextBtn) {
      if (images.length > 1) {
        prevBtn.style.display = 'flex';
        nextBtn.style.display = 'flex';
        prevBtn.disabled = false;
        nextBtn.disabled = false;
      } else {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
      }
    }
  }

  // Lazy loading for images
  function initLazyLoading() {
    const lazyImages = document.querySelectorAll('.screenshot-img[data-src]');

    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            const img = entry.target;
            loadImage(img);
            observer.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.01
      });

      lazyImages.forEach(function(img) {
        imageObserver.observe(img);
      });
    } else {
      // Fallback for browsers without IntersectionObserver
      lazyImages.forEach(function(img) {
        loadImage(img);
      });
    }
  }

  // Load an image
  function loadImage(img) {
    const src = img.dataset.src;
    if (!src) return;

    img.addEventListener('load', function() {
      img.classList.add('loaded');
    });

    img.src = src;
    img.removeAttribute('data-src');
  }

  // Expose public API if needed
  window.ScreenshotGallery = {
    init: init,
    openViewer: openViewer,
    closeViewer: closeViewer
  };

})();
