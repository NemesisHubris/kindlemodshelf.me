(function () {
  const STORAGE_KEY = 'kindlemodshelf_favorites_v1';
  const CHANGE_EVENT = 'kindlemodshelf:favoriteschange';

  function favoriteKey(author, filename) {
    return `${author}|||${filename}`;
  }

  function normalizeEntry(entry) {
    if (!entry) return null;
    const author = String(entry.author || '').trim();
    const filename = String(entry.filename || '').trim();
    if (!author || !filename) return null;
    const addedAt = Number(entry.addedAt);
    return {
      author,
      filename,
      addedAt: Number.isFinite(addedAt) ? addedAt : Date.now()
    };
  }

  function readRawFavorites() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  function loadFavorites() {
    const map = new Map();
    readRawFavorites().forEach(entry => {
      const favorite = normalizeEntry(entry);
      if (!favorite) return;
      map.set(favoriteKey(favorite.author, favorite.filename), favorite);
    });
    return Array.from(map.values()).sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0));
  }

  function saveFavorites(favorites) {
    const normalized = [];
    const seen = new Set();
    (Array.isArray(favorites) ? favorites : []).forEach(entry => {
      const favorite = normalizeEntry(entry);
      if (!favorite) return;
      const key = favoriteKey(favorite.author, favorite.filename);
      if (seen.has(key)) return;
      seen.add(key);
      normalized.push(favorite);
    });

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    } catch (error) {}

    window.dispatchEvent(new CustomEvent(CHANGE_EVENT, {
      detail: { favorites: normalized.slice() }
    }));
  }

  function isFavorite(author, filename) {
    return loadFavorites().some(entry => entry.author === author && entry.filename === filename);
  }

  function addFavorite(author, filename) {
    const favorites = loadFavorites();
    if (favorites.some(entry => entry.author === author && entry.filename === filename)) {
      return false;
    }
    favorites.unshift({ author, filename, addedAt: Date.now() });
    saveFavorites(favorites);
    return true;
  }

  function removeFavorite(author, filename) {
    const existing = loadFavorites();
    const favorites = existing.filter(entry => !(entry.author === author && entry.filename === filename));
    const removed = favorites.length !== existing.length;
    saveFavorites(favorites);
    return removed;
  }

  function toggleFavorite(author, filename) {
    if (isFavorite(author, filename)) {
      removeFavorite(author, filename);
      return false;
    }
    addFavorite(author, filename);
    return true;
  }

  function imagePath(author, filename) {
    return `images/${author}/${filename}`;
  }

  window.KindleModsFavorites = {
    STORAGE_KEY,
    CHANGE_EVENT,
    favoriteKey,
    loadFavorites,
    saveFavorites,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    imagePath
  };

  window.addEventListener('storage', event => {
    if (event.key !== STORAGE_KEY) return;
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT, {
      detail: { favorites: loadFavorites() }
    }));
  });
})();
