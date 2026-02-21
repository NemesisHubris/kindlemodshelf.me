document.addEventListener('DOMContentLoaded', () => {
  // Determine if we are on the home page or excluded pages
  const path = window.location.pathname;
  const isHome = path === '/' || path.endsWith('/index.html') || path.endsWith('/kindlemodshelf.me/') || path === '/kindlemodshelf.me';
  const isEditorPage = path.endsWith('editor.html');
  const isPageBuilder = path.endsWith('pagebuilder.html');
  const isExcluded = isEditorPage || isPageBuilder;
  const isBackButtonExcluded = isEditorPage;
  
  const container = document.querySelector('.container') || document.body;

  // 1. Inject Back Button (if not home, not excluded, and not already present)
  if (!isHome && !isBackButtonExcluded && !document.querySelector('.back-home-btn')) {
    const backBtn = document.createElement('a');
    backBtn.href = 'index.html';
    backBtn.className = 'back-home-btn';
    backBtn.setAttribute('aria-label', 'Back');
    backBtn.innerHTML = '← Back';

    backBtn.addEventListener('click', (e) => {
      const sameOriginReferrer = document.referrer && document.referrer.startsWith(window.location.origin);
      if (sameOriginReferrer && window.history.length > 1) {
        e.preventDefault();
        window.history.back();
      }
    });
    
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
    backBtn.setAttribute('aria-label', 'Back');
    const fullText = '← Back';
    const compactText = '←';
    if (!backBtn.dataset.lockedText) {
      backBtn.innerHTML = fullText;
    }

    window.addEventListener('scroll', () => {
      const isScrolled = window.scrollY > 100;
      const hadScrolled = backBtn.classList.contains('scrolled');
      backBtn.classList.toggle('scrolled', isScrolled);

      if (isScrolled && !hadScrolled) {
        backBtn.innerHTML = compactText;
      } else if (!isScrolled && hadScrolled) {
        backBtn.innerHTML = fullText;
      }
    }, { passive: true });
  }

  // 3. Back to Top Button (skip on excluded pages like editor/pagebuilder)
  if (!isExcluded) {
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
    backToTopBtn.style.display = 'none';

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // 4. Reading Progress Bar
    let progressBar = document.querySelector('.reading-progress-bar');
    if (!progressBar) {
      progressBar = document.createElement('div');
      progressBar.className = 'reading-progress-bar';
      document.body.appendChild(progressBar);
    }

    const handleGlobalScroll = () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add('visible');
        backToTopBtn.style.display = 'flex';
      } else {
        backToTopBtn.classList.remove('visible');
        backToTopBtn.style.display = 'none';
      }

      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      progressBar.style.width = scrolled + '%';
    };

    window.addEventListener('scroll', handleGlobalScroll, { passive: true });
    handleGlobalScroll();
  }

  // 5. Global Search Logic (Clear Button & Shortcut)
  const searchBar = document.getElementById('search-bar');
  const searchClearBtn = document.getElementById('search-clear');

  if (searchBar) {
    // Add keyboard shortcut hint to placeholder
    if (!searchBar.placeholder.includes('Press / to search')) {
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
    if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey || e.defaultPrevented) return;

    const active = document.activeElement;
    const isTypingField = active && (
      active.tagName === 'INPUT' ||
      active.tagName === 'TEXTAREA' ||
      active.tagName === 'SELECT' ||
      active.isContentEditable
    );
    if (isTypingField) return;

    const sb = document.getElementById('search-bar');
    if (!sb) return;

    e.preventDefault();
    sb.focus();
  });
});
