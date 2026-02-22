// KindleModShelf Page Builder
// Professional page builder with rich text editor

class PageBuilder {
  constructor() {
    this.blocks = [];
    this.selectedBlockId = null;
    this.selectedPart = null;
    this.meta = this.getDefaultMeta();
    this.history = [];
    this.pendingMetaSnapshot = null;
    this.pendingOverviewSnapshot = null;
    this.pendingPartSnapshot = null;
    this.pendingTitleSnapshot = null;

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadFromLocalStorage();
    this.renderPreview();
    this.loadMetaFromForm();
    this.updateBackButton();
  }

  getDefaultMeta() {
    return {
      h1Title: 'Untitled Page',
      pageTitle: 'Untitled Page',
      summary: '',
      description: 'A Kindle modding guide',
      keywords: 'kindle, mods, guide'
    };
  }

  serializeState() {
    return JSON.stringify({
      meta: this.meta,
      blocks: this.blocks,
      ui: {
        selectedBlockId: this.selectedBlockId,
        selectedPart: this.selectedPart
      }
    });
  }

  pushSnapshot(snapshot) {
    if (!snapshot) return;
    const current = this.serializeState();
    if (snapshot === current) return;

    const last = this.history[this.history.length - 1];
    if (last !== snapshot) {
      this.history.push(snapshot);
      if (this.history.length > 100) {
        this.history.shift();
      }
    }

    this.updateBackButton();
  }

  applyStateSnapshot(snapshot) {
    let restoredUi = null;
    try {
      const data = JSON.parse(snapshot);
      this.meta = data.meta || this.getDefaultMeta();
      this.blocks = Array.isArray(data.blocks) ? data.blocks : [];
      restoredUi = data.ui || null;
    } catch (e) {
      return;
    }

    document.getElementById('pageTitle').value = this.meta.h1Title || '';
    document.getElementById('headerDescription').value = this.meta.summary || '';
    document.getElementById('metaDescription').value = this.meta.description || '';
    document.getElementById('keywords').value = this.meta.keywords || '';

    this.selectedBlockId = null;
    this.selectedPart = null;
    this.pendingMetaSnapshot = null;
    this.pendingOverviewSnapshot = null;
    this.pendingPartSnapshot = null;
    this.pendingTitleSnapshot = null;
    this.renderPreview();

    if (restoredUi && restoredUi.selectedBlockId) {
      if (restoredUi.selectedBlockId === 'page-title') {
        this.selectPageTitle();
      } else if (restoredUi.selectedPart && restoredUi.selectedPart.startsWith('item-')) {
        const itemId = parseInt(restoredUi.selectedPart.split('-')[1], 10);
        if (!Number.isNaN(itemId)) {
          this.selectListItem(restoredUi.selectedBlockId, itemId);
        } else {
          this.selectBlock(restoredUi.selectedBlockId);
        }
      } else if (restoredUi.selectedPart) {
        this.selectBlockPart(restoredUi.selectedBlockId, restoredUi.selectedPart);
      } else {
        this.selectBlock(restoredUi.selectedBlockId);
      }
    } else {
      this.clearBlockProperties();
    }

    this.saveToLocalStorage();
  }

  undoLastEdit() {
    if (this.history.length === 0) return;
    const previous = this.history.pop();
    this.applyStateSnapshot(previous);
    this.updateBackButton();
  }

  updateBackButton() {
    const backBtn = document.getElementById('backBtn');
    if (!backBtn) return;
    backBtn.disabled = this.history.length === 0;
  }

  saveToLocalStorage() {
    const data = {
      meta: this.meta,
      blocks: this.blocks
    };
    try { localStorage.setItem('kindlePageBuilderData', JSON.stringify(data)); } catch(e) { console.warn('Could not save to localStorage:', e); }
  }

