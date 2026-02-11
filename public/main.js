// Main site logic (formerly inline in index.html)

// Dismissable top announcement
const topAnnouncement = document.querySelector('.top-announcement');
const topAnnouncementClose = document.querySelector('.top-announcement__close');

if (topAnnouncement) {
  let hideTop = false;
  try {
    hideTop = localStorage.getItem('hideTopAnnouncement') === '1';
  } catch (err) {
    hideTop = false;
  }
  if (hideTop) {
    topAnnouncement.style.display = 'none';
  }
}

if (topAnnouncement && topAnnouncementClose) {
  topAnnouncementClose.addEventListener('click', () => {
    topAnnouncement.style.display = 'none';
    try {
      localStorage.setItem('hideTopAnnouncement', '1');
    } catch (err) {
      // Ignore storage errors (private mode, etc.)
    }
  });
}

// Catalog search + filters
const searchBar = document.getElementById('search-bar');
const cards = Array.from(document.getElementsByClassName('card'));
const sectionTitles = Array.from(document.getElementsByClassName('section-title'));
const categoryButtons = Array.from(document.querySelectorAll('#categoryFilters .filter-chip'));
const filterNote = document.getElementById('filterNote');

let activeCategories = new Set(['all']);

const categoryFilterConfig = {
  all: () => true,
  essential: (primaryTags) => primaryTags.includes('Essential'),
  blocking: (_, tagTokens) => tagTokens.includes('blocking') || tagTokens.includes('amazon'),
  koreader: (primaryTags, tagTokens) =>
    (primaryTags.includes('Plugin') || tagTokens.includes('plugin')) && tagTokens.includes('koreader'),
  patches: (primaryTags, tagTokens) =>
    primaryTags.includes('Patch') || tagTokens.includes('patch') || tagTokens.includes('userpatch'),
  emulators: (primaryTags) => primaryTags.includes('Emulator'),
  games: (primaryTags) => primaryTags.includes('Game'),
  media: (_, tagTokens) => tagTokens.some(token => ['media', 'audio', 'player', 'mp3', 'wav', 'flac'].includes(token)),
  drawing: (_, tagTokens) => tagTokens.some(token => ['drawing', 'paint', 'kpaint', 'sketch'].includes(token)),
  tools: (primaryTags, tagTokens) => primaryTags.includes('Tool') || tagTokens.includes('tool'),
  resources: (primaryTags) => primaryTags.includes('Resource'),
  dev: (primaryTags, tagTokens) => primaryTags.includes('Dev') || tagTokens.includes('dev'),
  guides: (primaryTags, tagTokens) => primaryTags.includes('Guide') || tagTokens.includes('guide'),
  experimental: (primaryTags) => primaryTags.includes('Experimental'),
  'other-koreader': (primaryTags, tagTokens) =>
    tagTokens.includes('koreader') && !primaryTags.includes('Plugin') && !primaryTags.includes('Patch')
};

// Filter Toggle Logic
const filterToggleBtn = document.getElementById('filterToggleBtn');
const filterChipsWrapper = document.getElementById('filterChipsWrapper');

if (filterToggleBtn && filterChipsWrapper) {
  filterToggleBtn.addEventListener('click', () => {
    const isExpanded = filterToggleBtn.classList.contains('expanded');
    
    if (isExpanded) {
      filterToggleBtn.classList.remove('expanded');
      filterChipsWrapper.classList.remove('expanded');
      filterToggleBtn.setAttribute('aria-expanded', 'false');
    } else {
      filterToggleBtn.classList.add('expanded');
      filterChipsWrapper.classList.add('expanded');
      filterToggleBtn.setAttribute('aria-expanded', 'true');
    }
  });
}

