// Theme Toggle Functionality
(function() {
  'use strict';

  // Get the current theme from localStorage or default to dark
  function getInitialTheme() {
    const savedTheme = localStorage.getItem('theme');
    return {
      theme: savedTheme || 'dark',
      persist: Boolean(savedTheme)
    };
  }

  // Apply theme to the document
  function applyTheme(theme, persist = true) {
    const root = document.documentElement;
    if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
    } else {
      root.removeAttribute('data-theme');
    }
    if (persist) {
      localStorage.setItem('theme', theme);
    } else {
      localStorage.removeItem('theme');
    }
  }

  // Toggle between themes
  function toggleTheme() {
    const root = document.documentElement;
    const currentTheme = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
  }

  // Initialize theme on page load
  function initTheme() {
    const { theme, persist } = getInitialTheme();
    applyTheme(theme, persist);
  }

  // Setup theme toggle button (either existing or create new one)
  function setupToggleButton() {
    // Check if button already exists in HTML
    const existingButton = document.querySelector('.theme-toggle');

    if (existingButton) {
      // Mark as initialized to prevent duplicate handlers
      existingButton.setAttribute('data-theme-initialized', 'true');
      // Attach click handler to existing button
      existingButton.addEventListener('click', toggleTheme);
      return;
    }

    // Create button if it doesn't exist
    const button = document.createElement('button');
    button.className = 'theme-toggle';
    button.setAttribute('aria-label', 'Toggle theme');
    button.setAttribute('title', 'Toggle theme');

    // Create circle icon (shows in dark mode - white circle)
    const starIcon = document.createElement('span');
    starIcon.className = 'theme-icon sun';
    starIcon.setAttribute('aria-hidden', 'true');
    starIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="8"></circle></svg>';

    // Create circle icon (shows in light mode - black circle)
    const moonIcon = document.createElement('span');
    moonIcon.className = 'theme-icon moon';
    moonIcon.setAttribute('aria-hidden', 'true');
    moonIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="8"></circle></svg>';

    button.appendChild(starIcon);
    button.appendChild(moonIcon);

    button.addEventListener('click', toggleTheme);

    document.body.appendChild(button);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      initTheme();
      setupToggleButton();
    });
  } else {
    initTheme();
    setupToggleButton();
  }

  // Listen for system theme changes
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', function(e) {
      // Only apply if user hasn't manually set a theme
      if (!localStorage.getItem('theme')) {
        applyTheme(e.matches ? 'light' : 'dark', false);
      }
    });
  }
})();
