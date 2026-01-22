document.addEventListener('DOMContentLoaded', () => {
  // Determine if we are on the home page
  const path = window.location.pathname;
  const isHome = path.endsWith('index.html') || path.endsWith('/') || path === '/kindlemodshelf.me/';
  
  const container = document.querySelector('.container') || document.body;

  // 1. Inject Back Button (if not home and not already present)
  if (!isHome && !document.querySelector('.back-home-btn')) {
    const backBtn = document.createElement('a');
    backBtn.href = 'index.html';
    backBtn.className = 'back-home-btn';
    backBtn.setAttribute('aria-label', 'Back to Home');
    backBtn.innerHTML = '← Back to Home';
    
    // Prepend to container
    container.prepend(backBtn);
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
  const backToTopBtn = document.createElement('button');
  backToTopBtn.className = 'back-to-top-btn';
  backToTopBtn.setAttribute('aria-label', 'Back to Top');
  // SVG for Up Arrow
  backToTopBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>';
  document.body.appendChild(backToTopBtn);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // 4. Global Search Logic (Clear Button & Shortcut)
  const searchBar = document.getElementById('search-bar');
  const searchClearBtn = document.getElementById('search-clear');

  if (searchBar && searchClearBtn) {
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
