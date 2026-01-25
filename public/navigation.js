document.addEventListener('DOMContentLoaded', () => {
  // Determine if we are on the home page or excluded pages
  const path = window.location.pathname;
  const isHome = path === '/' || path.endsWith('/index.html') || path.endsWith('/kindlemodshelf.me/') || path === '/kindlemodshelf.me';
  const isExcluded = path.endsWith('editor.html') || path.endsWith('pagebuilder.html');
  
  const container = document.querySelector('.container') || document.body;

  // 1. Inject Back Button (if not home, not excluded, and not already present)
  if (!isHome && !isExcluded && !document.querySelector('.back-home-btn')) {
    const backBtn = document.createElement('a');
    backBtn.href = 'index.html';
    backBtn.className = 'back-home-btn';
    backBtn.setAttribute('aria-label', 'Back to Home');
    backBtn.innerHTML = '← Back to Home';
    
    // Prepend to container
    if (container.firstChild) {
      container.insertBefore(backBtn, container.firstChild);
    } else {
      container.appendChild(backBtn);
    }
  }

  // 2. Scroll Logic for Back Button
  const backBtn = document.querySelector('.back-home-btn');
  if (backBtn) {
    const fullText = backBtn.innerHTML;
    // SVG for Left Arrow
    const iconHtml = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>';

    window.addEventListener('scroll', () => {
      const isScrolled = window.scrollY > 100;

      if (isScrolled && !backBtn.classList.contains('scrolled')) {
        backBtn.classList.add('scrolled');
        backBtn.innerHTML = iconHtml;
      } else if (!isScrolled && backBtn.classList.contains('scrolled')) {
        backBtn.classList.remove('scrolled');
        backBtn.innerHTML = fullText;
      }
    }, { passive: true });
  }

  // 3. Back to Top Button
  let backToTopBtn = document.getElementById('backToTop');
  
  // If not in HTML, create it dynamically
  if (!backToTopBtn) {
    backToTopBtn = document.createElement('button');
    backToTopBtn.id = 'backToTop';
    backToTopBtn.className = 'back-to-top-btn';
    backToTopBtn.setAttribute('aria-label', 'Back to Top');
    backToTopBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>';
    document.body.appendChild(backToTopBtn);
  }

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('visible');
      backToTopBtn.style.display = 'flex'; // Ensure display is flex when visible
    } else {
      backToTopBtn.classList.remove('visible');
      backToTopBtn.style.display = 'none'; // Hide when not visible
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // 4. Reading Progress Bar
  const progressBar = document.createElement('div');
  progressBar.className = 'reading-progress-bar';
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + "%";
  }, { passive: true });

  // 5. Global Search Logic (Clear Button & Shortcut)
  const searchBar = document.getElementById('search-bar');
  const searchClearBtn = document.getElementById('search-clear');

  if (searchBar) {
    // Add keyboard shortcut hint to placeholder
    if (!searchBar.placeholder.includes('/')) {
      searchBar.placeholder += ' (Press / to search)';
    }
    
    if (searchClearBtn) {
    // Toggle button visibility based on input
    const toggleClear = () => {
      searchClearBtn.style.display = searchBar.value.trim() ? 'flex' : 'none';
    };
    
    searchBar.addEventListener('input', toggleClear);
    
    // Initial check
    toggleClear();

    // Clear search handler
    searchClearBtn.addEventListener('click', () => {
      searchBar.value = '';
      searchBar.focus();
      toggleClear();
      // Trigger input event to notify listeners (main.js, images-gallery.js, or inline scripts)
      searchBar.dispatchEvent(new Event('input'));
    });
  }
  }

  // Global Keyboard Shortcut '/'
  document.addEventListener('keydown', (e) => {
    // Focus search on '/' if not already in an input/textarea
    if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      e.preventDefault();
      const sb = document.getElementById('search-bar'); // Re-query in case it wasn't there at load (unlikely but safe)
      if (sb) {
        sb.focus();
      }
    }
  });
});
