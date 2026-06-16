// Theme toggle — runs before DOM renders to prevent flash of wrong theme
(function () {
  'use strict';

  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

  function getTheme() {
    try { return localStorage.getItem('theme') || 'dark'; } catch { return 'dark'; }
  }

  function applyTheme(theme, save) {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    if (save) {
      try { localStorage.setItem('theme', theme); } catch {}
    }
    document.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    applyTheme(current === 'dark' ? 'light' : 'dark', true);
  }

  // Apply immediately to prevent FOUC
  applyTheme(getTheme(), false);

  function buildButton() {
    if (document.querySelector('.theme-toggle[data-ready]')) return;
    const btn = document.createElement('button');
    btn.className = 'theme-toggle';
    btn.setAttribute('data-ready', '1');
    btn.setAttribute('aria-label', 'Toggle theme');
    btn.setAttribute('title', 'Toggle theme');
    btn.innerHTML = `
      <span class="theme-icon sun" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="4"/>
          <path d="M12 2v2m0 16v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M2 12h2m16 0h2M4.22 19.78l1.42-1.42m12.72-12.72l1.42-1.42"/>
        </svg>
      </span>
      <span class="theme-icon moon" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      </span>`;
    btn.addEventListener('click', toggleTheme);
    document.body.appendChild(btn);

    // Shrink on scroll
    let scrolled = false;
    window.addEventListener('scroll', () => {
      const should = (window.scrollY || document.documentElement.scrollTop) > 100;
      if (should !== scrolled) { btn.classList.toggle('scrolled', should); scrolled = should; }
    }, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildButton);
  } else {
    buildButton();
  }

  // Sync with OS preference if no manual override
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', e => {
      try { if (!localStorage.getItem('theme')) applyTheme(e.matches ? 'light' : 'dark', false); } catch {}
    });
  }
})();
