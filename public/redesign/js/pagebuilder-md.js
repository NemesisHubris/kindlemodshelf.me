(function () {
  'use strict';

  // ── Callout extension (matches page-loader.js) ─────────────────────────────
  const calloutExtension = {
    name: 'callout',
    level: 'block',
    start(src) { return src.indexOf(':::'); },
    tokenizer(src) {
      const match = /^:::[ \t]*(\w+)?[ \t]*\n([\s\S]*?)\n:::[ \t]*(?:\n|$)/.exec(src);
      if (match) {
        const aliases = { caution: 'warning', error: 'danger', success: 'tip', hint: 'tip', attention: 'warning' };
        const raw = (match[1] || 'note').toLowerCase();
        return { type: 'callout', raw: match[0], calloutType: aliases[raw] || raw, text: match[2].trim() };
      }
    },
    renderer(token) {
      return `<div class="callout callout-${token.calloutType}">${marked.parse(token.text)}</div>\n`;
    },
  };

  const mdRenderer = {
    image(href, title, text) {
      const isVideo = text === 'video' || /youtube\.com|youtu\.be/.test(href);
      if (isVideo) {
        const m = href.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
        if (m) {
          const t = (title || 'Video').replace(/"/g, '&quot;');
          return `<div class="responsive-video"><iframe src="https://www.youtube.com/embed/${m[1]}?rel=0&modestbranding=1&playsinline=1" title="${t}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>\n`;
        }
      }
      const alt = (text || '').replace(/"/g, '&quot;');
      const titleAttr = title ? ` title="${title.replace(/"/g, '&quot;')}"` : '';
      return `<img src="${href}" alt="${alt}"${titleAttr} class="md-image">\n`;
    },
  };

  if (typeof marked !== 'undefined') {
    marked.use({ extensions: [calloutExtension], renderer: mdRenderer, gfm: true, breaks: false });
  }

  // ── Block definitions ──────────────────────────────────────────────────────
  const BLOCK_GROUPS = {
    page: [
      { id: 'h1',           icon: '#',   label: 'Page Title',       snippet: '# Page Title\n' },
      { id: 'intro',        icon: '❝',   label: 'Intro Summary',    snippet: '> **Tool Name** — brief description here.\n' },
      { id: 'section',      icon: '##',  label: 'Section',          snippet: '## Section Title\n\nContent here.\n' },
      { id: 'subsection',   icon: '###', label: 'Subsection',       snippet: '### Subsection Title\n\nContent here.\n' },
      { id: 'download',     icon: '↓',   label: 'Download',         snippet: '## Download\n\n- [Download from GitHub](https://github.com/)\n' },
      { id: 'features',     icon: '✦',   label: 'Features',         snippet: '## Features\n\n- Feature one\n- Feature two\n- Feature three\n' },
      { id: 'requirements', icon: '!',   label: 'Requirements',     snippet: '## Requirements\n\n- [Jailbroken Kindle](jailbreaking.html)\n- [KUAL](kual.html)\n' },
      { id: 'installation', icon: '1.',  label: 'Installation',     snippet: '## Installation\n\n1. Step one\n2. Step two\n3. Step three\n' },
      { id: 'credits',      icon: '©',   label: 'Credits',          snippet: '## Credits\n\nDeveloped by [Author Name](https://github.com/author).\n' },
    ],
    callouts: [
      { id: 'warning',  icon: '⚠︎', label: 'Warning',  snippet: ':::warning\nImportant warning here.\n:::\n' },
      { id: 'note',     icon: 'ℹ︎', label: 'Note',     snippet: ':::note\nUseful note here.\n:::\n' },
      { id: 'tip',      icon: '★',        label: 'Tip',      snippet: ':::tip\nHelpful tip here.\n:::\n' },
      { id: 'danger',   icon: '✕',        label: 'Danger',   snippet: ':::danger\nCritical warning here.\n:::\n' },
    ],
    content: [
      { id: 'codeblock', icon: '</>',label: 'Code Block',   snippet: '```\ncode here\n```\n' },
      { id: 'bullets',   icon: '•',  label: 'Bullet List',  snippet: '- First item\n- Second item\n- Third item\n' },
      { id: 'numbered',  icon: '1.', label: 'Numbered List', snippet: '1. First step\n2. Second step\n3. Third step\n' },
      { id: 'blockquote',icon: '"',  label: 'Blockquote',   snippet: '> Quote text here.\n' },
      { id: 'link',      icon: '↗',  label: 'Link',         snippet: '[link text](https://example.com)' },
      { id: 'video',     icon: '▶',  label: 'YouTube Video', snippet: '![video](https://youtu.be/VIDEO_ID)\n' },
      { id: 'hr',        icon: '—',  label: 'Divider',      snippet: '\n---\n\n' },
    ],
  };

  const ALL_BLOCKS = [...BLOCK_GROUPS.page, ...BLOCK_GROUPS.callouts, ...BLOCK_GROUPS.content];

  // ── State ──────────────────────────────────────────────────────────────────
  let viewMode    = 'split';
  let splitRatio  = 0.5;
  let paletteOpen = false;
  let paletteQuery = '';
  let paletteActiveIdx = 0;
  let paletteTriggerPos = -1;
  let autoFilename = true;

  // ── DOM ────────────────────────────────────────────────────────────────────
  const $  = (id) => document.getElementById(id);
  let editor, preview, filenameInput, wordCountEl, workspace, palette, paletteInput, paletteList;

  // ── Init ───────────────────────────────────────────────────────────────────
  function init() {
    editor         = $('pbEditor');
    preview        = $('pbPreview');
    filenameInput  = $('pbFilename');
    wordCountEl    = $('pbWordCount');
    workspace      = $('pbWorkspace');
    palette        = $('pbPalette');
    paletteInput   = $('pbPaletteInput');
    paletteList    = $('pbPaletteList');

    renderBlocksPalette();
    loadFromStorage();
    setupEvents();
    applyViewMode();
    applySplit();
    updatePreview();
    updateWordCount();
    updateFilenameFromContent();
  }

  // ── Block palette rendering ────────────────────────────────────────────────
  function renderBlocksPalette() {
    renderBlockGroup('pbBlocksList', BLOCK_GROUPS.page);
    renderBlockGroup('pbCalloutsList', BLOCK_GROUPS.callouts);
    renderBlockGroup('pbContentList', BLOCK_GROUPS.content);
  }

  function renderBlockGroup(containerId, blocks) {
    const el = $(containerId);
    if (!el) return;
    el.innerHTML = blocks.map(b => `
      <button class="pb-block-btn" data-block-id="${b.id}" type="button" title="${b.label}">
        <span class="pb-block-icon">${b.icon}</span>
        <span class="pb-block-label">${b.label}</span>
      </button>
    `).join('');
    el.querySelectorAll('.pb-block-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const block = ALL_BLOCKS.find(b => b.id === btn.dataset.blockId);
        if (block) insertSnippet(block.snippet);
      });
    });
  }

  // ── Snippet insertion ──────────────────────────────────────────────────────
  function insertSnippet(snippet) {
    const pos = editor.selectionStart;
    const val = editor.value;
    const before = val.substring(0, pos);
    const after  = val.substring(pos);

    // Ensure snippet starts on its own line
    const needsNewlineBefore = before.length > 0 && !before.endsWith('\n');
    const needsNewlineAfter  = after.length > 0 && !after.startsWith('\n') && !snippet.endsWith('\n');

    const prefix = needsNewlineBefore ? '\n' : '';
    const suffix = needsNewlineAfter  ? '\n' : '';

    const newVal = before + prefix + snippet + suffix + after;
    editor.value = newVal;

    const newPos = pos + prefix.length + snippet.length + suffix.length;
    editor.selectionStart = newPos;
    editor.selectionEnd   = newPos;
    editor.focus();
    onEdit();
  }

  // ── Format toolbar actions ─────────────────────────────────────────────────
  function applyFormat(action) {
    const start    = editor.selectionStart;
    const end      = editor.selectionEnd;
    const selected = editor.value.substring(start, end);
    const val      = editor.value;

    const wrap = (marker, placeholder) => {
      const text    = selected || placeholder;
      const newText = marker + text + marker;
      editor.value  = val.substring(0, start) + newText + val.substring(end);
      editor.selectionStart = selected ? start : start + marker.length;
      editor.selectionEnd   = selected ? start + newText.length : start + marker.length + placeholder.length;
      editor.focus();
      onEdit();
    };

    switch (action) {
      case 'bold':          return wrap('**', 'bold text');
      case 'italic':        return wrap('_', 'italic text');
      case 'strikethrough': return wrap('~~', 'strikethrough');
      case 'inlinecode':    return wrap('`', 'code');
      case 'blockquote':
        return insertLinePrefix('> ');
      case 'h2': return insertLinePrefix('## ');
      case 'h3': return insertLinePrefix('### ');
      case 'ul': return insertLinePrefix('- ');
      case 'ol': return insertLinePrefix('1. ');
      case 'link': {
        const text = (selected && !selected.startsWith('http')) ? selected : 'link text';
        const href = selected.startsWith('http') ? selected : 'https://';
        const snippet = `[${text}](${href})`;
        editor.value = val.substring(0, start) + snippet + val.substring(end);
        editor.selectionStart = start + 1;
        editor.selectionEnd   = start + 1 + text.length;
        editor.focus();
        return onEdit();
      }
    }
  }

  function insertLinePrefix(prefix) {
    const pos      = editor.selectionStart;
    const val      = editor.value;
    const lineStart = val.lastIndexOf('\n', pos - 1) + 1;

    if (val.substring(lineStart).startsWith(prefix)) {
      // Toggle off
      editor.value = val.substring(0, lineStart) + val.substring(lineStart + prefix.length);
      editor.selectionStart = editor.selectionEnd = Math.max(lineStart, pos - prefix.length);
    } else {
      editor.value = val.substring(0, lineStart) + prefix + val.substring(lineStart);
      editor.selectionStart = editor.selectionEnd = pos + prefix.length;
    }
    editor.focus();
    onEdit();
  }

  // ── Preview ────────────────────────────────────────────────────────────────
  function updatePreview() {
    if (!editor || !preview) return;
    const md = editor.value;
    if (typeof marked !== 'undefined') {
      preview.innerHTML = marked.parse(md);
    } else {
      preview.textContent = md;
    }
    preview.querySelectorAll('a[href^="http"]').forEach(a => {
      a.target = '_blank';
      a.rel    = 'noopener noreferrer';
    });
    addPreviewNavigation();
  }

  function addPreviewNavigation() {
    preview.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(heading => {
      heading.classList.add('pb-preview-nav');
      heading.addEventListener('click', () => jumpToHeading(heading));
    });
  }

  function jumpToHeading(heading) {
    const level       = parseInt(heading.tagName[1]);
    const headingText = heading.textContent.trim();
    const lines       = editor.value.split('\n');
    let charPos = 0;

    for (let i = 0; i < lines.length; i++) {
      const m = lines[i].match(/^(#+)\s+(.+)$/);
      if (m && m[1].length === level && m[2].trim() === headingText) {
        if (viewMode === 'preview') {
          viewMode = 'split';
          applyViewMode();
          saveToStorage();
        }
        editor.focus();
        editor.selectionStart = editor.selectionEnd = charPos + lines[i].length;
        scrollEditorToLine(i);
        return;
      }
      charPos += lines[i].length + 1;
    }
  }

  function scrollEditorToLine(lineIndex) {
    const cs         = window.getComputedStyle(editor);
    const lineHeight = parseFloat(cs.lineHeight) || 26;
    const paddingTop = parseFloat(cs.paddingTop) || 22;
    editor.scrollTop = Math.max(0, lineIndex * lineHeight + paddingTop - editor.clientHeight / 3);
  }

  // ── Word count ─────────────────────────────────────────────────────────────
  function updateWordCount() {
    const text  = editor.value.replace(/```[\s\S]*?```/g, '').replace(/[#*`_~\[\]()>:]/g, ' ');
    const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
    wordCountEl.textContent = `${words} word${words !== 1 ? 's' : ''}`;
  }

  // ── Filename auto-sync ─────────────────────────────────────────────────────
  function updateFilenameFromContent() {
    if (!autoFilename) return;
    const m = editor.value.match(/^#\s+(.+)$/m);
    if (m) {
      filenameInput.value = slugify(m[1]);
    }
  }

  // ── View mode ──────────────────────────────────────────────────────────────
  function applyViewMode() {
    workspace.className = 'pb-workspace mode-' + viewMode;
    document.querySelectorAll('.pb-view-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === viewMode);
    });
    if (viewMode === 'split') applySplit();
  }

  // ── Split resize ───────────────────────────────────────────────────────────
  function applySplit() {
    const editorPane  = $('pbEditorPane');
    const previewPane = $('pbPreviewPane');
    if (!editorPane || !previewPane) return;
    editorPane.style.flex  = `0 0 calc(${splitRatio * 100}% - 3px)`;
    previewPane.style.flex = `0 0 calc(${(1 - splitRatio) * 100}% - 3px)`;
  }

  function setupDragHandle() {
    const handle  = $('pbDragHandle');
    const content = $('pbContent');
    if (!handle || !content) return;

    handle.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      handle.classList.add('dragging');
      handle.setPointerCapture(e.pointerId);

      const onMove = (ev) => {
        const rect  = content.getBoundingClientRect();
        const ratio = (ev.clientX - rect.left) / rect.width;
        splitRatio  = Math.max(0.2, Math.min(0.8, ratio));
        applySplit();
      };

      const onUp = () => {
        handle.classList.remove('dragging');
        handle.removeEventListener('pointermove', onMove);
        handle.removeEventListener('pointerup', onUp);
        saveToStorage();
      };

      handle.addEventListener('pointermove', onMove);
      handle.addEventListener('pointerup', onUp);
    });
  }

  // ── Storage ────────────────────────────────────────────────────────────────
  function saveToStorage() {
    try {
      localStorage.setItem('pbMd2', JSON.stringify({
        content:    editor.value,
        filename:   filenameInput.value,
        viewMode,
        splitRatio,
        autoFilename,
      }));
    } catch (e) {}
  }

  function loadFromStorage() {
    try {
      const raw = localStorage.getItem('pbMd2');
      if (!raw) return;
      const d = JSON.parse(raw);
      if (d.content    !== undefined) editor.value       = d.content;
      if (d.filename)                 filenameInput.value = d.filename;
      if (d.viewMode)                 viewMode           = d.viewMode;
      if (d.splitRatio)               splitRatio         = d.splitRatio;
      if (d.autoFilename !== undefined) autoFilename      = d.autoFilename;
    } catch (e) {}
  }

  // ── Export ─────────────────────────────────────────────────────────────────
  function exportMarkdown() {
    const content  = editor.value.trimEnd() + '\n';
    const filename = (filenameInput.value.trim() || 'page') + '.md';
    const blob     = new Blob([content], { type: 'text/markdown; charset=utf-8' });
    const url      = URL.createObjectURL(blob);
    const a        = document.createElement('a');
    a.href         = url;
    a.download     = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Exported ${filename}`);
  }

  // ── Toast ──────────────────────────────────────────────────────────────────
  let toastTimer;
  function showToast(msg) {
    const toast = $('pbToast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('visible'), 2800);
  }

  // ── Slash command palette ──────────────────────────────────────────────────
  function openPalette(triggerPos) {
    paletteTriggerPos = triggerPos;
    paletteQuery      = '';
    paletteActiveIdx  = 0;
    renderPaletteItems();

    // Position below the caret (approximate)
    const coords = getCaretXY(editor, triggerPos);
    const rect   = editor.getBoundingClientRect();
    let top  = rect.top  + coords.top  + 22;
    let left = rect.left + coords.left;

    // Keep palette inside viewport
    const pw = 270;
    if (left + pw > window.innerWidth - 8) left = window.innerWidth - pw - 8;
    if (top + 310 > window.innerHeight - 8) top = rect.top + coords.top - 310;

    palette.style.top  = top  + 'px';
    palette.style.left = left + 'px';
    palette.classList.add('open');
    paletteOpen = true;
    paletteInput.value = '';
    paletteInput.focus();
  }

  function closePalette() {
    palette.classList.remove('open');
    paletteOpen       = false;
    paletteTriggerPos = -1;
    paletteQuery      = '';
  }

  function renderPaletteItems() {
    const q        = paletteQuery.toLowerCase();
    const filtered = ALL_BLOCKS.filter(b => !q || b.label.toLowerCase().includes(q) || b.id.includes(q));

    paletteList.innerHTML = filtered.map((b, i) => `
      <div class="pb-palette-item ${i === paletteActiveIdx ? 'active' : ''}" data-block-id="${b.id}">
        <span class="pb-palette-icon">${b.icon}</span>
        <div>
          <div class="pb-palette-name">${b.label}</div>
        </div>
      </div>
    `).join('');

    paletteList.querySelectorAll('.pb-palette-item').forEach((item, i) => {
      item.addEventListener('mousedown', (e) => {
        e.preventDefault();
        acceptPaletteItem(filtered[i]);
      });
    });

    return filtered;
  }

  function acceptPaletteItem(block) {
    if (!block) return;
    closePalette();
    // Remove the "/" trigger text from the editor
    if (paletteTriggerPos >= 0) {
      const cur = editor.selectionStart;
      editor.value = editor.value.substring(0, paletteTriggerPos) + editor.value.substring(cur);
      editor.selectionStart = editor.selectionEnd = paletteTriggerPos;
    }
    insertSnippet(block.snippet);
    editor.focus();
  }

  function checkForSlashTrigger() {
    const pos       = editor.selectionStart;
    const val       = editor.value;
    const lineStart = val.lastIndexOf('\n', pos - 1) + 1;
    const lineContent = val.substring(lineStart, pos);

    if (lineContent === '/') {
      openPalette(lineStart);
    } else if (paletteOpen && lineContent.startsWith('/')) {
      paletteQuery     = lineContent.substring(1);
      paletteActiveIdx = 0;
      renderPaletteItems();
    } else if (paletteOpen && !lineContent.startsWith('/')) {
      closePalette();
    }
  }

  // Approximate caret coordinates inside a textarea
  function getCaretXY(textarea, position) {
    const div = document.createElement('div');
    const cs  = window.getComputedStyle(textarea);
    [
      'fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'letterSpacing',
      'lineHeight', 'textTransform', 'wordSpacing', 'wordBreak', 'whiteSpace',
      'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
    ].forEach(p => { div.style[p] = cs[p]; });

    div.style.position   = 'absolute';
    div.style.visibility = 'hidden';
    div.style.overflow   = 'hidden';
    div.style.width      = textarea.clientWidth + 'px';
    div.style.height     = 'auto';
    div.style.whiteSpace = 'pre-wrap';
    div.style.wordBreak  = 'break-word';

    div.textContent = textarea.value.substring(0, position);
    const span = document.createElement('span');
    span.textContent = '|';
    div.appendChild(span);
    document.body.appendChild(div);

    const result = {
      top:  span.offsetTop  - textarea.scrollTop,
      left: span.offsetLeft - textarea.scrollLeft,
    };
    document.body.removeChild(div);
    return result;
  }

  // ── Editor smart behaviour ─────────────────────────────────────────────────
  function handleEditorKeydown(e) {
    // Palette navigation
    if (paletteOpen) {
      if (e.key === 'Escape') { e.preventDefault(); closePalette(); editor.focus(); return; }

      const filtered = ALL_BLOCKS.filter(b => {
        const q = paletteQuery.toLowerCase();
        return !q || b.label.toLowerCase().includes(q) || b.id.includes(q);
      });

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        paletteActiveIdx = (paletteActiveIdx + 1) % Math.max(filtered.length, 1);
        renderPaletteItems();
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        paletteActiveIdx = (paletteActiveIdx - 1 + Math.max(filtered.length, 1)) % Math.max(filtered.length, 1);
        renderPaletteItems();
        return;
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        acceptPaletteItem(filtered[paletteActiveIdx]);
        return;
      }
    }

    // Tab: insert 2 spaces
    if (e.key === 'Tab' && !paletteOpen) {
      e.preventDefault();
      const s = editor.selectionStart;
      const v = editor.value;
      editor.value = v.substring(0, s) + '  ' + v.substring(s);
      editor.selectionStart = editor.selectionEnd = s + 2;
      onEdit();
      return;
    }

    // Enter: smart list continuation
    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
      const pos       = editor.selectionStart;
      const val       = editor.value;
      const lineStart = val.lastIndexOf('\n', pos - 1) + 1;
      const line      = val.substring(lineStart, pos);

      // Bullet list
      const bulletMatch = line.match(/^(\s*)([-*+])\s(.+)/);
      if (bulletMatch) {
        e.preventDefault();
        const cont = '\n' + bulletMatch[1] + bulletMatch[2] + ' ';
        editor.value = val.substring(0, pos) + cont + val.substring(pos);
        editor.selectionStart = editor.selectionEnd = pos + cont.length;
        onEdit();
        return;
      }
      // Empty bullet — end list
      if (line.match(/^(\s*)([-*+])\s?$/)) {
        e.preventDefault();
        editor.value = val.substring(0, lineStart) + '\n' + val.substring(pos);
        editor.selectionStart = editor.selectionEnd = lineStart + 1;
        onEdit();
        return;
      }

      // Numbered list
      const numMatch = line.match(/^(\s*)(\d+)\.\s(.+)/);
      if (numMatch) {
        e.preventDefault();
        const next = '\n' + numMatch[1] + (parseInt(numMatch[2], 10) + 1) + '. ';
        editor.value = val.substring(0, pos) + next + val.substring(pos);
        editor.selectionStart = editor.selectionEnd = pos + next.length;
        onEdit();
        return;
      }
      // Empty numbered — end list
      if (line.match(/^(\s*)\d+\.\s?$/)) {
        e.preventDefault();
        editor.value = val.substring(0, lineStart) + '\n' + val.substring(pos);
        editor.selectionStart = editor.selectionEnd = lineStart + 1;
        onEdit();
        return;
      }
    }

    // Keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'b') { e.preventDefault(); applyFormat('bold'); }
      if (e.key === 'i') { e.preventDefault(); applyFormat('italic'); }
      if (e.key === 'k') { e.preventDefault(); applyFormat('link'); }
    }
  }

  // ── On edit ────────────────────────────────────────────────────────────────
  function onEdit() {
    updatePreview();
    updateWordCount();
    updateFilenameFromContent();
    saveToStorage();
    checkForSlashTrigger();
  }

  // ── Utility ────────────────────────────────────────────────────────────────
  function slugify(text) {
    return (text || '').toLowerCase().trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 80);
  }

  // ── Event wiring ──────────────────────────────────────────────────────────
  function setupEvents() {
    // View mode buttons
    document.querySelectorAll('.pb-view-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        viewMode = btn.dataset.view;
        applyViewMode();
        saveToStorage();
      });
    });

    // Format toolbar
    document.querySelectorAll('.pb-fmt-btn[data-action]').forEach(btn => {
      btn.addEventListener('click', () => applyFormat(btn.dataset.action));
    });

    // Load from disk
    $('pbLoadBtn').addEventListener('click', () => $('pbLoadInput').click());
    $('pbLoadInput').addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        editor.value = ev.target.result;
        filenameInput.value = file.name.replace(/\.md$/i, '');
        autoFilename = false;
        updatePreview();
        updateWordCount();
        saveToStorage();
        editor.focus();
        showToast('Loaded ' + file.name);
      };
      reader.readAsText(file);
      e.target.value = '';
    });

    // Browse existing pages
    $('pbBrowseBtn').addEventListener('click', openBrowseModal);

    // Card generator
    $('pbCardGenBtn').addEventListener('click', openCardModal);

    // Modal close buttons
    document.querySelectorAll('.pb-modal-close').forEach(btn => {
      btn.addEventListener('click', () => closeModal(btn.dataset.modal));
    });
    document.querySelectorAll('.pb-modal').forEach(modal => {
      modal.addEventListener('pointerdown', (e) => {
        if (e.target === modal) closeModal(modal.id);
      });
    });

    // Export
    $('pbExportBtn').addEventListener('click', exportMarkdown);

    // Clear
    $('pbClearBtn').addEventListener('click', () => {
      if (!editor.value.trim() || confirm('Clear all content?')) {
        editor.value       = '';
        filenameInput.value = '';
        autoFilename = true;
        updatePreview();
        updateWordCount();
        saveToStorage();
        editor.focus();
      }
    });

    // Editor events
    editor.addEventListener('input', onEdit);
    editor.addEventListener('keydown', handleEditorKeydown);
    editor.addEventListener('click', () => { if (!paletteOpen) return; checkForSlashTrigger(); });

    // Filename manual edit
    filenameInput.addEventListener('input', () => {
      autoFilename = filenameInput.value === '';
      saveToStorage();
    });

    // Palette input
    paletteInput.addEventListener('input', () => {
      paletteQuery     = paletteInput.value;
      paletteActiveIdx = 0;
      renderPaletteItems();
    });

    paletteInput.addEventListener('keydown', (e) => {
      const filtered = ALL_BLOCKS.filter(b => {
        const q = paletteQuery.toLowerCase();
        return !q || b.label.toLowerCase().includes(q) || b.id.includes(q);
      });
      if (e.key === 'Escape') { closePalette(); editor.focus(); }
      if (e.key === 'ArrowDown') { e.preventDefault(); paletteActiveIdx = (paletteActiveIdx + 1) % Math.max(filtered.length, 1); renderPaletteItems(); }
      if (e.key === 'ArrowUp')   { e.preventDefault(); paletteActiveIdx = (paletteActiveIdx - 1 + Math.max(filtered.length, 1)) % Math.max(filtered.length, 1); renderPaletteItems(); }
      if (e.key === 'Enter')     { e.preventDefault(); acceptPaletteItem(filtered[paletteActiveIdx]); }
    });

    // Close palette on outside click
    document.addEventListener('pointerdown', (e) => {
      if (paletteOpen && !palette.contains(e.target)) closePalette();
    });

    // Drag handle
    setupDragHandle();

    // Resize → re-apply split
    window.addEventListener('resize', () => { if (viewMode === 'split') applySplit(); });
  }

  // ── Modal helpers ─────────────────────────────────────────────────────────
  function closeModal(id) { $(id).hidden = true; }

  // ── Browse pages modal ────────────────────────────────────────────────────
  function openBrowseModal() {
    const modal = $('pbBrowseModal');
    const list  = $('pbBrowseList');
    const search = $('pbBrowseSearch');

    list.innerHTML = '<div class="pb-modal-loading">Loading…</div>';
    modal.hidden = false;
    search.value = '';
    search.focus();

    fetch('content/pages.json')
      .then(r => r.json())
      .then(pages => {
        let filtered = pages;

        function render() {
          const q = search.value.toLowerCase();
          filtered = q ? pages.filter(p => p.includes(q)) : pages;
          list.innerHTML = filtered.map(slug =>
            `<div class="pb-modal-item" data-slug="${slug}">${slug}</div>`
          ).join('') || '<div class="pb-modal-loading">No matches.</div>';

          list.querySelectorAll('.pb-modal-item').forEach(item => {
            item.addEventListener('click', () => loadPageFromServer(item.dataset.slug));
          });
        }

        search.addEventListener('input', render);
        render();
      })
      .catch(() => { list.innerHTML = '<div class="pb-modal-loading">Could not load page list. Run the build first.</div>'; });
  }

  function loadPageFromServer(slug) {
    fetch(`content/${slug}.md`)
      .then(r => { if (!r.ok) throw new Error(); return r.text(); })
      .then(text => {
        editor.value = text;
        filenameInput.value = slug;
        autoFilename = false;
        updatePreview();
        updateWordCount();
        saveToStorage();
        closeModal('pbBrowseModal');
        editor.focus();
        showToast('Loaded ' + slug + '.md');
      })
      .catch(() => showToast('Could not load ' + slug));
  }

  // ── Card generator modal ──────────────────────────────────────────────────
  function openCardModal() {
    const modal = $('pbCardModal');
    modal.hidden = false;
    $('cgTitle').focus();

    const inputs = ['cgTitle','cgSlug','cgDesc','cgTagLabel','cgTags','cgDownload'];
    inputs.forEach(id => $(id).addEventListener('input', renderCardPreview));

    $('cgTitle').addEventListener('input', () => {
      if (!$('cgSlug').value) {
        $('cgSlug').value = $('cgTitle').value.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
        renderCardPreview();
      }
    });

    $('cgCopyBtn').addEventListener('click', () => {
      const html = generateCardHTML();
      if (!html) return;
      navigator.clipboard.writeText(html).then(() => showToast('Copied!'));
    });

    renderCardPreview();
  }

  function generateCardHTML() {
    const title    = $('cgTitle').value.trim();
    const slug     = $('cgSlug').value.trim();
    const desc     = $('cgDesc').value.trim();
    const tagLabel = $('cgTagLabel').value.trim();
    const tags     = $('cgTags').value.trim();
    const download = $('cgDownload').value.trim();
    if (!title || !slug) return '';

    const tagsAttr  = tags || slug;
    const tagSpan   = tagLabel ? `<span class="tag">${tagLabel}</span>` : '';
    const dlLine    = download
      ? `\n          <a href="${download}" class="card-download" target="_blank" rel="noopener">Download</a>`
      : '';

    return `<div class="card" data-tags="${tagsAttr}">
  <div class="card-header">
    <div class="card-title">${title}</div>
    <div class="card-tags">${tagSpan}</div>
  </div>
  <div class="card-desc">${desc}</div>
  <div class="card-links">${dlLine}
    <a href="${slug}.html">More</a>
  </div>
</div>`;
  }

  function renderCardPreview() {
    const html = generateCardHTML();
    $('cgPreview').textContent = html || '← Fill in Title and Slug to preview.';
  }

  // ── Boot ───────────────────────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