  loadFromLocalStorage() {
    let saved;
    try { saved = localStorage.getItem('kindlePageBuilderData'); } catch(e) { console.warn('Could not read from localStorage:', e); }
    if (saved) {
      try {
        const data = JSON.parse(saved);
        this.meta = data.meta || this.meta;
        this.blocks = data.blocks || [];

        // Restore form values
        document.getElementById('pageTitle').value = this.meta.h1Title || '';
        document.getElementById('headerDescription').value = this.meta.summary || '';
        document.getElementById('metaDescription').value = this.meta.description || '';
        document.getElementById('keywords').value = this.meta.keywords || '';
      } catch (e) {
        console.error('Failed to load from local storage:', e);
      }
    }
  }

  clearLocalStorage() {
    if (confirm('Clear all saved data? This will remove the draft you are working on.')) {
      this.pushSnapshot(this.serializeState());
      try { localStorage.removeItem('kindlePageBuilderData'); } catch(e) {}
      this.blocks = [];
      this.meta = this.getDefaultMeta();
      document.getElementById('pageTitle').value = '';
      document.getElementById('headerDescription').value = '';
      document.getElementById('metaDescription').value = '';
      document.getElementById('keywords').value = '';
      this.selectedBlockId = null;
      this.selectedPart = null;
      this.clearBlockProperties();
      this.renderPreview();
      this.updateBackButton();
    }
  }