cards.forEach(card => {
  const tagsAttr = (card.getAttribute('data-tags') || '').toLowerCase();
  const tokenSet = new Set(tagsAttr.split(/\s+/).filter(Boolean));
  Array.from(tokenSet).forEach(token => {
    if (token.endsWith('s')) {
      tokenSet.add(token.slice(0, -1));
    }
  });
  const tagTokens = Array.from(tokenSet);
  const primaryTags = Array.from(card.querySelectorAll('.card-tags .tag'))
    .map(tag => tag.textContent.trim())
    .filter(Boolean);
  card.dataset.tagTokens = tagTokens.join(',');
  card.dataset.primaryTags = primaryTags.join(',');
  card.dataset.searchCache = card.innerText.toLowerCase() + ' ' + tagsAttr;

  // Find the section this card belongs to by traversing backwards to find the preceding section-title
  let currentElement = card.parentElement; // Start with card-grid or parent
  while (currentElement) {
    let prevSibling = currentElement.previousElementSibling;
    while (prevSibling) {
      if (prevSibling.classList.contains('section-title')) {
        const sectionCategory = prevSibling.getAttribute('data-category');
        if (sectionCategory) {
          card.dataset.sectionCategory = sectionCategory;
        }
        break;
      }
      prevSibling = prevSibling.previousElementSibling;
    }
    if (card.dataset.sectionCategory) break;
    currentElement = currentElement.parentElement;
  }
});

function updateFilterNote() {
  if (!filterNote) return;
  let message = '';
  if (activeCategories.has('koreader')) {
    message = 'Tip: Install <a href="koreader.html">KOReader</a> to use these plug-ins.';
  }
  if (activeCategories.has('patches')) {
    message = 'Tip: Install <a href="koreader.html">KOReader</a> to use these patches.';
  }
  if (message) {
    filterNote.innerHTML = message;
    filterNote.style.display = '';
  } else {
    filterNote.innerHTML = '';
    filterNote.style.display = 'none';
  }
}

// Initialize category buttons with original labels for count updates
categoryButtons.forEach(btn => {
  if (!btn.dataset.originalLabel) {
    btn.dataset.originalLabel = btn.textContent.trim();
  }
});

function updateCategoryCounts(searchTerm) {
  const term = searchTerm.trim().toLowerCase();
  
  categoryButtons.forEach(btn => {
    const category = btn.dataset.category;
    let count = 0;

    cards.forEach(card => {
      // Check search match
      const searchMatch = term === '' || (card.dataset.searchCache || '').includes(term);
      if (!searchMatch) return;

      // Check category match
      if (category === 'all') {
        count++;
      } else {
        const cardCategory = card.dataset.sectionCategory;
        const tagTokens = (card.dataset.tagTokens || '').split(',').filter(Boolean);
        const primaryTags = (card.dataset.primaryTags || '').split(',').filter(Boolean);

        if (cardCategory === category || (categoryFilterConfig[category] && categoryFilterConfig[category](primaryTags, tagTokens))) {
          count++;
        }
      }
    });

    const originalLabel = btn.dataset.originalLabel;
    if (count > 0 || term === '') {
      btn.textContent = `${originalLabel} (${count})`;
    } else {
      btn.textContent = originalLabel;
    }
  });
}

function updatePageTitle(term) {
  const baseTitle = "KindleModShelf";
  let parts = [];
  if (term) parts.push(`"${term}"`);
  if (!activeCategories.has('all')) {
    if (activeCategories.size === 1) {
      const activeBtn = categoryButtons.find(b => b.classList.contains('active'));
      if (activeBtn) parts.push(activeBtn.dataset.originalLabel);
    } else {
      parts.push(`${activeCategories.size} Categories`);
    }
  }
  if (parts.length > 0) {
    document.title = `${parts.join(' in ')} - ${baseTitle}`;
  } else {
    document.title = "Kindle Modding Tools & Resources – KindleModShelf";
  }
}

function updateURL(term) {
  const params = new URLSearchParams(window.location.search);
  
  if (term) {
    params.set('q', term);
  } else {
    params.delete('q');
  }
  
  if (!activeCategories.has('all')) {
    // For now, we only sync the first selected category if multiple are selected, 
    // or we could sync all. Let's keep it simple and sync the first one.
    const firstCategory = Array.from(activeCategories)[0];
    params.set('category', firstCategory);
  } else {
    params.delete('category');
  }
  
  const newRelativePathQuery = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
  history.replaceState(null, '', newRelativePathQuery);
}

