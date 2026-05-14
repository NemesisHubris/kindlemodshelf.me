// KindleModShelf Page Builder
// Professional page builder with rich text editor

class PageBuilder {
  constructor() {
    this.blocks = [];
    this.selectedBlockId = null;
    this.selectedPart = null;
    this.meta = this.getDefaultMeta();
    this.panelState = {
      leftWidth: 280,
      rightWidth: 320,
      leftCollapsed: false,
      rightCollapsed: false
    };
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
    this.syncDerivedFields();
    this.renderBadgePicker();
    this.loadMetaFromForm();
    this.applySidebarLayout();
    this.renderPreview();

    if (this.blocks.length === 0) {
      this.maybeOpenTemplateDialog();
    }
  }

  getDefaultMeta() {
    return {
      h1Title: 'Untitled Page',
      pageTitle: 'Untitled Page',
      pagePreset: 'tool',
      summary: '',
      description: 'A Kindle modding guide',
      keywords: 'kindle, mods, guide',
      cardTitle: '',
      cardDescription: '',
      cardTags: '',
      cardBadges: 'Tool',
      cardDownloadUrl: ''
    };
  }

  getAvailableCardBadges() {
    return [
      'Essential', 'Tool', 'Plugin', 'Patch', 'Theme', 'Utility', 'Utilities', 'Game',
      'Beta', 'Emulator', 'Media', 'Audio', 'Project', 'Guide', 'Resource', 'Alpha', 'Dev'
    ];
  }

  parseBadgeValue(value) {
    return (value || '')
      .split(',')
      .map(badge => badge.trim())
      .filter(Boolean);
  }

  joinBadgeValue(badges) {
    const available = this.getAvailableCardBadges();
    const normalized = [];
    const seen = new Set();

    (badges || []).forEach(badge => {
      const trimmed = (badge || '').trim();
      if (!trimmed) return;

      const lower = trimmed.toLowerCase();
      if (seen.has(lower)) return;
      seen.add(lower);
      normalized.push(trimmed);
    });

    const ordered = [];
    available.forEach(option => {
      const match = normalized.find(badge => badge.toLowerCase() === option.toLowerCase());
      if (match) ordered.push(option);
    });

    normalized.forEach(badge => {
      const exists = ordered.some(option => option.toLowerCase() === badge.toLowerCase());
      if (!exists) ordered.push(badge);
    });

    return ordered.join(', ');
  }

  getSuggestedCardBadges(preset) {
    if (preset === 'guide') return ['Guide'];
    if (preset === 'reference') return ['Resource'];
    return ['Tool'];
  }

  getEffectivePagePreset() {
    const badges = new Set(this.parseBadgeValue(this.meta.cardBadges).map(badge => badge.toLowerCase()));

    if (badges.has('guide')) return 'guide';
    if (badges.has('resource')) return 'reference';
    return this.meta.pagePreset || 'tool';
  }

  syncAutoField(input, suggestedValue) {
    if (!input) return;

    const currentValue = input.value || '';
    const lastSuggested = input.dataset.lastSuggested || '';
    const shouldAutoFill = !currentValue || input.dataset.auto === 'true' || currentValue === lastSuggested || currentValue === suggestedValue;

    if (shouldAutoFill) {
      input.value = suggestedValue;
      input.dataset.auto = 'true';
    } else {
      input.dataset.auto = 'false';
    }

    input.dataset.lastSuggested = suggestedValue;
  }

  syncAutoBadgeField(input, suggestedBadges) {
    if (!input) return;

    const currentValue = this.joinBadgeValue(this.parseBadgeValue(input.value));
    const suggestedValue = this.joinBadgeValue(suggestedBadges);
    const lastSuggested = input.dataset.lastSuggested || '';
    const shouldAutoFill = !currentValue || input.dataset.auto === 'true' || currentValue === lastSuggested || currentValue === suggestedValue;

    input.value = shouldAutoFill ? suggestedValue : currentValue;
    input.dataset.auto = shouldAutoFill ? 'true' : 'false';
    input.dataset.lastSuggested = suggestedValue;
  }

  extractPlainText(content) {
    const value = content || '';
    if (!value) return '';

    if (!/[<>]/.test(value)) {
      return value.replace(/\s+/g, ' ').trim();
    }

    const temp = document.createElement('div');
    temp.innerHTML = value;
    return (temp.textContent || temp.innerText || '').replace(/\s+/g, ' ').trim();
  }

  renderRichTextContent(content) {
    const value = (content || '').trim();
    if (!value) return '';

    if (value.startsWith('<')) {
      return value;
    }

    return `<p>${this.escapeHtml(value).replace(/\n/g, '<br>')}</p>`;
  }

