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

  // ── Category filter config ───────────────────────────────────────────────
  const categoryConfig = {
    all:            () => true,
    essential:      (tags) => tags.includes('Essential'),
    blocking:       (_, raw) => raw.includes('blocking') || raw.includes('amazon'),
    koreader:       (tags, raw) => (tags.includes('Plugin') || raw.includes('plugin')) && raw.includes('koreader'),
    patches:        (tags, raw) => tags.includes('Patch') || raw.includes('patch') || raw.includes('userpatch'),
    emulators:      (tags) => tags.includes('Emulator'),
    games:          (tags) => tags.includes('Game'),
    media:          (_, raw) => ['media', 'audio', 'player', 'mp3', 'wav', 'flac'].some(t => raw.includes(t)),
    drawing:        (_, raw) => ['drawing', 'paint', 'kpaint', 'sketch'].some(t => raw.includes(t)),
    tools:          (tags, raw) => tags.includes('Tool') || raw.includes('tool'),
    resources:      (tags) => tags.includes('Resource'),
    dev:            (tags, raw) => tags.includes('Dev') || raw.includes('dev'),
    guides:         (tags, raw) => tags.includes('Guide') || raw.includes('guide'),
    beta:           (tags) => tags.includes('Beta') || tags.includes('Experimental'),
    'other-koreader': (tags, raw) => raw.includes('koreader') && !tags.includes('Plugin') && !tags.includes('Patch'),
  };

  // ── Gather cards ─────────────────────────────────────────────────────────
  const cards = Array.from(document.querySelectorAll('.card'));
  const sectionTitles = Array.from(document.querySelectorAll('.section-title'));

  cards.forEach(card => {
    const rawTags = (card.getAttribute('data-tags') || '').toLowerCase();
    const primaryTags = Array.from(card.querySelectorAll('.card-tags .tag')).map(t => t.textContent.trim());
    card._rawTags = rawTags;
    card._primaryTags = primaryTags;
    card._searchText = (card.innerText + ' ' + rawTags).toLowerCase();
  });

  // ── State ────────────────────────────────────────────────────────────────
  const searchBar      = document.getElementById('search-bar');
  const searchClear    = document.getElementById('search-clear');
  const filterNote     = document.getElementById('filterNote');
  const chipBtns       = Array.from(document.querySelectorAll('#categoryFilters .filter-chip'));

  let activeCategories = new Set(['all']);
  let searchQuery      = '';

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
      const categoryMatch = showAll || [...activeCategories].some(cat => {
        const fn = categoryConfig[cat];
        return fn && fn(card._primaryTags, card._rawTags);
      });
      const searchMatch  = !searchQuery || card._searchText.includes(searchQuery);
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

    // Filter note
    if (filterNote) {
      const filtering = !showAll || searchQuery;
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
    searchQuery = searchBar.value.trim().toLowerCase();
    if (searchClear) searchClear.style.display = searchQuery ? '' : 'none';
    render();
  });

  searchClear?.addEventListener('click', () => {
    if (searchBar) searchBar.value = '';
    searchQuery = '';
    searchClear.style.display = 'none';
    render();
  });

  // Initial render
  render();
})();