function applyFilters() {
  const term = (searchBar && searchBar.value ? searchBar.value : '').trim().toLowerCase();
  let visibleCount = 0;

  // Update UI and URL
  updateCategoryCounts(term);
  updateCategoryLabel();
  updatePageTitle(term);
  updateURL(term);

  cards.forEach(card => {
    const searchMatch = term === '' || (card.dataset.searchCache || '').includes(term);

    let categoryMatch = false;
    if (activeCategories.has('all')) {
      categoryMatch = true;
    } else {
      // Check both section category AND tags for a match
      const cardCategory = card.dataset.sectionCategory;
      const tagTokens = (card.dataset.tagTokens || '').split(',').filter(Boolean);
      const primaryTags = (card.dataset.primaryTags || '').split(',').filter(Boolean);

      // Check if any active category matches either the section OR the tags
      for (const activeCategory of activeCategories) {
        // Match by section category
        if (cardCategory === activeCategory) {
          categoryMatch = true;
          break;
        }
        // Match by filter config (tags)
        if (categoryFilterConfig[activeCategory]) {
          if (categoryFilterConfig[activeCategory](primaryTags, tagTokens)) {
            categoryMatch = true;
            break;
          }
        }
      }
    }

    if (searchMatch && categoryMatch) {
      card.style.display = '';
      visibleCount++;
      
      // Highlight matching terms
      if (term && term.length > 1) {
        highlightCardText(card, term);
      } else {
        removeHighlights(card);
      }
    } else {
      card.style.display = 'none';
      removeHighlights(card); // Clean up if hidden
    }
  });

  // Hide section titles if no visible cards follow them
  sectionTitles.forEach(title => {
    let nextElem = title.nextElementSibling;
    let foundVisible = false;
    while (nextElem && !nextElem.classList.contains('section-title')) {
      if (nextElem.classList.contains('card') && nextElem.style.display !== 'none') {
        foundVisible = true;
        break;
      }
      if (nextElem.classList.contains('card-grid')) {
        const innerCards = Array.from(nextElem.getElementsByClassName('card'));
        if (innerCards.some(card => card.style.display !== 'none')) {
          foundVisible = true;
          break;
        }
      }
      nextElem = nextElem.nextElementSibling;
    }
    title.style.display = foundVisible ? '' : 'none';
    const associatedGrid = title.nextElementSibling;
    if (associatedGrid && associatedGrid.classList.contains('card-grid')) {
      associatedGrid.style.display = foundVisible ? '' : 'none';
    }
  });

  let noRes = document.getElementById('no-results');
  if (!noRes) {
    noRes = document.createElement('div');
    noRes.id = 'no-results';
    noRes.className = 'no-results';
    const toolbar = document.querySelector('.filter-toolbar');
    if (toolbar && toolbar.parentElement) {
      toolbar.insertAdjacentElement('afterend', noRes);
    } else {
      const container = document.querySelector('.container');
      if (container) {
        container.appendChild(noRes);
      }
    }
  }
  if (visibleCount === 0) {
    noRes.innerHTML = `
      <h2>No matches found</h2>
      <p>${term ? `No results found for "<strong>${escapeHTML(term)}</strong>".` : 'Nothing matches these filters yet.'}</p>
      <button class="kindle-btn" id="resetFiltersBtn" style="margin-top: 10px;">Clear all search & filters</button>
    `;
    noRes.style.display = 'block';

    // Add event listener to reset button
    const resetBtn = document.getElementById('resetFiltersBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (searchBar) searchBar.value = '';
        activeCategories.clear();
        activeCategories.add('all');
        categoryButtons.forEach(btn => {
          btn.classList.toggle('active', btn.dataset.category === 'all');
        });
        applyFilters();
      });
    }
  } else {
    noRes.style.display = 'none';
  }

  updateFilterNote();
}

// Helper to highlight text safely using DOM manipulation
function highlightCardText(card, term) {
  // console.log(`Highlighting '${term}' in card`); // Debug
  const textElements = Array.from(card.querySelectorAll('.card-title, .card-desc, .tag'));
  
  textElements.forEach(el => {
    // Reset to original state first
    if (!el.dataset.originalText) {
      el.dataset.originalText = el.innerHTML;
    } else {
      el.innerHTML = el.dataset.originalText;
    }

    // Optimization: check if element contains term at all
    if (el.textContent.toLowerCase().includes(term)) {
      // Traverse child nodes to find text nodes
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
      const textNodes = [];
      while (walker.nextNode()) {
        textNodes.push(walker.currentNode);
      }

      // Process text nodes
      textNodes.forEach(node => {
        const text = node.nodeValue;
        const lowerText = text.toLowerCase();
        const indices = [];
        let idx = lowerText.indexOf(term);
        
        // Find all occurrences
        while (idx !== -1) {
          indices.push(idx);
          idx = lowerText.indexOf(term, idx + term.length);
        }

        if (indices.length > 0) {
          const fragment = document.createDocumentFragment();
          let lastIdx = 0;
          
          indices.forEach(start => {
            // Append text before match
            if (start > lastIdx) {
              fragment.appendChild(document.createTextNode(text.substring(lastIdx, start)));
            }
            
            // Append highlighted match
            const mark = document.createElement('mark');
            mark.className = 'search-highlight';
            mark.textContent = text.substring(start, start + term.length);
            fragment.appendChild(mark);
            
            lastIdx = start + term.length;
          });
          
          // Append remaining text
          if (lastIdx < text.length) {
            fragment.appendChild(document.createTextNode(text.substring(lastIdx)));
          }
          
          node.parentNode.replaceChild(fragment, node);
        }
      });
    }
  });
}

