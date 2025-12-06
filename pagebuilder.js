// KindleModShelf Page Builder
// Professional page builder with rich text editor

class PageBuilder {
  constructor() {
    this.blocks = [];
    this.selectedBlockId = null;
    this.selectedPart = null;
    this.meta = {
      h1Title: 'Untitled Page',
      pageTitle: 'Untitled Page – KindleModShelf',
      summary: '', // New field for the visual header description
      description: 'A Kindle modding guide',
      keywords: 'kindle, mods, guide'
    };

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.renderPreview();
    this.loadMetaFromForm();
  }

  setupEventListeners() {
    // Block palette buttons
    document.querySelectorAll('.builder-add-block').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const type = e.target.dataset.blockType;
        this.addBlock(type);
      });
    });

    // Meta form
    document.getElementById('metaForm').addEventListener('input', () => {
      this.loadMetaFromForm();
      this.renderPreview();
    });

    // Toolbar buttons
    document.getElementById('exportBtn').addEventListener('click', () => this.exportHTML());
    document.getElementById('clearAllBtn').addEventListener('click', () => this.showClearConfirmation());

    // Preview click handler
    const previewEl = document.getElementById('preview');
    previewEl.addEventListener('click', (e) => {
      if (e.target.closest('.builder-block-control-btn')) return;

      const h1 = e.target.closest('h1');
      if (h1 && e.target === h1) {
        this.selectPageTitle();
        return;
      }

      const wrapper = e.target.closest('.builder-block-wrapper');
      if (!wrapper) {
        this.deselectAll();
        return;
      }

      e.stopPropagation();
      const blockId = wrapper.dataset.blockId;

      if (this.selectedBlockId === blockId) {
        // Already selected - check for part click
        const editableEl = e.target.closest('[data-editable-part]');
        if (editableEl) {
          this.selectBlockPart(blockId, editableEl.dataset.editablePart);
          return;
        }
        const listItem = e.target.closest('.builder-list-item-editable');
        if (listItem) {
          this.selectListItem(blockId, parseInt(listItem.dataset.itemId));
          return;
        }
      } else {
        this.selectBlock(blockId);
      }
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('#preview') && !e.target.closest('.builder-sidebar')) {
        this.deselectAll();
      }
    });
  }

  addBlock(type) {
    const id = 'block-' + Date.now() + Math.random().toString(36).substr(2, 9);
    const block = this.createBlockTemplate(type, id);
    this.blocks.push(block);
    this.renderPreview();
    this.selectBlock(id);
  }

  createBlockTemplate(type, id) {
    const templates = {
      summary: {
        id, type,
        properties: { content: 'Click to edit this summary text.' }
      },
      section: {
        id, type,
        properties: { title: 'Section Title', content: '<p>Section content goes here.</p>' }
      },
      list: {
        id, type,
        properties: {
          listType: 'ul',
          items: [
            { id: Date.now() + 1, content: 'First item' },
            { id: Date.now() + 2, content: 'Second item' },
            { id: Date.now() + 3, content: 'Third item' }
          ]
        }
      },
      text: {
        id, type,
        properties: { content: '<p>Text content with rich formatting support.</p>' }
      },
      video: {
        id, type,
        properties: { videoId: '', title: 'Video' }
      },
      code: {
        id, type,
        properties: { content: 'your code here' }
      },
      banner: {
        id, type,
        properties: { content: 'Important notice or information', bannerType: 'info' }
      },
      credit: {
        id, type,
        properties: { content: 'Credit: Author Name' }
      }
    };
    return templates[type];
  }

  deselectAll() {
    document.querySelectorAll('.builder-block-wrapper.selected').forEach(el => {
      el.classList.remove('selected');
    });
    this.selectedBlockId = null;
    this.selectedPart = null;
    this.clearBlockProperties();
  }

  selectBlock(blockId) {
    document.querySelectorAll('.builder-block-wrapper.selected').forEach(el => {
      el.classList.remove('selected');
    });

    if (blockId) {
      const wrapper = document.querySelector(`[data-block-id="${blockId}"]`);
      if (wrapper) {
        wrapper.classList.add('selected');
        this.selectedBlockId = blockId;
        this.selectedPart = null;
        this.showBlockOverview(blockId);
      }
    }
  }

  selectBlockPart(blockId, part) {
    this.selectedBlockId = blockId;
    this.selectedPart = part;
    this.showPartEditor(blockId, part);
  }

  selectListItem(blockId, itemId) {
    this.selectedBlockId = blockId;
    this.selectedPart = `item-${itemId}`;
    this.showPartEditor(blockId, `item-${itemId}`);
  }

  selectPageTitle() {
    this.selectedBlockId = 'page-title';
    this.selectedPart = 'title';
    this.showPageTitleEditor();
  }

  showBlockOverview(blockId) {
    const block = this.blocks.find(b => b.id === blockId);
    if (!block) return;

    const panel = document.getElementById('propertiesPanel');
    panel.classList.remove('builder-properties-empty');

    const typeNames = {
      summary: 'Summary', section: 'Section', list: 'List', text: 'Text',
      video: 'Video', code: 'Code', banner: 'Banner', credit: 'Credit'
    };

    let html = `<div class="builder-properties-form">
      <div class="builder-block-type-header">${typeNames[block.type]}</div>
      <p class="builder-help-text">Click highlighted areas in preview to edit</p>`;

    // Block-specific settings
    if (block.type === 'list') {
      html += `
        <div class="form-group">
          <label>List Style</label>
          <select id="listType" class="builder-select">
            <option value="ul" ${block.properties.listType === 'ul' ? 'selected' : ''}>Bullet Points</option>
            <option value="ol" ${block.properties.listType === 'ol' ? 'selected' : ''}>Numbered</option>
          </select>
        </div>
        <button type="button" class="builder-secondary-btn builder-add-list-item">+ Add Item</button>`;
    } else if (block.type === 'video') {
      html += `
        <div class="form-group">
          <label>YouTube Video ID or URL</label>
          <input type="text" id="videoUrl" class="builder-input" value="${this.escapeHtml(block.properties.videoId)}" placeholder="dQw4w9WgXcQ or full URL">
        </div>`;
    } else if (block.type === 'banner') {
      html += `
        <div class="form-group">
          <label>Banner Style</label>
          <select id="bannerType" class="builder-select">
            <option value="info" ${block.properties.bannerType === 'info' ? 'selected' : ''}>Info (Blue)</option>
            <option value="success" ${block.properties.bannerType === 'success' ? 'selected' : ''}>Success (Green)</option>
            <option value="danger" ${block.properties.bannerType === 'danger' ? 'selected' : ''}>Danger (Red)</option>
          </select>
        </div>`;
    }

    html += `<button type="button" class="builder-apply-btn">Apply</button></div>`;
    panel.innerHTML = html;
    this.setupOverviewHandlers(block);
  }

  showPartEditor(blockId, part) {
    const block = this.blocks.find(b => b.id === blockId);
    if (!block) return;

    const panel = document.getElementById('propertiesPanel');
    panel.classList.remove('builder-properties-empty');

    let content = '';
    let editorType = 'rich'; // rich, plain, or title

    if (part.startsWith('item-')) {
      const itemId = parseInt(part.split('-')[1]);
      const item = block.properties.items?.find(i => i.id === itemId);
      content = item?.content || '';
      editorType = 'plain';
    } else if (part === 'title') {
      content = block.properties.title || '';
      editorType = block.type === 'section' ? 'rich' : 'title';
    } else if (part === 'content') {
      content = block.properties.content || '';
      editorType = block.type === 'code' ? 'code' : 'rich';
    }

    let html = `<div class="builder-properties-form">
      <div class="builder-part-header">${this.getPartLabel(part, block.type)}</div>`;

    if (editorType === 'rich') {
      html += this.getRichEditor(content);
    } else if (editorType === 'code') {
      html += `<textarea id="codeEditor" class="builder-code-editor">${this.escapeHtml(content)}</textarea>`;
    } else if (editorType === 'title') {
      html += `<input type="text" id="titleEditor" class="builder-title-input" value="${this.escapeHtml(content)}">`;
    } else {
      html += `<input type="text" id="plainEditor" class="builder-input" value="${this.escapeHtml(content)}">`;
    }

    html += `<button type="button" class="builder-apply-btn">Apply</button></div>`;
    panel.innerHTML = html;
    this.setupPartEditorHandlers(block, part, editorType);

    // Focus
    setTimeout(() => {
      const editor = panel.querySelector('#richEditor, #codeEditor, #titleEditor, #plainEditor');
      if (editor) editor.focus();
    }, 50);
  }

  showPageTitleEditor() {
    const panel = document.getElementById('propertiesPanel');
    panel.classList.remove('builder-properties-empty');

    const content = this.meta.h1Title;
    let html = `<div class="builder-properties-form">
      <div class="builder-part-header">Edit Page Title</div>
      <input type="text" id="titleEditor" class="builder-title-input" value="${this.escapeHtml(content)}">
      <button type="button" class="builder-apply-btn">Apply</button>
    </div>`;

    panel.innerHTML = html;

    const applyBtn = panel.querySelector('.builder-apply-btn');
    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        const editor = document.getElementById('titleEditor');
        const newValue = editor ? editor.value : '';
        this.meta.h1Title = newValue;
        this.meta.pageTitle = newValue + ' – KindleModShelf';
        document.getElementById('pageTitle').value = newValue;
        this.renderPreview();
      });
    }

    setTimeout(() => {
      const editor = panel.querySelector('#titleEditor');
      if (editor) editor.focus();
    }, 50);
  }

  getPartLabel(part, blockType) {
    if (part.startsWith('item-')) return 'Edit List Item';
    if (part === 'title') return 'Edit Title';
    if (part === 'content') {
      if (blockType === 'code') return 'Edit Code';
      if (blockType === 'banner') return 'Edit Banner Text';
      if (blockType === 'credit') return 'Edit Credit';
      return 'Edit Content';
    }
    return 'Edit';
  }

  getRichEditor(content) {
    return `
      <div class="builder-editor">
        <div class="builder-editor-toolbar">
          <select class="builder-toolbar-select" id="formatBlock">
            <option value="">Format</option>
            <option value="p">Paragraph</option>
            <option value="h3">Heading</option>
          </select>
          <div class="builder-toolbar-group">
            <button type="button" class="builder-toolbar-btn" data-cmd="bold" title="Bold"><b>B</b></button>
            <button type="button" class="builder-toolbar-btn" data-cmd="italic" title="Italic"><i>I</i></button>
            <button type="button" class="builder-toolbar-btn" data-cmd="underline" title="Underline"><u>U</u></button>
          </div>
          <div class="builder-toolbar-group">
            <button type="button" class="builder-toolbar-btn" data-cmd="insertUnorderedList" title="Bullet List">•</button>
            <button type="button" class="builder-toolbar-btn" data-cmd="insertOrderedList" title="Numbered List">1.</button>
          </div>
          <div class="builder-toolbar-group">
            <button type="button" class="builder-toolbar-btn" data-cmd="createLink" title="Insert Link">🔗</button>
            <button type="button" class="builder-toolbar-btn" data-cmd="unlink" title="Remove Link">⛓</button>
          </div>
          <select class="builder-toolbar-select" id="textAlign">
            <option value="">Align</option>
            <option value="justifyLeft">Left</option>
            <option value="justifyCenter">Center</option>
            <option value="justifyRight">Right</option>
          </select>
        </div>
        <div id="richEditor" class="builder-editor-content" contenteditable="true">${content}</div>
      </div>`;
  }

  setupOverviewHandlers(block) {
    const listTypeSelect = document.getElementById('listType');
    if (listTypeSelect) {
      listTypeSelect.addEventListener('change', () => {
        block.properties.listType = listTypeSelect.value;
      });
    }

    const videoInput = document.getElementById('videoUrl');
    if (videoInput) {
      videoInput.addEventListener('input', () => {
        block.properties.videoId = videoInput.value;
      });
    }

    const bannerTypeSelect = document.getElementById('bannerType');
    if (bannerTypeSelect) {
      bannerTypeSelect.addEventListener('change', () => {
        block.properties.bannerType = bannerTypeSelect.value;
      });
    }

    const addItemBtn = document.querySelector('.builder-add-list-item');
    if (addItemBtn) {
      addItemBtn.addEventListener('click', () => {
        this.addListItem(block.id);
        this.renderPreview();
        this.selectBlock(block.id);
      });
    }

    const applyBtn = document.querySelector('.builder-apply-btn');
    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        this.renderPreview();
        this.selectBlock(block.id);
      });
    }
  }

  setupPartEditorHandlers(block, part, editorType) {
    // Rich editor toolbar
    document.querySelectorAll('.builder-toolbar-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const cmd = btn.dataset.cmd;
        if (cmd === 'createLink') {
          const url = prompt('Enter URL:', 'https://');
          if (url) document.execCommand('createLink', false, url);
        } else {
          document.execCommand(cmd, false, null);
        }
      });
    });

    const formatSelect = document.getElementById('formatBlock');
    if (formatSelect) {
      formatSelect.addEventListener('change', () => {
        if (formatSelect.value) {
          document.execCommand('formatBlock', false, formatSelect.value);
          formatSelect.value = '';
        }
      });
    }

    const alignSelect = document.getElementById('textAlign');
    if (alignSelect) {
      alignSelect.addEventListener('change', () => {
        if (alignSelect.value) {
          document.execCommand(alignSelect.value, false, null);
          alignSelect.value = '';
        }
      });
    }

    // Apply button
    const applyBtn = document.querySelector('.builder-apply-btn');
    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        let newValue = '';

        if (editorType === 'rich') {
          const editor = document.getElementById('richEditor');
          newValue = editor ? editor.innerHTML : '';
        } else if (editorType === 'code') {
          const editor = document.getElementById('codeEditor');
          newValue = editor ? editor.value : '';
        } else if (editorType === 'title') {
          const editor = document.getElementById('titleEditor');
          newValue = editor ? editor.value : '';
        } else {
          const editor = document.getElementById('plainEditor');
          newValue = editor ? editor.value : '';
        }

        // Save the value
        if (part.startsWith('item-')) {
          const itemId = parseInt(part.split('-')[1]);
          this.updateListItem(block.id, itemId, newValue);
        } else if (part === 'title') {
          block.properties.title = newValue;
        } else if (part === 'content') {
          block.properties.content = newValue;
        }

        this.renderPreview();
        this.selectBlock(block.id);
      });
    }
  }

  updateListItem(blockId, itemId, content) {
    const block = this.blocks.find(b => b.id === blockId);
    if (block?.properties.items) {
      const item = block.properties.items.find(i => i.id === itemId);
      if (item) item.content = content;
    }
  }

  addListItem(blockId) {
    const block = this.blocks.find(b => b.id === blockId);
    if (block?.properties.items) {
      block.properties.items.push({ id: Date.now(), content: 'New item' });
    }
  }

  clearBlockProperties() {
    const panel = document.getElementById('propertiesPanel');
    panel.innerHTML = '<p>Select a block to edit</p>';
    panel.classList.add('builder-properties-empty');
  }

  loadMetaFromForm() {
    this.meta.h1Title = document.getElementById('pageTitle').value || 'Untitled Page';
    this.meta.pageTitle = this.meta.h1Title + ' – KindleModShelf';
    this.meta.summary = document.getElementById('headerDescription').value || '';
    this.meta.description = document.getElementById('metaDescription').value || 'A Kindle modding guide';
    this.meta.keywords = document.getElementById('keywords').value || '';
  }

  renderPreview() {
    const preview = document.getElementById('preview');
    preview.innerHTML = this.generatePreviewHTML();

    // Setup controls
    document.querySelectorAll('.builder-block-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.deleteBlock(btn.dataset.blockId);
      });
    });

    document.querySelectorAll('.builder-block-moveup').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.moveBlockUp(btn.dataset.blockId);
      });
    });

    document.querySelectorAll('.builder-block-movedown').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.moveBlockDown(btn.dataset.blockId);
      });
    });

    // Re-select if needed
    if (this.selectedBlockId) {
      const wrapper = document.querySelector(`[data-block-id="${this.selectedBlockId}"]`);
      if (wrapper) wrapper.classList.add('selected');
    }
  }

  generatePreviewHTML() {
    let html = '<div class="container">';
    html += `<h1>${this.escapeHtml(this.meta.h1Title)}</h1>`;

    // Render the visual Header Description (Summary)
    if (this.meta.summary) {
      html += `<div class="summary">${this.escapeHtml(this.meta.summary)}</div>`;
    }

    this.blocks.forEach(block => {
      html += `<div class="builder-block-wrapper" data-block-id="${block.id}">
        <div class="builder-block-controls">
          <button class="builder-block-control-btn builder-block-moveup" data-block-id="${block.id}" title="Move up">↑</button>
          <button class="builder-block-control-btn builder-block-movedown" data-block-id="${block.id}" title="Move down">↓</button>
          <button class="builder-block-control-btn delete builder-block-delete" data-block-id="${block.id}" title="Delete">×</button>
        </div>
        ${this.renderBlock(block)}
      </div>`;
    });

    html += '</div>';
    return html;
  }

  renderBlock(block) {
    const { type, properties } = block;

    switch (type) {
      case 'summary':
        return `<div class="summary" data-editable-part="content">${properties.content}</div>`;

      case 'section':
        return `
          <h2 class="section-title" data-editable-part="title">${properties.title}</h2>
          <div class="card card-desc" data-editable-part="content">${properties.content}</div>`;

      case 'list':
        const tag = properties.listType || 'ul';
        const items = (properties.items || []).map(item =>
          `<li class="builder-list-item-editable" data-item-id="${item.id}">${this.escapeHtml(item.content)}</li>`
        ).join('');
        return `<${tag} class="builder-list" data-editable-part="list">${items}</${tag}>`;

      case 'text':
        return `<div class="card card-desc" data-editable-part="content">${properties.content}</div>`;

      case 'video':
        const videoId = this.extractYouTubeId(properties.videoId);
        if (!videoId) {
          return `<div class="builder-video-placeholder" data-editable-part="video">
            <p>Enter YouTube ID in properties panel →</p>
          </div>`;
        }
        return `<div class="responsive-video" data-editable-part="video">
          <iframe src="https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1"
            title="${this.escapeHtml(properties.title)}" frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            sandbox="allow-same-origin allow-scripts allow-presentation"
            allowfullscreen></iframe>
        </div>`;

      case 'code':
        return `<div class="card card-desc"><pre data-editable-part="content"><code>${this.escapeHtml(properties.content)}</code></pre></div>`;

      case 'banner':
        return `<div class="banner banner-${properties.bannerType || 'info'}" data-editable-part="content">${properties.content}</div>`;

      case 'credit':
        return `<p class="builder-credit" data-editable-part="content">${properties.content}</p>`;

      default:
        return '<p>Unknown block</p>';
    }
  }

  deleteBlock(blockId) {
    this.blocks = this.blocks.filter(b => b.id !== blockId);
    if (this.selectedBlockId === blockId) {
      this.selectedBlockId = null;
      this.selectedPart = null;
      this.clearBlockProperties();
    }
    this.renderPreview();
  }

  moveBlockUp(blockId) {
    const idx = this.blocks.findIndex(b => b.id === blockId);
    if (idx > 0) {
      [this.blocks[idx], this.blocks[idx - 1]] = [this.blocks[idx - 1], this.blocks[idx]];
      this.renderPreview();
    }
  }

  moveBlockDown(blockId) {
    const idx = this.blocks.findIndex(b => b.id === blockId);
    if (idx < this.blocks.length - 1) {
      [this.blocks[idx], this.blocks[idx + 1]] = [this.blocks[idx + 1], this.blocks[idx]];
      this.renderPreview();
    }
  }

  showClearConfirmation() {
    if (this.blocks.length === 0) return;
    if (confirm('Delete all blocks?')) {
      this.blocks = [];
      this.selectedBlockId = null;
      this.selectedPart = null;
      this.clearBlockProperties();
      this.renderPreview();
    }
  }

  exportHTML() {
    const html = this.generateExportHTML();
    const filename = this.getExportFilename();

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    const notification = document.getElementById('copyNotification');
    notification.textContent = `Exported ${filename}`;
    notification.style.display = 'block';
    setTimeout(() => notification.style.display = 'none', 3000);
  }

  generateExportHTML() {
    let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${this.escapeHtml(this.meta.pageTitle)}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${this.escapeHtml(this.meta.description)}">
  <link rel="canonical" href="https://kindlemodshelf.me/${this.getExportFilename()}">
  <link rel="stylesheet" href="style.css">
  <meta property="og:title" content="${this.escapeHtml(this.meta.h1Title)}">
  <meta property="og:description" content="${this.escapeHtml(this.meta.description)}">
  <meta property="og:url" content="https://kindlemodshelf.me/${this.getExportFilename()}">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="KindleModShelf">`;

    if (this.meta.keywords) {
      html += `\n  <meta name="keywords" content="${this.escapeHtml(this.meta.keywords)}">`;
    }

    html += `
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@500;700&display=swap" rel="stylesheet">
  <script src="theme-toggle.js"></script>
</head>
<body>
  <div class="container">
    <a href="index.html" class="back-home-btn" aria-label="Back to Home">← Back to Home</a>
    <h1>${this.escapeHtml(this.meta.h1Title)}</h1>
`;

    // Render the visual Header Description (Summary) in export
    if (this.meta.summary) {
      html += `\n    <div class="summary">${this.escapeHtml(this.meta.summary)}</div>`;
    }

    this.blocks.forEach(block => {
      html += '\n    ' + this.renderBlockForExport(block);
    });

    html += `
  </div>
  <footer class="legal-disclaimer">Educational purposes only. Not affiliated with Amazon. Users responsible for compliance with applicable laws.</footer>
</body>
</html>`;

    return html;
  }

  renderBlockForExport(block) {
    const { type, properties } = block;

    switch (type) {
      case 'summary':
        return `<div class="summary">${properties.content}</div>`;

      case 'section':
        return `<h2 class="section-title">${properties.title}</h2>
    <div class="card card-desc">${properties.content}</div>`;

      case 'list':
        const tag = properties.listType || 'ul';
        const items = (properties.items || []).map(i => `<li>${this.escapeHtml(i.content)}</li>`).join('\n      ');
        return `<${tag}>
      ${items}
    </${tag}>`;

      case 'text':
        return `<div class="card card-desc">${properties.content}</div>`;

      case 'video':
        const videoId = this.extractYouTubeId(properties.videoId);
        if (!videoId) return '';
        return `<div class="responsive-video">
      <iframe src="https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1"
        title="${this.escapeHtml(properties.title)}" frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        sandbox="allow-same-origin allow-scripts allow-presentation"
        allowfullscreen></iframe>
    </div>`;

      case 'code':
        return `<div class="card card-desc">
      <pre><code>${this.escapeHtml(properties.content)}</code></pre>
    </div>`;

      case 'banner':
        return `<div class="banner banner-${properties.bannerType || 'info'}">${properties.content}</div>`;

      case 'credit':
        return `<p class="credit">${properties.content}</p>`;

      default:
        return '';
    }
  }

  getExportFilename() {
    const slug = this.meta.h1Title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').substring(0, 50);
    return slug ? `${slug}.html` : 'page.html';
  }

  extractYouTubeId(input) {
    if (!input) return null;
    if (/^[a-zA-Z0-9_-]{11}$/.test(input)) return input;
    const match = input.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
    return match?.[1] || null;
  }

  escapeHtml(text) {
    if (!text) return '';
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return text.toString().replace(/[&<>"']/g, m => map[m]);
  }
}

document.addEventListener('DOMContentLoaded', () => new PageBuilder());