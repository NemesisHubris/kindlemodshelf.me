(function () {
  'use strict';

  // Resolve page slug from ?p= param OR from the HTML filename.
  // /redesign/koreader.html  →  "koreader"
  // page.html?p=koreader     →  "koreader"
  const params = new URLSearchParams(window.location.search);
  let page = params.get('p');
  if (!page) {
    const match = window.location.pathname.match(/\/([^\/]+)\.html$/);
    if (match && match[1] !== 'page') page = match[1];
  }

  const el = document.getElementById('content');

  if (!page || !/^[\w-]+$/.test(page)) {
    el.innerHTML = notFound();
    return;
  }

  // ── marked.js callout extension  (::: warning … :::) ────────────────────
  const calloutExtension = {
    name: 'callout',
    level: 'block',
    start(src) { return src.indexOf(':::'); },
    tokenizer(src) {
      const match = /^:::[ \t]*(\w+)?[ \t]*\n([\s\S]*?)\n:::[ \t]*(?:\n|$)/.exec(src);
      if (match) {
        const aliases = {
          caution: 'warning', error: 'danger', success: 'tip',
          hint: 'tip', attention: 'warning',
        };
        const raw = (match[1] || 'note').toLowerCase();
        return {
          type: 'callout',
          raw: match[0],
          calloutType: aliases[raw] || raw,
          text: match[2].trim(),
        };
      }
    },
    renderer(token) {
      const inner = marked.parse(token.text);
      return `<div class="callout callout-${token.calloutType}">${inner}</div>\n`;
    },
  };

  // ── marked.js custom renderer ────────────────────────────────────────────
  // marked.js v12 uses positional args: image(href, title, text)
  const renderer = {
    image(href, title, text) {
      const isVideo = text === 'video' || /youtube\.com|youtu\.be/.test(href);
      if (isVideo) {
        const idMatch = href.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
        if (idMatch) {
          const id = idMatch[1];
          const t = (title || 'Video').replace(/"/g, '&quot;');
          return `<div class="responsive-video"><iframe src="https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&playsinline=1" title="${t}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>\n`;
        }
      }
      const alt = (text || '').replace(/"/g, '&quot;');
      const titleAttr = title ? ` title="${title.replace(/"/g, '&quot;')}"` : '';
      return `<img src="${href}" alt="${alt}"${titleAttr} class="md-image">\n`;
    },
  };

  // ── Configure marked ─────────────────────────────────────────────────────
  if (typeof marked !== 'undefined') {
    marked.use({ extensions: [calloutExtension], renderer, gfm: true, breaks: false });
  }

  // ── Fetch and render ─────────────────────────────────────────────────────
  fetch(`content/${page}.md`)
    .then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.text();
    })
    .then(md => {
      const titleMatch = md.match(/^#\s+(.+)$/m);
      if (titleMatch) {
        document.title = titleMatch[1].replace(/\*\*/g, '') + ' | KindleModShelf';
      }

      const skipActionButtons = /<!--\s*no-action-buttons\s*-->/.test(md);

      el.innerHTML = typeof marked !== 'undefined'
        ? marked.parse(md)
        : `<pre>${escapeHTML(md)}</pre>`;

      el.querySelectorAll('a[href^="http"]').forEach(a => {
        a.target = '_blank';
        a.rel    = 'noopener noreferrer';
      });

      if (!skipActionButtons) {
        injectActionButtons(el);
      }

      // Try to load per-page image manifest; inject gallery after the opening
      // description if images exist. Falls through to initGallery either way.
      fetch(`content/${page}.images.json`)
        .then(r => r.ok ? r.json() : null)
        .then(images => {
          if (images && images.length > 0) {
            injectManifestGallery(el, images);
          }
          initGallery(el);
        })
        .catch(() => { initGallery(el); });
    })
    .catch(() => { el.innerHTML = notFound(page); });

  // ── Manifest gallery ─────────────────────────────────────────────────────
  // Builds a fixed-size Reddit-style carousel from an array of image URLs and
  // inserts it right after the page's opening description (h1 + first p/blockquote).
  function injectManifestGallery(container, images) {
    const gallery = buildGallery(images);

    // Find insertion point: after h1, then optionally after the first
    // descriptive block (p, blockquote, or callout div) that immediately follows.
    const h1 = container.querySelector('h1');
    let anchor = h1;
    if (h1) {
      const next = h1.nextElementSibling;
      if (next && (next.tagName === 'P' || next.tagName === 'BLOCKQUOTE' ||
                   (next.tagName === 'DIV' && next.classList.contains('callout')))) {
        anchor = next;
      }
    }

    if (anchor && anchor.parentNode) {
      anchor.parentNode.insertBefore(gallery, anchor.nextSibling);
    } else {
      container.prepend(gallery);
    }
  }

  // ── Inline image gallery ─────────────────────────────────────────────────
  // Groups any remaining img.md-image elements in the markdown into a carousel.
  function initGallery(container) {
    const allImgNodes = [];
    container.querySelectorAll('img.md-image').forEach(img => {
      const parent = img.parentElement;
      const wrapper = (parent && parent.tagName === 'P') ? parent : img;
      if (!allImgNodes.find(e => e.wrapper === wrapper)) {
        allImgNodes.push({ wrapper, img });
      }
    });

    if (allImgNodes.length < 2) return;

    const srcs = allImgNodes.map(({ img }) => img.src);
    const gallery = buildGallery(srcs);

    const first = allImgNodes[0].wrapper;
    first.parentNode.insertBefore(gallery, first);
    allImgNodes.forEach(({ wrapper }) => wrapper.remove());
  }

  // ── Shared gallery builder ───────────────────────────────────────────────
  // Takes an array of image URL strings, returns a fully wired .md-gallery node.
  function buildGallery(srcs) {
    const total = srcs.length;

    const slides = srcs.map((src, i) => {
      const slide = document.createElement('div');
      slide.className = 'gallery-slide' + (i === 0 ? ' gallery-slide--active' : '');
      const img = document.createElement('img');
      if (i === 0) { img.src = src; } else { img.dataset.src = src; }
      img.alt = 'screenshot';
      slide.appendChild(img);
      return slide;
    });

    function loadNear(idx) {
      [idx, idx + 1].forEach(i => {
        if (i < 0 || i >= total) return;
        const img = slides[i].querySelector('img');
        if (img.dataset.src) { img.src = img.dataset.src; delete img.dataset.src; }
      });
    }

    const gallery = document.createElement('div');
    gallery.className = 'md-gallery';

    const track = document.createElement('div');
    track.className = 'gallery-track';
    slides.forEach(s => track.appendChild(s));

    const prevBtn = document.createElement('button');
    prevBtn.className = 'gallery-nav gallery-nav--prev';
    prevBtn.setAttribute('aria-label', 'Previous image');
    prevBtn.innerHTML = '&#8249;';
    prevBtn.disabled = true;

    const nextBtn = document.createElement('button');
    nextBtn.className = 'gallery-nav gallery-nav--next';
    nextBtn.setAttribute('aria-label', 'Next image');
    nextBtn.innerHTML = '&#8250;';
    nextBtn.disabled = total <= 1;

    const counter = document.createElement('div');
    counter.className = 'gallery-counter';
    counter.textContent = total > 1 ? `1 / ${total}` : '';

    gallery.appendChild(prevBtn);
    gallery.appendChild(track);
    gallery.appendChild(nextBtn);
    gallery.appendChild(counter);

    let current = 0;
    loadNear(0);

    function goTo(idx) {
      slides[current].classList.remove('gallery-slide--active');
      current = idx;
      slides[current].classList.add('gallery-slide--active');
      counter.textContent = `${current + 1} / ${total}`;
      prevBtn.disabled = current === 0;
      nextBtn.disabled = current === total - 1;
      loadNear(current);
    }

    prevBtn.addEventListener('click', () => { if (current > 0) goTo(current - 1); });
    nextBtn.addEventListener('click', () => { if (current < total - 1) goTo(current + 1); });

    return gallery;
  }

  // ── Action buttons (GitHub / Buy / Support) ──────────────────────────────
  // Scans rendered links for a GitHub repo root and Ko-fi/BMC URL, then appends
  // a button bar at the bottom. Add <!-- no-action-buttons --> to an .md file
  // to opt out entirely.
  function injectActionButtons(container) {
    let kofiUrl = null;

    container.querySelectorAll('a[href]').forEach(a => {
      if (!kofiUrl && /ko-fi\.com|buymeacoffee\.com/.test(a.href)) {
        kofiUrl = a.href;
      }
    });

    if (!kofiUrl) return;

    const bar = document.createElement('div');
    bar.className = 'page-action-bar';

    const a = document.createElement('a');
    a.href = kofiUrl;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.className = 'page-action-btn page-action-kofi';
    a.innerHTML = '<span class="page-action-icon"></span>Buy a Coffee';
    bar.appendChild(a);

    container.appendChild(bar);
  }

  function notFound(name) {
    return `
      <h1>Page not found</h1>
      <div class="summary">
        ${name ? `Could not load <code>content/${name}.md</code>.` : 'No page specified.'}
        <br><br>
        <a href="index.html">← Back to the catalog</a>
      </div>`;
  }

  function escapeHTML(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }
})();