function removeHighlights(card) {
  const textElements = Array.from(card.querySelectorAll('.card-title, .card-desc, .tag'));
  textElements.forEach(el => {
    if (el.dataset.originalText) {
      el.innerHTML = el.dataset.originalText;
      // Optional: delete el.dataset.originalText if memory is a concern, 
      // but keeping it makes re-typing faster.
    }
  });
}

// Debounce helper
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

// Escape HTML helper
function escapeHTML(str) {
  const p = document.createElement('p');
  p.textContent = str;
  return p.innerHTML;
}

function updateCategoryLabel() {
  if (!filterToggleBtn) return;
  const toggleBtnSpan = filterToggleBtn.querySelector('span');
  if (!toggleBtnSpan) return;

  let label = "Select Category";
  if (activeCategories.has('all')) {
    label = "All Categories";
  } else if (activeCategories.size === 1) {
    const activeBtn = categoryButtons.find(b => b.classList.contains('active'));
    if (activeBtn) label = activeBtn.dataset.originalLabel || activeBtn.textContent;
  } else if (activeCategories.size > 1) {
    label = `${activeCategories.size} Categories Selected`;
  }
  toggleBtnSpan.textContent = label;
}

if (searchBar) {
  searchBar.addEventListener('input', debounce(() => applyFilters(), 300));
}

categoryButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const category = btn.dataset.category;

    if (category === 'all') {
      // Clicking "All" clears all other selections
      activeCategories.clear();
      activeCategories.add('all');
      categoryButtons.forEach(b => b.classList.toggle('active', b.dataset.category === 'all'));
    } else {
      // Clicking other categories removes "all" and toggles the selection
      activeCategories.delete('all');
      if (btn.classList.contains('active')) {
        activeCategories.delete(category);
        btn.classList.remove('active');
      } else {
        activeCategories.add(category);
        btn.classList.add('active');
      }

      // Uncheck "All" button if other categories are selected
      const allBtn = categoryButtons.find(b => b.dataset.category === 'all');
      if (allBtn) {
        allBtn.classList.toggle('active', activeCategories.size === 0);
      }

      // If nothing is selected, revert to "all"
      if (activeCategories.size === 0) {
        activeCategories.add('all');
        if (allBtn) allBtn.classList.add('active');
      }
    }

    applyFilters();
  });
});

// REMOVE the old click listener that was updating labels redundantely
// It's now handled inside applyFilters() via updateCategoryLabel()


// NEW: Check URL params on load
const urlParams = new URLSearchParams(window.location.search);
const query = urlParams.get('q');
if (query && searchBar) {
  searchBar.value = query;
  const toolbar = document.querySelector('.filter-toolbar');
  if (toolbar) {
      toolbar.scrollIntoView({ behavior: 'smooth' });
  }
}

// Deep Linking for Categories
const categoryParam = urlParams.get('category');
if (categoryParam) {
  const targetBtn = categoryButtons.find(btn => btn.dataset.category === categoryParam);
  if (targetBtn) {
    // We simulate a click to reuse the existing toggle/all logic
    targetBtn.click();
    
    // Also scroll to toolbar if filtered
    const toolbar = document.querySelector('.filter-toolbar');
    if (toolbar) {
        toolbar.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

applyFilters();

// Global Keyboard Shortcut: Escape to clear search and filters
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    let changed = false;
    
    // Clear search
    if (searchBar && searchBar.value) {
      searchBar.value = '';
      changed = true;
    }
    
    // Reset categories to "All" if not already
    if (!activeCategories.has('all')) {
      activeCategories.clear();
      activeCategories.add('all');
      categoryButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === 'all');
      });
      
      // Update label
      const toggleBtnSpan = filterToggleBtn.querySelector('span');
      if (toggleBtnSpan) toggleBtnSpan.textContent = "All Categories";
      
      changed = true;
    }
    
    if (changed) {
      applyFilters();
      // Blur search bar if it was focused
      if (searchBar) searchBar.blur();
    }
  }
});