  setupEventListeners() {
    // Block palette buttons
    document.querySelectorAll('.builder-add-block').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const type = e.currentTarget.dataset.blockType;
        this.addBlock(type);
      });
    });

    // Meta form
    const metaForm = document.getElementById('metaForm');
    metaForm.addEventListener('focusin', () => {
      if (!this.pendingMetaSnapshot) {
        this.pendingMetaSnapshot = this.serializeState();
      }
    });

    metaForm.addEventListener('focusout', (e) => {
      const next = e.relatedTarget;
      if (next && metaForm.contains(next)) return;
      this.pushSnapshot(this.pendingMetaSnapshot);
      this.pendingMetaSnapshot = null;
    });

    metaForm.addEventListener('input', () => {
      this.loadMetaFromForm();
      this.renderPreview();
      this.saveToLocalStorage();
    });

    // Toolbar buttons
    document.getElementById('backBtn').addEventListener('click', () => this.undoLastEdit());
    document.getElementById('exportBtn').addEventListener('click', () => this.exportHTML());
    document.getElementById('clearAllBtn').addEventListener('click', () => this.showClearConfirmation());
    document.getElementById('clearStorageBtn').addEventListener('click', () => this.clearLocalStorage());

    // Preview click handler
    const previewEl = document.getElementById('preview');
    previewEl.addEventListener('click', (e) => {
      const target = e.target && e.target.nodeType === Node.ELEMENT_NODE
        ? e.target
        : e.target.parentElement;
      if (!target) return;

      if (target.closest('.builder-block-control-btn')) return;

      const h1 = target.closest('h1');
      if (h1 && target === h1) {
        this.selectPageTitle();
        return;
      }

      const wrapper = target.closest('.builder-block-wrapper');
      if (!wrapper) {
        this.deselectAll();
        return;
      }

      e.stopPropagation();
      const blockId = wrapper.dataset.blockId;

      if (this.selectedBlockId === blockId) {
        const listItem = target.closest('.builder-list-item-editable');
        if (listItem) {
          this.selectListItem(blockId, parseInt(listItem.dataset.itemId, 10));
          return;
        }

        // Already selected - check for part click
        const editableEl = target.closest('[data-editable-part]');
        if (editableEl) {
          const part = editableEl.dataset.editablePart;
          const block = this.blocks.find(b => b.id === blockId);

          if (block && this.shouldEditPartInline(block, part)) {
            this.selectBlockPart(blockId, part);
          } else {
            this.selectBlock(blockId);
          }
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

    document.addEventListener('keydown', (e) => {
      if (!((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'z')) {
        return;
      }

      const active = document.activeElement;
      const isTypingField = active && (
        active.tagName === 'INPUT' ||
        active.tagName === 'TEXTAREA' ||
        active.tagName === 'SELECT' ||
        active.isContentEditable
      );

      if (isTypingField) return;

      e.preventDefault();
      this.undoLastEdit();
    });
  }

  shouldEditPartInline(block, part) {
    if (!block || !part) return false;

    const inlinePartsByType = {
      summary: new Set(['content']),
      section: new Set(['title', 'content']),
      text: new Set(['content']),
      list: new Set(),
      video: new Set(),
      code: new Set(['content']),
      banner: new Set(['content']),
      credit: new Set(['content'])
    };

    const allowedParts = inlinePartsByType[block.type] || new Set();
    return allowedParts.has(part);
  }

  addBlock(type) {
    this.pushSnapshot(this.serializeState());
    const id = 'block-' + Date.now() + Math.random().toString(36).substring(2, 11);
    const block = this.createBlockTemplate(type, id);
    if (!block) return;
    this.blocks.push(block);
    this.renderPreview();
    this.saveToLocalStorage();
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
        properties: { content: 'Credits: <a href="https://github.com/username">Author Name</a>' }
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

    if (!blockId) return;

    const block = this.blocks.find(b => b.id === blockId);
    if (!block) {
      this.deselectAll();
      return;
    }

    const wrapper = document.querySelector(`[data-block-id="${blockId}"]`);
    if (wrapper) {
      wrapper.classList.add('selected');
    }

    this.selectedBlockId = blockId;
    this.selectedPart = null;
    this.showBlockOverview(blockId);
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
    this.pendingOverviewSnapshot = this.serializeState();
    this.setupOverviewHandlers(block);

    if (block.type === 'list') {
      const help = panel.querySelector('.builder-help-text');
      if (help) {
        help.textContent = 'Click a bullet item in preview to edit its text';
      }
    }
  }

  showPartEditor(blockId, part) {
    const block = this.blocks.find(b => b.id === blockId);
    if (!block) return;

    if (!this.shouldEditPartInline(block, part) && !part.startsWith('item-')) {
      this.showBlockOverview(blockId);
      return;
    }

    const panel = document.getElementById('propertiesPanel');
    panel.classList.remove('builder-properties-empty');

    let content = '';
    let editorType = 'rich'; // rich, plain, or title

    if (part.startsWith('item-')) {
      const itemId = parseInt(part.split('-')[1]);
      const item = block.properties.items?.find(i => i.id === itemId);
      content = item?.content || '';
      editorType = 'list-item';
    } else if (part === 'title') {
      content = block.properties.title || '';
      editorType = block.type === 'section' ? 'rich' : 'title';
    } else if (part === 'content') {
      content = block.properties.content || '';
      if (block.type === 'code') {
        editorType = 'code';
      } else if (block.type === 'credit') {
        editorType = 'rich';
      } else {
        editorType = 'rich';
      }
    }

    const blockTypeLabel = this.getBlockTypeLabel(block.type);
    let html = `<div class="builder-properties-form">
      <button type="button" class="builder-secondary-btn builder-panel-back">Back to ${blockTypeLabel}</button>
      <div class="builder-part-header">${this.getPartLabel(part, block.type)}</div>`;

    if (editorType === 'rich') {
      html += this.getRichEditor(content);
    } else if (editorType === 'code') {
      html += `<textarea id="codeEditor" class="builder-code-editor">${this.escapeHtml(content)}</textarea>`;
    } else if (editorType === 'list-item') {
      html += `<textarea id="plainEditor" class="builder-code-editor" rows="6">${this.escapeHtml(content)}</textarea>`;
    } else if (editorType === 'title') {
      html += `<input type="text" id="titleEditor" class="builder-title-input" value="${this.escapeHtml(content)}">`;
    } else {
      html += `<input type="text" id="plainEditor" class="builder-input" value="${this.escapeHtml(content)}">`;
    }

    html += `<button type="button" class="builder-apply-btn">Apply</button></div>`;
    panel.innerHTML = html;
    this.pendingPartSnapshot = this.serializeState();

    const panelBackBtn = panel.querySelector('.builder-panel-back');
    if (panelBackBtn) {
      panelBackBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.selectBlock(blockId);
      });
    }

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
    this.pendingTitleSnapshot = this.serializeState();

    const applyBtn = panel.querySelector('.builder-apply-btn');
    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        this.pushSnapshot(this.pendingTitleSnapshot);
        this.pendingTitleSnapshot = null;

        const editor = document.getElementById('titleEditor');
        const newValue = editor ? editor.value : '';
        this.meta.h1Title = newValue;
        this.meta.pageTitle = newValue;
        document.getElementById('pageTitle').value = newValue;
        this.renderPreview();
        this.saveToLocalStorage();
      });
    }

    setTimeout(() => {
      const editor = panel.querySelector('#titleEditor');
      if (editor) editor.focus();
    }, 50);
  }

  getPartLabel(part, blockType) {
    if (part.startsWith('item-')) return 'Edit List Item Text';
    if (part === 'title') return 'Edit Title';
    if (part === 'content') {
      if (blockType === 'code') return 'Edit Code';
      if (blockType === 'banner') return 'Edit Banner Text';
      if (blockType === 'credit') return 'Edit Credits (HTML allowed)';
      return 'Edit Content';
    }
    return 'Edit';
  }

  getBlockTypeLabel(blockType) {
    const names = {
      summary: 'Summary',
      section: 'Section',
      list: 'List',
      text: 'Text',
      video: 'Video',
      code: 'Code',
      banner: 'Banner',
      credit: 'Credit'
    };
    return names[blockType] || 'Block';
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
        this.pushSnapshot(this.pendingOverviewSnapshot);
        this.addListItem(block.id);
        this.renderPreview();
        this.saveToLocalStorage();
        this.selectBlock(block.id);
      });
    }

    const applyBtn = document.querySelector('.builder-apply-btn');
    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        this.pushSnapshot(this.pendingOverviewSnapshot);
        this.pendingOverviewSnapshot = null;
        this.renderPreview();
        this.saveToLocalStorage();
        this.selectBlock(block.id);
      });
    }
  }

  setupPartEditorHandlers(block, part, editorType) {
    const richEditor = document.getElementById('richEditor');
    let savedRange = null;

    const saveSelection = () => {
      if (!richEditor) return;
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;
      const range = sel.getRangeAt(0);
      if (richEditor.contains(range.commonAncestorContainer)) {
        savedRange = range.cloneRange();
      }
    };

    const restoreSelection = () => {
      if (!richEditor || !savedRange) return;
      const sel = window.getSelection();
      if (!sel) return;
      sel.removeAllRanges();
      sel.addRange(savedRange);
    };

    // Rich editor toolbar
    document.querySelectorAll('.builder-toolbar-btn').forEach(btn => {
      btn.addEventListener('mousedown', (e) => {
        // Keep focus/selection in editor while using toolbar
        e.preventDefault();
      });

      btn.addEventListener('click', (e) => {
        e.preventDefault();

        if (richEditor) {
          richEditor.focus();
          restoreSelection();
        }

        const cmd = btn.dataset.cmd;
        if (cmd === 'createLink') {
          const url = prompt('Enter URL:', 'https://');
          if (url) document.execCommand('createLink', false, url);
        } else {
          document.execCommand(cmd, false, null);
        }

        saveSelection();
      });
    });

    // Handle paste events to strip formatting
    if (richEditor) {
      richEditor.addEventListener('paste', (e) => {
        e.preventDefault();

        // Get pasted text
        const text = e.clipboardData.getData('text/plain');

        // Insert as plain text
        document.execCommand('insertText', false, text);
        saveSelection();
      });

      richEditor.addEventListener('keyup', saveSelection);
      richEditor.addEventListener('mouseup', saveSelection);
      richEditor.addEventListener('blur', saveSelection);
    }

    const formatSelect = document.getElementById('formatBlock');
    if (formatSelect) {
      formatSelect.addEventListener('change', () => {
        if (formatSelect.value) {
          if (richEditor) {
            richEditor.focus();
            restoreSelection();
          }
          document.execCommand('formatBlock', false, formatSelect.value);
          formatSelect.value = '';
          saveSelection();
        }
      });
    }

    const alignSelect = document.getElementById('textAlign');
    if (alignSelect) {
      alignSelect.addEventListener('change', () => {
        if (alignSelect.value) {
          if (richEditor) {
            richEditor.focus();
            restoreSelection();
          }
          document.execCommand(alignSelect.value, false, null);
          alignSelect.value = '';
          saveSelection();
        }
      });
    }

    // Apply button
    const applyBtn = document.querySelector('.builder-apply-btn');
    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        this.pushSnapshot(this.pendingPartSnapshot);
        this.pendingPartSnapshot = null;

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
        this.saveToLocalStorage();
        this.selectBlock(block.id);
      });
    }

    const inputEditor = document.getElementById('plainEditor') || document.getElementById('codeEditor') || document.getElementById('titleEditor');
    const editorForShortcuts = richEditor || inputEditor;
    if (editorForShortcuts && applyBtn) {
      editorForShortcuts.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
          e.preventDefault();
          applyBtn.click();
          return;
        }

        if (e.key === 'Escape') {
          e.preventDefault();
          this.selectBlock(block.id);
        }
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
    this.meta.pageTitle = this.meta.h1Title;
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

  getLegalFooterHTML() {
    return 'Educational purposes only. Not affiliated with Amazon. Users responsible for compliance with applicable laws. <a href="https://github.com/NemesisHubris/kindlemodshelf.me" target="_blank" rel="noopener">View Source on GitHub</a>';
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

    html += `</div><footer class="legal-disclaimer">${this.getLegalFooterHTML()}</footer>`;
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
        return `<div class="card card-desc"><${tag} class="builder-list" data-editable-part="list">${items}</${tag}></div>`;

      case 'text':
        return `<div class="card card-desc" data-editable-part="content">${properties.content}</div>`;

      case 'video':
        const videoId = this.extractYouTubeId(properties.videoId);
        if (!videoId) {
          return `<div class="builder-video-placeholder">
            <p>Enter YouTube ID in properties panel →</p>
          </div>`;
        }
        return `<div class="card card-desc"><div class="responsive-video">
          <iframe src="https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1"
            title="${this.escapeHtml(properties.title)}" frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen></iframe>
        </div></div>`;

      case 'code':
        return `<div class="card card-desc"><pre data-editable-part="content"><code>${this.escapeHtml(properties.content)}</code></pre></div>`;

      case 'banner':
        const bannerClass = properties.bannerType === 'danger' ? 'legal-warning'
          : properties.bannerType === 'success' ? 'success-callout'
          : 'info-callout';
        return `<div class="${bannerClass}" data-editable-part="content">${properties.content}</div>`;

      case 'credit':
        return `<div class="card card-desc" data-editable-part="content">${properties.content}</div>`;

      default:
        return '<p>Unknown block</p>';
    }
  }

  deleteBlock(blockId) {
    this.pushSnapshot(this.serializeState());
    this.blocks = this.blocks.filter(b => b.id !== blockId);
    if (this.selectedBlockId === blockId) {
      this.selectedBlockId = null;
      this.selectedPart = null;
      this.clearBlockProperties();
    }
    this.renderPreview();
    this.saveToLocalStorage();
  }

  moveBlockUp(blockId) {
    const idx = this.blocks.findIndex(b => b.id === blockId);
    if (idx > 0) {
      this.pushSnapshot(this.serializeState());
      [this.blocks[idx], this.blocks[idx - 1]] = [this.blocks[idx - 1], this.blocks[idx]];
      this.renderPreview();
      this.saveToLocalStorage();
    }
  }

  moveBlockDown(blockId) {
    const idx = this.blocks.findIndex(b => b.id === blockId);
    if (idx < this.blocks.length - 1) {
      this.pushSnapshot(this.serializeState());
      [this.blocks[idx], this.blocks[idx + 1]] = [this.blocks[idx + 1], this.blocks[idx]];
      this.renderPreview();
      this.saveToLocalStorage();
    }
  }

  showClearConfirmation() {
    if (this.blocks.length === 0) return;
    if (confirm('Delete all blocks?')) {
      this.pushSnapshot(this.serializeState());
      this.blocks = [];
      this.selectedBlockId = null;
      this.selectedPart = null;
      this.clearBlockProperties();
      this.renderPreview();
      this.saveToLocalStorage();
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
    const filename = this.getExportFilename();
    const hasSummaryBlock = this.blocks.some(b => b.type === 'summary');

    let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${this.escapeHtml(this.meta.pageTitle)}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${this.escapeHtml(this.meta.description)}">
  <link rel="canonical" href="https://kindlemodshelf.me/${filename}">
  <link rel="stylesheet" href="style.css?v=3">
  <meta property="og:title" content="${this.escapeHtml(this.meta.pageTitle)}">
  <meta property="og:description" content="${this.escapeHtml(this.meta.description)}">
  <meta property="og:url" content="https://kindlemodshelf.me/${filename}">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="KindleModShelf">`;

    if (this.meta.keywords) {
      html += `\n  <meta name="keywords" content="${this.escapeHtml(this.meta.keywords)}">`;
    }

    // Structured data (ld+json)
    html += `
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "name": "${this.escapeHtml(this.meta.h1Title)}",
    "description": "${this.escapeHtml(this.meta.description)}",
    "url": "https://kindlemodshelf.me/${filename}"
  }
  </script>`;

    html += `
  <script src="theme-toggle.js?v=3"></script>
</head>
<body>
  <div class="container">
    <h1>${this.escapeHtml(this.meta.h1Title)}</h1>
`;

    // Render the visual Header Description (Summary) in export
    // Skip if there's already a summary block to avoid duplicates
    if (this.meta.summary && !hasSummaryBlock) {
      html += `\n    <div class="summary">\n      <p>${this.escapeHtml(this.meta.summary)}</p>\n    </div>`;
    }

    this.blocks.forEach(block => {
      html += '\n    ' + this.renderBlockForExport(block);
    });

    html += `
  </div>
  <footer class="legal-disclaimer">${this.getLegalFooterHTML()}</footer>
  <script src="navigation.js?v=3"></script>
</body>
</html>`;

    return html;
  }

  renderBlockForExport(block) {
    const { type, properties } = block;

    switch (type) {
      case 'summary':
        // If content doesn't start with a tag, wrap in <p>
        const summaryContent = properties.content.trim().startsWith('<')
          ? properties.content
          : `<p>${properties.content}</p>`;
        return `<div class="summary">\n      ${summaryContent}\n    </div>`;

      case 'section': {
        const sectionId = properties.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        return `<section aria-labelledby="${sectionId}">\n      <h2 class="section-title" id="${sectionId}">${properties.title}</h2>\n      <div class="card card-desc">\n        ${properties.content}\n      </div>\n    </section>`;
      }

      case 'list':
        const tag = properties.listType || 'ul';
        const items = (properties.items || []).map(i => `<li>${this.escapeHtml(i.content)}</li>`).join('\n        ');
        return `<div class="card card-desc">\n      <${tag}>\n        ${items}\n      </${tag}>\n    </div>`;

      case 'text':
        return `<div class="card card-desc">\n      ${properties.content}\n    </div>`;

      case 'video':
        const videoId = this.extractYouTubeId(properties.videoId);
        if (!videoId) return '';
        return `<div class="card card-desc">\n      <div class="responsive-video">\n        <iframe\n          src="https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1"\n          title="${this.escapeHtml(properties.title)}" frameborder="0"\n          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"\n          allowfullscreen>\n        </iframe>\n      </div>\n    </div>`;

      case 'code':
        return `<div class="card card-desc">\n      <pre><code>${this.escapeHtml(properties.content)}</code></pre>\n    </div>`;

      case 'banner': {
        const bannerClass = properties.bannerType === 'danger' ? 'legal-warning'
          : properties.bannerType === 'success' ? 'success-callout'
          : 'info-callout';
        return `<div class="${bannerClass}">\n      ${properties.content}\n    </div>`;
      }

      case 'credit':
        return `<div class="card card-desc">\n      ${properties.content}\n    </div>`;

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