  getSidebarBounds(side) {
    if (side === 'left') {
      return { min: 240, max: 520 };
    }

    return { min: 260, max: 620 };
  }

  getSidebarMaxWidth(side) {
    const container = document.getElementById('builderContainer');
    const bounds = this.getSidebarBounds(side);
    if (!container) return bounds.max;

    const otherSide = side === 'left' ? 'right' : 'left';
    const otherWidth = this.panelState[`${otherSide}Collapsed`] ? 0 : this.panelState[`${otherSide}Width`];
    const minCanvasWidth = 420;
    const availableWidth = container.clientWidth - otherWidth - minCanvasWidth - 16;

    return Math.max(bounds.min, Math.min(bounds.max, availableWidth));
  }

  clampSidebarWidth(side, width) {
    const bounds = this.getSidebarBounds(side);
    return Math.max(bounds.min, Math.min(this.getSidebarMaxWidth(side), width));
  }

  applySidebarLayout() {
    const container = document.getElementById('builderContainer');
    if (!container) return;

    this.panelState.leftWidth = this.clampSidebarWidth('left', this.panelState.leftWidth);
    this.panelState.rightWidth = this.clampSidebarWidth('right', this.panelState.rightWidth);

    container.style.setProperty('--builder-left-width', `${this.panelState.leftWidth}px`);
    container.style.setProperty('--builder-right-width', `${this.panelState.rightWidth}px`);
    container.classList.toggle('builder-left-collapsed', this.panelState.leftCollapsed);
    container.classList.toggle('builder-right-collapsed', this.panelState.rightCollapsed);

    const leftBtn = document.getElementById('toggleLeftSidebarBtn');
    const rightBtn = document.getElementById('toggleRightSidebarBtn');

    if (leftBtn) {
      leftBtn.textContent = this.panelState.leftCollapsed ? 'Show Page Setup' : 'Hide Page Setup';
      leftBtn.classList.toggle('is-active', !this.panelState.leftCollapsed);
    }

    if (rightBtn) {
      rightBtn.textContent = this.panelState.rightCollapsed ? 'Show Block Properties' : 'Hide Block Properties';
      rightBtn.classList.toggle('is-active', !this.panelState.rightCollapsed);
    }
  }

  toggleSidebar(side) {
    this.panelState[`${side}Collapsed`] = !this.panelState[`${side}Collapsed`];
    this.applySidebarLayout();
  }

  startSidebarResize(side, event) {
    if (window.innerWidth <= 900 || this.panelState[`${side}Collapsed`]) return;

    event.preventDefault();
    const startX = event.clientX;
    const widthKey = `${side}Width`;
    const startWidth = this.panelState[widthKey];

    document.body.classList.add('builder-resizing');

    const onMove = (moveEvent) => {
      const delta = moveEvent.clientX - startX;
      const nextWidth = side === 'left' ? startWidth + delta : startWidth - delta;
      this.panelState[widthKey] = this.clampSidebarWidth(side, nextWidth);
      this.applySidebarLayout();
    };

    const onUp = () => {
      document.body.classList.remove('builder-resizing');
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
    };

    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
  }

  maybeOpenTemplateDialog() {
    window.setTimeout(() => this.openDialog('templateDialog'), 0);
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
    document.getElementById('cardTitle').value = this.meta.cardTitle || '';
    document.getElementById('cardDescription').value = this.meta.cardDescription || '';
    document.getElementById('cardTags').value = this.meta.cardTags || '';
    document.getElementById('cardBadges').value = this.meta.cardBadges || '';
    document.getElementById('cardDownloadUrl').value = this.meta.cardDownloadUrl || '';

    this.selectedBlockId = null;
    this.selectedPart = null;
    this.pendingMetaSnapshot = null;
    this.pendingOverviewSnapshot = null;
    this.pendingPartSnapshot = null;
    this.pendingTitleSnapshot = null;
    this.syncDerivedFields();
    this.renderBadgePicker();
    this.loadMetaFromForm();
    this.renderPreview();

    if (restoredUi && restoredUi.selectedBlockId) {
      if (restoredUi.selectedBlockId === 'page-title') {
        this.selectPageTitle();
      } else if (restoredUi.selectedBlockId === 'page-summary') {
        this.selectHeaderSummary();
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
        document.getElementById('cardTitle').value = this.meta.cardTitle || '';
        document.getElementById('cardDescription').value = this.meta.cardDescription || '';
        document.getElementById('cardTags').value = this.meta.cardTags || '';
        document.getElementById('cardBadges').value = this.meta.cardBadges || '';
        document.getElementById('cardDownloadUrl').value = this.meta.cardDownloadUrl || '';
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
      document.getElementById('cardTitle').value = '';
      document.getElementById('cardDescription').value = '';
      document.getElementById('cardTags').value = '';
      document.getElementById('cardBadges').value = '';
      document.getElementById('cardDownloadUrl').value = '';
      this.selectedBlockId = null;
      this.selectedPart = null;
      this.clearBlockProperties();
      this.syncDerivedFields();
      this.renderBadgePicker();
      this.loadMetaFromForm();
      this.renderPreview();
      this.maybeOpenTemplateDialog();
    }
  }

  setupBufferedForm(formId, onInput) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('focusin', () => {
      if (!this.pendingMetaSnapshot) {
        this.pendingMetaSnapshot = this.serializeState();
      }
    });

    form.addEventListener('focusout', (e) => {
      const next = e.relatedTarget;
      if (next && form.contains(next)) return;
      this.pushSnapshot(this.pendingMetaSnapshot);
      this.pendingMetaSnapshot = null;
    });

    form.addEventListener('input', onInput);
  }

