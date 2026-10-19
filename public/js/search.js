// Homepage search + category filter logic

(function () {
  'use strict';

  // ── Announcement banner ──────────────────────────────────────────────────
  const banner = document.querySelector('.top-announcement');
  const bannerClose = document.querySelector('.top-announcement__close');

  if (banner) {
    try { if (localStorage.getItem('hideTopAnnouncement') === '1') banner.style.display = 'none'; } catch {}
  }
  if (banner && bannerClose) {
    bannerClose.addEventListener('click', () => {
      banner.style.display = 'none';
      try { localStorage.setItem('hideTopAnnouncement', '1'); } catch {}
    });
  }

  // ── Settings modal ───────────────────────────────────────────────────────
  const settingsModal = document.getElementById('settingsModal');
  const settingsClose = document.getElementById('settingsModalClose');
  const settingsWheel = document.getElementById('settingsWheel');

  function openSettings() { settingsModal?.classList.add('active'); }
  function closeSettings() { settingsModal?.classList.remove('active'); }

  settingsWheel?.addEventListener('click', openSettings);
  settingsClose?.addEventListener('click', closeSettings);
  settingsModal?.addEventListener('click', e => { if (e.target === settingsModal) closeSettings(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSettings(); });

  // Warning banner toggle
  const warningToggle = document.getElementById('warningBannerToggle');
  if (warningToggle && banner) {
    try {
      warningToggle.checked = localStorage.getItem('hideTopAnnouncement') !== '1';
    } catch { warningToggle.checked = true; }
    warningToggle.addEventListener('change', () => {
      if (warningToggle.checked) {
        banner.style.display = '';
        try { localStorage.removeItem('hideTopAnnouncement'); } catch {}
      } else {
        banner.style.display = 'none';
        try { localStorage.setItem('hideTopAnnouncement', '1'); } catch {}
      }
    });
  }

  // ── Collapsible filter chips ─────────────────────────────────────────────
  const filterToggleBtn = document.getElementById('filterToggleBtn');
  const filterChipsWrapper = document.getElementById('filterChipsWrapper');

  filterToggleBtn?.addEventListener('click', () => {
    const expanded = filterToggleBtn.classList.toggle('expanded');
    filterChipsWrapper?.classList.toggle('expanded', expanded);
    filterToggleBtn.setAttribute('aria-expanded', String(expanded));
  });

  // ── Cards ────────────────────────────────────────────────────────────────
  // Each card carries data-category (its section) and data-tags (search keywords).
  const cards = Array.from(document.querySelectorAll('.card'));
  const sectionTitles = Array.from(document.querySelectorAll('.section-title'));

  // Lowercase words with punctuation stripped, so "Game Boy" and "game-boy" both work.
  const words = text => (text.toLowerCase().match(/[a-z0-9]+/g) || []);

  cards.forEach(card => {
    const title = card.querySelector('.card-title')?.textContent || '';
    const desc  = card.querySelector('.card-desc')?.textContent || '';
    const types = Array.from(card.querySelectorAll('.card-tags .tag')).map(t => t.textContent).join(' ');
    card._category = card.getAttribute('data-category') || '';
    card._titleWords = words(title);
    card._words = words([title, types, desc, card.getAttribute('data-tags') || ''].join(' '));
  });

  // Every search word must match the start of a word on the card ("emul" finds "emulator").
  function matchesSearch(card, tokens) {
    return tokens.every(t => card._words.some(w => w.startsWith(t)));
  }

  // ── Collapsible sections ─────────────────────────────────────────────────
  // Each section title gets a chevron. Click it to hide that section's cards and keep only the title.
  const COLLAPSE_KEY = 'kmsCollapsedSections';
  let collapsed = new Set();
  try { collapsed = new Set(JSON.parse(localStorage.getItem(COLLAPSE_KEY) || '[]')); } catch {}

  function saveCollapsed() {
    try { localStorage.setItem(COLLAPSE_KEY, JSON.stringify([...collapsed])); } catch {}
  }

  sectionTitles.forEach(title => {
    const grid = title.nextElementSibling;
    const slug = title.getAttribute('data-category');
    if (!grid || !slug) return;
    const name = title.textContent.trim();
    grid.id = grid.id || 'grid-' + slug;
    title.classList.add('section-title--collapsible');

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'section-toggle';
    btn.setAttribute('aria-controls', grid.id);
    btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>';
    title.prepend(btn);

    const toggle = () => {
      if (collapsed.has(slug)) collapsed.delete(slug); else collapsed.add(slug);
      saveCollapsed();
      render();
    };
    btn.addEventListener('click', e => { e.stopPropagation(); toggle(); });
    title.addEventListener('click', e => { if (!e.target.closest('a')) toggle(); });
  });

  function applyCollapsed(forceOpen) {
    sectionTitles.forEach(title => {
      const grid = title.nextElementSibling;
      const slug = title.getAttribute('data-category');
      const btn = title.querySelector('.section-toggle');
      if (!grid || !btn) return;
      const isCollapsed = collapsed.has(slug) && !forceOpen;
      grid.classList.toggle('is-collapsed', isCollapsed);
      title.classList.toggle('is-collapsed', collapsed.has(slug));
      btn.setAttribute('aria-expanded', String(!isCollapsed));
      btn.setAttribute('aria-label', (isCollapsed ? 'Expand ' : 'Collapse ') + title.textContent.trim());
    });
  }

  // ── State ────────────────────────────────────────────────────────────────
  const searchBar      = document.getElementById('search-bar');
  const searchClear    = document.getElementById('search-clear');
  const filterNote     = document.getElementById('filterNote');
  const chipBtns       = Array.from(document.querySelectorAll('#categoryFilters .filter-chip'));

  let activeCategories = new Set(['all']);
  let searchQuery      = '';
  let searchTokens     = [];

  function syncChipUI() {
    chipBtns.forEach(b => {
      b.classList.toggle('active', activeCategories.has(b.dataset.category));
    });
  }

  // ── Render ───────────────────────────────────────────────────────────────
  function render() {
    const showAll = activeCategories.has('all');
    let visibleCount = 0;

    cards.forEach(card => {
      const categoryMatch = showAll || activeCategories.has(card._category);
      const searchMatch  = !searchTokens.length || matchesSearch(card, searchTokens);
      const show         = categoryMatch && searchMatch;
      card.style.display = show ? '' : 'none';
      if (show) visibleCount++;
    });

    // Show/hide section titles based on whether their grid has any visible cards
    sectionTitles.forEach(title => {
      const grid = title.nextElementSibling;
      if (!grid) return;
      const hasVisible = Array.from(grid.querySelectorAll('.card')).some(c => c.style.display !== 'none');
      title.style.display = hasVisible ? '' : 'none';
      grid.style.display  = hasVisible ? '' : 'none';
    });

    applyCollapsed(!showAll || searchTokens.length > 0);

    // Filter note
    if (filterNote) {
      const filtering = !showAll || searchTokens.length;
      if (filtering) {
        const catCount = showAll ? 0 : activeCategories.size;
        const label = searchQuery
          ? `Found ${visibleCount} result${visibleCount !== 1 ? 's' : ''} for "${searchQuery}"`
          : `Showing ${visibleCount} result${visibleCount !== 1 ? 's' : ''} across ${catCount} categor${catCount !== 1 ? 'ies' : 'y'}`;
        filterNote.textContent = label + '.';
      } else {
        filterNote.textContent = '';
      }
    }
  }

  // ── Category chip clicks ─────────────────────────────────────────────────
  chipBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.dataset.category || 'all';

      if (cat === 'all') {
        // All clears everything else
        activeCategories = new Set(['all']);
      } else {
        activeCategories.delete('all');
        if (activeCategories.has(cat)) {
          activeCategories.delete(cat);
        } else {
          activeCategories.add(cat);
        }
        // If nothing selected, revert to All
        if (activeCategories.size === 0) activeCategories.add('all');
      }

      syncChipUI();
      render();
    });
  });

  // ── Search input ─────────────────────────────────────────────────────────
  searchBar?.addEventListener('input', () => {
    searchQuery = searchBar.value.trim();
    searchTokens = words(searchQuery);
    if (searchClear) searchClear.style.display = searchQuery ? '' : 'none';
    render();
  });

  searchClear?.addEventListener('click', () => {
    if (searchBar) searchBar.value = '';
    searchQuery = '';
    searchTokens = [];
    searchClear.style.display = 'none';
    render();
  });

  // In-page links (e.g. the Guides card): clear any filter or search first so the target is visible.
  document.querySelectorAll('.card-links a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      collapsed.delete(target.getAttribute('data-category'));
      saveCollapsed();
      activeCategories = new Set(['all']);
      searchQuery = '';
      searchTokens = [];
      if (searchBar) searchBar.value = '';
      if (searchClear) searchClear.style.display = 'none';
      syncChipUI();
      render();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Initial render
  render();

  // ── Return to the card you came from ─────────────────────────────────────
  // Remember which card opened a page on this site, and bring it back into view on return.
  document.addEventListener('click', e => {
    const link = e.target.closest('.card-links a');
    if (!link || link.target === '_blank' || link.hasAttribute('download')) return;
    if ((link.getAttribute('href') || '').startsWith('#')) return;
    const title = link.closest('.card')?.querySelector('.card-title')?.textContent;
    try { if (title) sessionStorage.setItem('kmsReturnCard', title); } catch {}
  });

  (function restoreCard() {
    let title = null, returning = false;
    try {
      const nav = performance.getEntriesByType('navigation')[0];
      returning = !!nav && nav.type === 'back_forward';
    } catch {}
    try {
      if (sessionStorage.getItem('kmsReturn') === '1') returning = true;
      title = sessionStorage.getItem('kmsReturnCard');
      sessionStorage.removeItem('kmsReturn');
    } catch {}
    if (!returning || !title) return;
    const card = cards.find(c => c.querySelector('.card-title')?.textContent === title);
    if (!card) return;
    const slug = card.getAttribute('data-category');
    if (collapsed.has(slug)) { collapsed.delete(slug); saveCollapsed(); render(); }
    const r = card.getBoundingClientRect();
    if (r.top < 0 || r.bottom > window.innerHeight) {
      card.scrollIntoView({ block: 'center' });
    }
  })();
})();