// Slide-in animation trigger for email popup
window.addEventListener('load', () => {
  setTimeout(() => {
    const box = document.getElementById('emailPopup');
    // Only show popup if user hasn't already subscribed
    if (box && !hasUserSubscribed()) {
      box.style.display = 'block';
    }
  }, 3000); // Show after 3 seconds
});

// Handle form submission without page redirect
// Utility function to set a cookie
function setCookie(name, value, days = 365) {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/;SameSite=Lax";
}

// Utility function to get a cookie
function getCookie(name) {
  const nameEQ = name + "=";
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.indexOf(nameEQ) === 0) {
      return cookie.substring(nameEQ.length);
    }
  }
  return null;
}

// Check if user has already subscribed (cookie takes priority, then localStorage)
function hasUserSubscribed() {
  let stored = false;
  try { stored = localStorage.getItem('kindleModsSubscribed') === 'true'; } catch(e) {}
  return getCookie('kindleModsSubscribed') === 'true' || stored;
}

const subscribeForm = document.getElementById('subscribeForm');
if (subscribeForm) {
  subscribeForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const form = this;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    // Submit the form using fetch API
    fetch('https://submit-form.com/2iG0zCawO', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    .then(response => {
      if (response.ok) {
        // Hide the form and show thank you message
        form.style.display = 'none';
        const thankYou = document.getElementById('thankYouMessage');
        if (thankYou) thankYou.style.display = 'block';

        // Set cookie that persists for 1 year
        setCookie('kindleModsSubscribed', 'true', 365);

        // Also store in localStorage as fallback
        try { localStorage.setItem('kindleModsSubscribed', 'true'); } catch(e) {}

        // Close the popup after a few seconds
        setTimeout(() => {
          const popup = document.getElementById('emailPopup');
          if (popup) popup.style.display = 'none';
        }, 5000);
      } else {
        throw new Error('Form submission failed');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Something went wrong. Please try again.');
    });
  });
}

// Don't show popup if already subscribed
if (hasUserSubscribed()) {
  window.addEventListener('load', () => {
    const popup = document.getElementById('emailPopup');
    if (popup) popup.style.display = 'none';
  });
}

// Gallery Popup Logic
window.closeGalleryPopup = function() {
  const popup = document.getElementById('galleryPopup');
  if (popup) {
    popup.classList.add('hidden');
    // Save state to cookies/localStorage
    setCookie('hideGalleryPopup', 'true', 365);
    try { localStorage.setItem('hideGalleryPopup', 'true'); } catch(e) {}
    
    // Update toggle if settings modal is open
    const toggle = document.getElementById('galleryPopupToggle');
    if (toggle) toggle.checked = false;
  }
}