  openDialog(dialogId) {
    const dialog = document.getElementById(dialogId);
    if (!dialog || dialog.open) return;

    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
      return;
    }

    dialog.setAttribute('open', 'open');
  }

  closeDialog(dialogId) {
    const dialog = document.getElementById(dialogId);
    if (!dialog) return;

    if (typeof dialog.close === 'function' && dialog.open) {
      dialog.close();
      return;
    }

    dialog.removeAttribute('open');
  }

  renderBadgePicker() {
    const input = document.getElementById('cardBadges');
    const label = document.getElementById('cardBadgePickerLabel');
    const options = document.getElementById('cardBadgeOptions');
    if (!input || !label || !options) return;

    const selectedBadges = this.parseBadgeValue(input.value);
    const selectedSet = new Set(selectedBadges.map(badge => badge.toLowerCase()));

    label.textContent = selectedBadges.length ? selectedBadges.join(', ') : 'Select badges';
    options.innerHTML = this.getAvailableCardBadges().map(badge => `
      <label class="builder-badge-option">
        <input type="checkbox" value="${this.escapeHtml(badge)}" ${selectedSet.has(badge.toLowerCase()) ? 'checked' : ''}>
        <span class="builder-badge-pill">${this.escapeHtml(badge)}</span>
      </label>
    `).join('');

    options.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        const values = Array.from(options.querySelectorAll('input[type="checkbox"]:checked'))
          .map(option => option.value);

        input.value = this.joinBadgeValue(values);
        input.dataset.auto = 'false';
        this.renderBadgePicker();
        input.dispatchEvent(new Event('input', { bubbles: true }));
      });
    });
  }

  setupRichEditorInteractions(panel) {
    const richEditor = panel.querySelector('#richEditor');
    if (!richEditor) return null;

    let savedRange = null;

    const saveSelection = () => {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;
      const range = sel.getRangeAt(0);
      if (richEditor.contains(range.commonAncestorContainer)) {
        savedRange = range.cloneRange();
      }
    };

    const restoreSelection = () => {
      if (!savedRange) return;
      const sel = window.getSelection();
      if (!sel) return;
      sel.removeAllRanges();
      sel.addRange(savedRange);
    };

    panel.querySelectorAll('.builder-editor-toolbar .builder-toolbar-btn').forEach(btn => {
      btn.addEventListener('mousedown', (e) => {
        e.preventDefault();
      });

      btn.addEventListener('click', (e) => {
        e.preventDefault();

        richEditor.focus();
        restoreSelection();

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

    richEditor.addEventListener('paste', (e) => {
      e.preventDefault();
      const text = e.clipboardData.getData('text/plain');
      document.execCommand('insertText', false, text);
      saveSelection();
    });

    richEditor.addEventListener('keyup', saveSelection);
    richEditor.addEventListener('mouseup', saveSelection);
    richEditor.addEventListener('blur', saveSelection);

    const formatSelect = panel.querySelector('#formatBlock');
    if (formatSelect) {
      formatSelect.addEventListener('change', () => {
        if (!formatSelect.value) return;
        richEditor.focus();
        restoreSelection();
        document.execCommand('formatBlock', false, formatSelect.value);
        formatSelect.value = '';
        saveSelection();
      });
    }

    const alignSelect = panel.querySelector('#textAlign');
    if (alignSelect) {
      alignSelect.addEventListener('change', () => {
        if (!alignSelect.value) return;
        richEditor.focus();
        restoreSelection();
        document.execCommand(alignSelect.value, false, null);
        alignSelect.value = '';
        saveSelection();
      });
    }

    return richEditor;
  }

  setupEventListeners() {
    // Block palette buttons
    document.querySelectorAll('.builder-add-block').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const type = e.currentTarget.dataset.blockType;
        this.addBlock(type);
      });
    });

    this.setupBufferedForm('metaForm', () => {
      this.syncDerivedFields();
      this.loadMetaFromForm();
      this.renderPreview();
      this.saveToLocalStorage();
    });

    this.setupBufferedForm('seoForm', () => {
      this.syncDerivedFields();
      this.renderBadgePicker();
      this.loadMetaFromForm();
      this.saveToLocalStorage();
    });

    this.setupBufferedForm('cardForm', () => {
      this.loadMetaFromForm();
      this.saveToLocalStorage();
    });

    document.getElementById('toggleLeftSidebarBtn').addEventListener('click', () => this.toggleSidebar('left'));
    document.getElementById('toggleRightSidebarBtn').addEventListener('click', () => this.toggleSidebar('right'));

    document.querySelectorAll('.builder-resizer').forEach(resizer => {
      resizer.addEventListener('pointerdown', (event) => {
        this.startSidebarResize(resizer.dataset.resizer, event);
      });
    });

    window.addEventListener('resize', () => this.applySidebarLayout());

    document.getElementById('openTemplateDialogBtn').addEventListener('click', () => this.openDialog('templateDialog'));
    document.getElementById('openCardDialogBtn').addEventListener('click', () => this.openDialog('cardDialog'));
    document.getElementById('openSeoDialogBtn').addEventListener('click', () => this.openDialog('seoDialog'));

    document.querySelectorAll('[data-close-dialog]').forEach(btn => {
      btn.addEventListener('click', () => this.closeDialog(btn.dataset.closeDialog));
    });

    document.querySelectorAll('.builder-dialog').forEach(dialog => {
      dialog.addEventListener('click', (e) => {
        if (e.target === dialog) {
          this.closeDialog(dialog.id);
        }
      });
    });

    // Toolbar buttons
    document.getElementById('exportBtn').addEventListener('click', () => this.exportHTML());
    document.getElementById('copyCardBtn').addEventListener('click', () => this.copyIndexCardHTML());
    document.getElementById('clearAllBtn').addEventListener('click', () => this.showClearConfirmation());
    document.getElementById('clearStorageBtn').addEventListener('click', () => this.clearLocalStorage());
    document.getElementById('toolTemplateBtn').addEventListener('click', () => this.applyPageTemplate('tool'));
    document.getElementById('guideTemplateBtn').addEventListener('click', () => this.applyPageTemplate('guide'));
    document.getElementById('referenceTemplateBtn').addEventListener('click', () => this.applyPageTemplate('reference'));

    // Preview click handler
    const previewEl = document.getElementById('preview');
    previewEl.addEventListener('click', (e) => {
      const target = e.target && e.target.nodeType === Node.ELEMENT_NODE
        ? e.target
        : e.target.parentElement;
      if (!target) return;

      if (target.closest('.builder-block-control-btn')) return;

      const pageMeta = target.closest('[data-page-meta-part]');
      if (pageMeta) {
        const part = pageMeta.dataset.pageMetaPart;
        if (part === 'title') {
          this.selectPageTitle();
        } else if (part === 'summary') {
          this.selectHeaderSummary();
        }
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
    this.updatePageMetaSelection();
    this.clearBlockProperties();
  }

  updatePageMetaSelection() {
    document.querySelectorAll('.builder-page-meta-editable.builder-page-meta-selected').forEach(el => {
      el.classList.remove('builder-page-meta-selected');
    });

    if (this.selectedBlockId === 'page-title') {
      document.querySelector('[data-page-meta-part="title"]')?.classList.add('builder-page-meta-selected');
    }

    if (this.selectedBlockId === 'page-summary') {
      document.querySelector('[data-page-meta-part="summary"]')?.classList.add('builder-page-meta-selected');
    }
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
    this.updatePageMetaSelection();
    this.showBlockOverview(blockId);
  }

  selectBlockPart(blockId, part) {
    this.selectedBlockId = blockId;
    this.selectedPart = part;
    this.updatePageMetaSelection();
    this.showPartEditor(blockId, part);
  }

  selectListItem(blockId, itemId) {
    this.selectedBlockId = blockId;
    this.selectedPart = `item-${itemId}`;
    this.updatePageMetaSelection();
    this.showPartEditor(blockId, `item-${itemId}`);
  }

  selectPageTitle() {
    document.querySelectorAll('.builder-block-wrapper.selected').forEach(el => {
      el.classList.remove('selected');
    });
    this.selectedBlockId = 'page-title';
    this.selectedPart = 'title';
    this.updatePageMetaSelection();
    this.showPageTitleEditor();
  }

  selectHeaderSummary() {
    document.querySelectorAll('.builder-block-wrapper.selected').forEach(el => {
      el.classList.remove('selected');
    });
    this.selectedBlockId = 'page-summary';
    this.selectedPart = 'summary';
    this.updatePageMetaSelection();
    this.showHeaderSummaryEditor();
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
    let editorType = 'rich'; // rich, plain, code, or title

    if (part.startsWith('item-')) {
      const itemId = parseInt(part.split('-')[1]);
      const item = block.properties.items?.find(i => i.id === itemId);
      content = item?.content || '';
      editorType = 'rich';
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

    let html = `<div class="builder-properties-form">
      <div class="builder-part-header">${this.getPartLabel(part, block.type)}</div>`;

    if (editorType === 'rich') {
      html += this.getRichEditor(content);
    } else if (editorType === 'code') {
      html += this.getCodeEditor(content);
    } else if (editorType === 'title') {
      html += `<input type="text" id="titleEditor" class="builder-title-input" value="${this.escapeHtml(content)}">`;
    } else {
      html += `<input type="text" id="plainEditor" class="builder-input" value="${this.escapeHtml(content)}">`;
    }

    html += `<button type="button" class="builder-apply-btn">Apply</button></div>`;
    panel.innerHTML = html;
    this.pendingPartSnapshot = this.serializeState();

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
        this.syncDerivedFields();
        this.renderBadgePicker();
        this.loadMetaFromForm();
        this.renderPreview();
        this.saveToLocalStorage();
      });
    }

    setTimeout(() => {
      const editor = panel.querySelector('#titleEditor');
      if (editor) editor.focus();
    }, 50);
  }

  showHeaderSummaryEditor() {
    const panel = document.getElementById('propertiesPanel');
    panel.classList.remove('builder-properties-empty');

    const content = this.meta.summary || '';
    panel.innerHTML = `<div class="builder-properties-form">
      <div class="builder-part-header">Edit Header Summary</div>
      ${this.getRichEditor('')}
      <button type="button" class="builder-apply-btn">Apply</button>
    </div>`;

    this.pendingTitleSnapshot = this.serializeState();
    const richEditor = this.setupRichEditorInteractions(panel);
    if (richEditor) {
      richEditor.textContent = content;
    }

    const applyBtn = panel.querySelector('.builder-apply-btn');
    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        this.pushSnapshot(this.pendingTitleSnapshot);
        this.pendingTitleSnapshot = null;

        const editor = panel.querySelector('#richEditor');
        const newValue = editor ? editor.innerHTML : '';
        this.meta.summary = newValue;
        document.getElementById('headerDescription').value = newValue;
        this.syncDerivedFields();
        this.renderBadgePicker();
        this.loadMetaFromForm();
        this.renderPreview();
        this.saveToLocalStorage();
      });
    }

    if (richEditor && applyBtn) {
      richEditor.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
          e.preventDefault();
          applyBtn.click();
          return;
        }

        if (e.key === 'Escape') {
          e.preventDefault();
          this.deselectAll();
        }
      });
    }

    setTimeout(() => {
      const editor = panel.querySelector('#richEditor');
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
            <button type="button" class="builder-toolbar-btn" data-cmd="createLink" title="Insert Link">&#128279;</button>
            <button type="button" class="builder-toolbar-btn" data-cmd="unlink" title="Remove Link">&#10006;</button>
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

  getCodeEditor(content) {
    return `
      <div class="builder-code-shell">
        <div id="codeLineNumbers" class="builder-code-line-numbers" aria-hidden="true">1</div>
        <textarea id="codeEditor" class="builder-code-editor" spellcheck="false">${this.escapeHtml(content)}</textarea>
      </div>`;
  }

  setupCodeEditor(panel) {
    const editor = panel.querySelector('#codeEditor');
    const lineNumbers = panel.querySelector('#codeLineNumbers');
    if (!editor || !lineNumbers) return null;

    const updateLineNumbers = () => {
      const lineCount = Math.max(editor.value.split('\n').length, 1);
      lineNumbers.innerHTML = Array.from({ length: lineCount }, (_, index) => `${index + 1}`).join('<br>');
    };

    const syncScroll = () => {
      lineNumbers.scrollTop = editor.scrollTop;
    };

    const insertAtSelection = (value, start, end = start) => {
      editor.setRangeText(value, start, end, 'end');
      updateLineNumbers();
    };

    editor.addEventListener('input', updateLineNumbers);
    editor.addEventListener('scroll', syncScroll);
    editor.addEventListener('keydown', (e) => {
      const start = editor.selectionStart;
      const end = editor.selectionEnd;

      if (e.key === 'Tab') {
        e.preventDefault();

        if (e.shiftKey) {
          const lineStart = editor.value.lastIndexOf('\n', start - 1) + 1;
          const selectedText = editor.value.slice(lineStart, end);
          const outdented = selectedText.replace(/^ {1,2}/gm, '');
          editor.setRangeText(outdented, lineStart, end, 'select');
        } else if (start !== end && editor.value.slice(start, end).includes('\n')) {
          const lineStart = editor.value.lastIndexOf('\n', start - 1) + 1;
          const selectedText = editor.value.slice(lineStart, end);
          const indented = selectedText.replace(/^/gm, '  ');
          editor.setRangeText(indented, lineStart, end, 'select');
        } else {
          insertAtSelection('  ', start, end);
        }

        updateLineNumbers();
        return;
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        const lineStart = editor.value.lastIndexOf('\n', start - 1) + 1;
        const currentLine = editor.value.slice(lineStart, start);
        const indent = currentLine.match(/^\s*/)?.[0] || '';
        const extraIndent = /[\[{(]\s*$/.test(currentLine) ? '  ' : '';
        insertAtSelection(`\n${indent}${extraIndent}`, start, end);
      }
    });

    updateLineNumbers();
    syncScroll();
    return editor;
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
    const panel = document.getElementById('propertiesPanel');
    const richEditor = this.setupRichEditorInteractions(panel);
    const codeEditor = this.setupCodeEditor(panel);

    // Apply button
    const applyBtn = panel.querySelector('.builder-apply-btn');
    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        this.pushSnapshot(this.pendingPartSnapshot);
        this.pendingPartSnapshot = null;

        let newValue = '';

        if (editorType === 'rich') {
          const editor = panel.querySelector('#richEditor');
          newValue = editor ? editor.innerHTML : '';
        } else if (editorType === 'code') {
          const editor = panel.querySelector('#codeEditor');
          newValue = editor ? editor.value : '';
        } else if (editorType === 'title') {
          const editor = panel.querySelector('#titleEditor');
          newValue = editor ? editor.value : '';
        } else {
          const editor = panel.querySelector('#plainEditor');
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

    const inputEditor = panel.querySelector('#plainEditor, #titleEditor');
    const editorForShortcuts = richEditor || codeEditor || inputEditor;
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
    this.meta.cardTitle = document.getElementById('cardTitle').value || this.meta.h1Title;
    this.meta.cardDescription = document.getElementById('cardDescription').value || this.extractPlainText(this.meta.summary) || '';
    this.meta.cardTags = document.getElementById('cardTags').value || '';
    this.meta.cardBadges = this.joinBadgeValue(this.parseBadgeValue(document.getElementById('cardBadges').value || ''));
    this.meta.cardDownloadUrl = document.getElementById('cardDownloadUrl').value || '';
  }

  syncDerivedFields() {
    const titleInput = document.getElementById('pageTitle');
    const summaryInput = document.getElementById('headerDescription');
    const descriptionInput = document.getElementById('metaDescription');
    const cardTitleInput = document.getElementById('cardTitle');
    const cardDescriptionInput = document.getElementById('cardDescription');
    const cardBadgesInput = document.getElementById('cardBadges');

    const suggestedCardTitle = titleInput.value || '';
    const suggestedCardDescription = this.extractPlainText(summaryInput.value) || this.extractPlainText(descriptionInput.value) || '';

    this.syncAutoField(cardTitleInput, suggestedCardTitle);
    this.syncAutoField(cardDescriptionInput, suggestedCardDescription);
    this.syncAutoBadgeField(cardBadgesInput, this.getSuggestedCardBadges(this.meta.pagePreset || 'tool'));
    this.renderBadgePicker();
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

    this.updatePageMetaSelection();
  }

  getLegalFooterHTML() {
    return 'Educational purposes only. Not affiliated with Amazon. Users responsible for compliance with applicable laws. <a href="https://github.com/NemesisHubris/kindlemodshelf.me" target="_blank" rel="noopener">View Source on GitHub</a>';
  }

  generatePreviewHTML() {
    let html = '<div class="container">';
    html += `<h1 class="builder-page-meta-editable" data-page-meta-part="title">${this.escapeHtml(this.meta.h1Title)}</h1>`;

    // Render the visual Header Description (Summary)
    if (this.meta.summary) {
      html += `<div class="summary builder-page-meta-editable" data-page-meta-part="summary">${this.renderRichTextContent(this.meta.summary)}</div>`;
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
          `<li class="builder-list-item-editable" data-item-id="${item.id}">${item.content}</li>`
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
      this.maybeOpenTemplateDialog();
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

  async copyIndexCardHTML() {
    const snippet = this.generateIndexCardHTML();
    const notification = document.getElementById('copyNotification');

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(snippet);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = snippet;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      notification.textContent = 'Homepage card HTML copied to clipboard';
      notification.style.display = 'block';
      setTimeout(() => notification.style.display = 'none', 3000);
    } catch (e) {
      notification.textContent = 'Could not copy homepage card HTML';
      notification.style.display = 'block';
      setTimeout(() => notification.style.display = 'none', 3000);
    }
  }

  generateExportHTML() {
    const filename = this.getExportFilename();
    const basename = filename.replace(/\.html$/, '');
    const targetPath = basename === 'index' ? '' : basename;
    const hasSummaryBlock = this.blocks.some(b => b.type === 'summary');
    const preset = this.getEffectivePagePreset();
    const metaProfile = this.getMetadataProfile(filename, preset);

    let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${this.escapeHtml(this.meta.pageTitle)}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${this.escapeHtml(this.meta.description)}">
  <link rel="canonical" href="https://kindlemodshelf.me/${targetPath}">
  <link rel="stylesheet" href="style.css?v=3">
  <meta property="og:title" content="${this.escapeHtml(this.meta.pageTitle)}">
  <meta property="og:description" content="${this.escapeHtml(this.meta.description)}">
  <meta property="og:url" content="https://kindlemodshelf.me/${targetPath}">
  <meta property="og:type" content="${metaProfile.ogType}">
  <meta property="og:site_name" content="KindleModShelf">`;

    if (this.meta.keywords) {
      html += `\n  <meta name="keywords" content="${this.escapeHtml(this.meta.keywords)}">`;
    }

    // Structured data (ld+json)
    html += `
  <script type="application/ld+json">
  ${metaProfile.jsonLd}
  </script>`;

    html += `
  <script src="theme-toggle.js?v=3"></script>
</head>
<body>
  <div class="container container-guide">
    <h1>${this.escapeHtml(this.meta.h1Title)}</h1>
`;

    // Render the visual Header Description (Summary) in export
    // Skip if there's already a summary block to avoid duplicates
    if (this.meta.summary && !hasSummaryBlock) {
      html += `\n    <div class="summary">\n      ${this.renderRichTextContent(this.meta.summary)}\n    </div>`;
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
        const items = (properties.items || []).map(i => `<li>${i.content}</li>`).join('\n        ');
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
    const slug = this.slugify(this.meta.h1Title);
    return slug ? `${slug}.html` : 'page.html';
  }

  slugify(text) {
    return (text || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 80);
  }

  getMetadataProfile(filename, preset) {
    const escapedTitle = this.escapeHtml(this.meta.h1Title);
    const escapedDescription = this.escapeHtml(this.meta.description);
    const url = `https://kindlemodshelf.me/${filename}`;

    if (preset === 'guide') {
      return {
        ogType: 'article',
        jsonLd: `{
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "${escapedTitle}",
    "description": "${escapedDescription}",
    "url": "${url}"
  }`
      };
    }

    if (preset === 'reference') {
      return {
        ogType: 'website',
        jsonLd: `{
    "@context": "https://schema.org",
    "@type": "Article",
    "name": "${escapedTitle}",
    "description": "${escapedDescription}",
    "url": "${url}"
  }`
      };
    }

    return {
      ogType: 'website',
      jsonLd: `{
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "${escapedTitle}",
    "operatingSystem": "Kindle OS / Web Browser",
    "applicationCategory": "Utility",
    "description": "${escapedDescription}",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "url": "${url}"
  }`
    };
  }

  createBlock(type, properties) {
    const id = 'block-' + Date.now() + Math.random().toString(36).substring(2, 11);
    return { id, type, properties };
  }

  createStandardSection(title, content) {
    return this.createBlock('section', { title, content });
  }

  applyPageTemplate(type) {
    const hasContent = this.blocks.length > 0;
    if (hasContent && !confirm('Replace the current blocks with this starter template?')) {
      return;
    }

    this.pushSnapshot(this.serializeState());
    this.meta.pagePreset = type;

    const templateSummaries = {
      tool: 'Briefly explain what this tool does, who it is for, and why someone would use it.',
      guide: 'Briefly explain what this guide helps the reader accomplish before they begin.',
      reference: 'Briefly explain what this resource page collects and how readers should use it.'
    };

    const toolBlocks = [
      this.createStandardSection('Download', '<ul>\n          <li><a href="https://example.com" target="_blank" rel="noopener">Download</a></li>\n        </ul>'),
      this.createStandardSection('Features', '<ul>\n          <li>Feature one</li>\n          <li>Feature two</li>\n        </ul>'),
      this.createStandardSection('Requirements', '<ul>\n          <li>Requirement one</li>\n        </ul>'),
      this.createStandardSection('Installation', '<ol>\n          <li>Step one</li>\n          <li>Step two</li>\n        </ol>'),
      this.createStandardSection('Usage', '<ol>\n          <li>How to use it</li>\n        </ol>'),
      this.createStandardSection('Notes', '<p>Optional caveats and compatibility notes.</p>'),
      this.createStandardSection('Credits', '<p>Developed by <b>Name</b>.</p>')
    ];

    const guideBlocks = [
      this.createStandardSection('Overview', '<p>Explain what this guide covers and who it is for.</p>'),
      this.createStandardSection('Requirements', '<ul>\n          <li>Requirement one</li>\n        </ul>'),
      this.createStandardSection('Steps', '<ol>\n          <li>Step one</li>\n          <li>Step two</li>\n        </ol>'),
      this.createStandardSection('Notes', '<p>Add caveats, warnings, or optional follow-up steps here.</p>'),
      this.createStandardSection('Credits', '<p>Guide by <b>Name</b>.</p>')
    ];

    const referenceBlocks = [
      this.createStandardSection('Overview', '<p>Summarize what this page helps readers find quickly.</p>'),
      this.createStandardSection('Resources', '<ul>\n          <li><a href="https://example.com" target="_blank" rel="noopener">Primary resource</a></li>\n        </ul>'),
      this.createStandardSection('Compatibility', '<ul>\n          <li>Compatible device or firmware details</li>\n        </ul>'),
      this.createStandardSection('Links', '<ul>\n          <li><a href="https://example.com" target="_blank" rel="noopener">Supporting link</a></li>\n        </ul>'),
      this.createStandardSection('Credits', '<p>Compiled by <b>Name</b>.</p>')
    ];

    if (type === 'guide') {
      this.blocks = guideBlocks;
    } else if (type === 'reference') {
      this.blocks = referenceBlocks;
    } else {
      this.blocks = toolBlocks;
    }

    document.getElementById('headerDescription').value = templateSummaries[type] || templateSummaries.tool;

    const badgesInput = document.getElementById('cardBadges');
    if (!badgesInput.value || badgesInput.dataset.auto === 'true') {
      badgesInput.value = this.joinBadgeValue(this.getSuggestedCardBadges(type));
      badgesInput.dataset.auto = 'true';
    }

    this.syncDerivedFields();
    this.renderBadgePicker();
    this.loadMetaFromForm();
    this.renderPreview();
    this.saveToLocalStorage();
    this.closeDialog('templateDialog');
  }

  generateIndexCardHTML() {
    const filename = this.getExportFilename();
    const cardTitle = this.escapeHtml(this.meta.cardTitle || this.meta.h1Title);
    const cardDescription = this.escapeHtml(this.meta.cardDescription || this.meta.description || '');
    const tagAttr = this.escapeHtml((this.meta.cardTags || this.meta.h1Title).trim());
    const badges = (this.meta.cardBadges || '')
      .split(',')
      .map(tag => tag.trim())
      .filter(Boolean)
      .map(tag => `<span class="tag">${this.escapeHtml(tag)}</span>`)
      .join('');
    const downloadUrl = (this.meta.cardDownloadUrl || '').trim();

    const links = [];
    if (downloadUrl) {
      links.push(`    <a href="${this.escapeHtml(downloadUrl)}" class="card-download" target="_blank" rel="noopener">Download</a>`);
    }
    links.push(`    <a href="${filename}">More</a>`);

    return [
      `<div class="card" data-tags="${tagAttr}">`,
      '  <div class="card-header">',
      `    <div class="card-title">${cardTitle}</div>`,
      `    <div class="card-tags">${badges}</div>`,
      '  </div>',
      '  <div class="card-desc">',
      `    ${cardDescription}`,
      '  </div>',
      '  <div class="card-links">',
      ...links,
      '  </div>',
      '</div>'
    ].join('\n');
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
