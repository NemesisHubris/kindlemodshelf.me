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
  experimental: (primaryTags) => primaryTags.includes('Experimental')
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

function applyFilters() {
  const term = (searchBar && searchBar.value ? searchBar.value : '').trim().toLowerCase();
  let visibleCount = 0;

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
    } else {
      card.style.display = 'none';
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
      document.querySelector('.container').appendChild(noRes);
    }
  }
  if (visibleCount === 0) {
    const termText = term ? ` for "${term}"` : '';
    noRes.textContent = term
      ? `No results found${termText}. Try another search or reset filters.`
      : 'Nothing matches these filters yet — try switching categories or clearing filters.';
    noRes.style.display = '';
  } else {
    noRes.style.display = 'none';
  }

  updateFilterNote();
}

if (searchBar) {
  searchBar.addEventListener('input', () => applyFilters());
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

// Update button text when a category is clicked
categoryButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    // If "All" is active, show "Select Category" (or "All Categories")
    // If a specific category is active, show its name
    // Since the existing logic allows multi-select but "All" clears others,
    // we can check if "All" is active.
    
    let label = "Select Category";
    if (activeCategories.has('all')) {
      label = "All Categories";
    } else if (activeCategories.size === 1) {
      // Find the name of the single active category
      const activeBtn = categoryButtons.find(b => b.classList.contains('active'));
      if (activeBtn) label = activeBtn.textContent;
    } else if (activeCategories.size > 1) {
      label = `${activeCategories.size} Categories Selected`;
    }
    
    const toggleBtnSpan = filterToggleBtn.querySelector('span');
    if (toggleBtnSpan) toggleBtnSpan.textContent = label;
  });
});

// NEW: Check URL params on load
const urlParams = new URLSearchParams(window.location.search);
const query = urlParams.get('q');
if (query && searchBar) {
  searchBar.value = query;
  // Also scroll to search bar if there's a query
  const toolbar = document.querySelector('.filter-toolbar');
  if (toolbar) {
      toolbar.scrollIntoView({ behavior: 'smooth' });
  }
}

applyFilters();

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
  return getCookie('kindleModsSubscribed') === 'true' || localStorage.getItem('kindleModsSubscribed') === 'true';
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
        localStorage.setItem('kindleModsSubscribed', 'true');

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
    localStorage.setItem('hideGalleryPopup', 'true');
    
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
    return getCookie('hideGalleryPopup') === 'true' || localStorage.getItem('hideGalleryPopup') === 'true';
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
        localStorage.removeItem('kindleModsSubscribed');
      } else {
        // User wants to HIDE the popup (set subscription cookie)
        setCookie('kindleModsSubscribed', 'true', 365);
        localStorage.setItem('kindleModsSubscribed', 'true');
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
        localStorage.removeItem('hideGalleryPopup');
      } else {
        // Hide popup
        if (galleryPopup) galleryPopup.classList.add('hidden');
        setCookie('hideGalleryPopup', 'true', 365);
        localStorage.setItem('hideGalleryPopup', 'true');
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

  // Position settings wheel dynamically based on banner visibility
  function updateSettingsWheelPosition() {
    const topAnnouncement = document.querySelector('.top-announcement');
    if (!topAnnouncement || !settingsWheel) return;

    const bannerHeight = topAnnouncement.style.display !== 'none' ? topAnnouncement.offsetHeight : 0;
    const bannerPadding = 20; // padding below banner
    settingsWheel.style.top = (bannerHeight + bannerPadding) + 'px';
  }

  // Update on load and when banner visibility changes
  setTimeout(updateSettingsWheelPosition, 100);

  const topAnnouncement = document.querySelector('.top-announcement');
  if (topAnnouncement) {
    const observer = new MutationObserver(() => {
      setTimeout(updateSettingsWheelPosition, 50);
    });
    observer.observe(topAnnouncement, { attributes: true, attributeFilter: ['style'] });
  }
}

// Call the initialization function
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSettingsModal);
} else {
  initSettingsModal();
}