// Settings Modal Functionality
function initSettingsModal() {
  const settingsWheel = document.getElementById('settingsWheel');
  const settingsModal = document.getElementById('settingsModal');
  const settingsModalClose = document.getElementById('settingsModalClose');
  const newsletterToggle = document.getElementById('newsletterToggle');
  const warningBannerToggle = document.getElementById('warningBannerToggle');
  const galleryPopupToggle = document.getElementById('galleryPopupToggle');
  const galleryPopup = document.getElementById('galleryPopup');

  // Function to check if warning banner is hidden
  function isBannerHidden() {
    try {
      return localStorage.getItem('hideTopAnnouncement') === '1';
    } catch (err) {
      return false;
    }
  }

  // Function to check if gallery popup is hidden
  function isGalleryPopupHidden() {
    try { return getCookie('hideGalleryPopup') === 'true' || localStorage.getItem('hideGalleryPopup') === 'true'; } catch(e) { return getCookie('hideGalleryPopup') === 'true'; }
  }

  // Initialize Gallery Popup State
  if (galleryPopup) {
    if (!isGalleryPopupHidden()) {
      galleryPopup.classList.remove('hidden');
    } else {
      galleryPopup.classList.add('hidden');
    }
  }

  // Function to update toggle state based on current subscription
  function updateToggleState() {
    const isSubscribed = hasUserSubscribed();
    
    // Toggle is ON if user has NOT subscribed (show popup)
    // Toggle is OFF if user HAS subscribed (hide popup)
    if (newsletterToggle) newsletterToggle.checked = !isSubscribed;

    // Warning banner toggle - ON means SHOW banner, OFF means HIDE banner
    const bannerHidden = isBannerHidden();
    if (warningBannerToggle) warningBannerToggle.checked = !bannerHidden;

    // Gallery Popup toggle
    const galleryHidden = isGalleryPopupHidden();
    if (galleryPopupToggle) galleryPopupToggle.checked = !galleryHidden;
  }

  // Open settings modal
  if (settingsWheel) {
    settingsWheel.addEventListener('click', () => {
      if (settingsModal) {
        settingsModal.classList.add('active');
        // Update toggle to reflect current subscription status
        updateToggleState();
      }
    });
  }

  // Close settings modal
  if (settingsModalClose) {
    settingsModalClose.addEventListener('click', () => {
      if (settingsModal) {
        settingsModal.classList.remove('active');
      }
    });
  }

  // Close modal when clicking outside the modal content
  if (settingsModal) {
    settingsModal.addEventListener('click', (e) => {
      if (e.target === settingsModal) {
        settingsModal.classList.remove('active');
      }
    });
  }

  // Handle newsletter toggle
  if (newsletterToggle) {
    newsletterToggle.addEventListener('change', (e) => {
      if (e.target.checked) {
        // User wants to SHOW the popup (remove subscription cookie)
        // Remove cookie by setting expiry to past date
        document.cookie = 'kindleModsSubscribed=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax;';
        try { localStorage.removeItem('kindleModsSubscribed'); } catch(e) {}
      } else {
        // User wants to HIDE the popup (set subscription cookie)
        setCookie('kindleModsSubscribed', 'true', 365);
        try { localStorage.setItem('kindleModsSubscribed', 'true'); } catch(e) {}
      }
    });
  }

  // Handle warning banner toggle
  if (warningBannerToggle) {
    warningBannerToggle.addEventListener('change', (e) => {
      const topAnnouncement = document.querySelector('.top-announcement');

      if (e.target.checked) {
        // User wants to SHOW the banner
        if (topAnnouncement) {
          topAnnouncement.style.display = 'block';
        }
        try {
          localStorage.removeItem('hideTopAnnouncement');
        } catch (err) {
          console.error('Failed to update localStorage:', err);
        }
      } else {
        // User wants to HIDE the banner
        if (topAnnouncement) {
          topAnnouncement.style.display = 'none';
        }
        try {
          localStorage.setItem('hideTopAnnouncement', '1');
        } catch (err) {
          console.error('Failed to update localStorage:', err);
        }
      }
    });
  }

  // Handle Gallery Popup toggle
  if (galleryPopupToggle) {
    galleryPopupToggle.addEventListener('change', (e) => {
      const galleryPopup = document.getElementById('galleryPopup');
      if (e.target.checked) {
        // Show popup
        if (galleryPopup) galleryPopup.classList.remove('hidden');
        document.cookie = 'hideGalleryPopup=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax;';
        try { localStorage.removeItem('hideGalleryPopup'); } catch(e) {}
      } else {
        // Hide popup
        if (galleryPopup) galleryPopup.classList.add('hidden');
        setCookie('hideGalleryPopup', 'true', 365);
        try { localStorage.setItem('hideGalleryPopup', 'true'); } catch(e) {}
      }
    });
  }

  // Close modal on Escape key
  if (settingsModal) {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && settingsModal.classList.contains('active')) {
        settingsModal.classList.remove('active');
      }
    });
  }
}

// Make tags clickable for filtering
function initClickableTags() {
  document.addEventListener('click', (e) => {
    const tag = e.target.closest('.tag');
    if (tag && !tag.closest('.filter-chip')) { // Don't trigger on filter chips themselves
      const tagName = tag.textContent.trim();
      if (searchBar) {
        searchBar.value = tagName;
        // Trigger search
        applyFilters();
        // Scroll to search bar
        const toolbar = document.querySelector('.filter-toolbar');
        if (toolbar) {
          toolbar.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  });
}

// Call the initialization function
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initSettingsModal();
    initClickableTags();
  });
} else {
  initSettingsModal();
  initClickableTags();
}
