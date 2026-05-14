const KINDLE_PRESETS = {
  'Kindle (11th Gen)': [1072, 1448],
  'Kindle PW (12th Gen)': [1264, 1680],
  'Kindle PW (11th Gen)': [1236, 1648],
  'Kindle PW (10th Gen & earlier)': [1072, 1448],
  'Kindle Oasis (3rd Gen)': [1264, 1680],
  'Kindle Scribe': [1860, 2480],
  'Kobo Nia': [758, 1024],
  'Kobo Clara BW': [1072, 1448],
  'Kobo Clara 2E / HD': [1072, 1448],
  'Kobo Libra 2 / H2O': [1264, 1680],
  'Kobo Sage': [1440, 1920],
  'Kobo Elipsa 2E': [1404, 1872],
  'Remarkable 2': [1404, 1872],
  'Boox Palma': [824, 1648],
  'Boox Page': [1264, 1680],
  'Boox Note Air Series': [1404, 1872],
  'Boox Tab Ultra Series': [1404, 1872],
  'Nook GlowLight 4 / 4e': [1072, 1448],
  'PocketBook Era': [1264, 1680],
  'PocketBook InkPad 4 / Color 3': [1404, 1872],
  'Custom': null
};

const LOOK_PRESETS = {
  balanced: {
    brightness: 100,
    contrast: 100,
    saturation: 100,
    exposure: 0,
    gamma: 1,
    sharpen: 0,
    grayscale: true,
    autoLevels: false,
    invert: false,
    border: false,
    ditherMode: 'none',
    threshold: 128
  },
  'paperwhite-crisp': {
    brightness: 100,
    contrast: 118,
    saturation: 100,
    exposure: 4,
    gamma: 1,
    sharpen: 14,
    grayscale: true,
    autoLevels: true,
    invert: false,
    border: false,
    ditherMode: 'floyd',
    threshold: 128
  },
  'paperwhite-soft': {
    brightness: 102,
    contrast: 110,
    saturation: 100,
    exposure: 3,
    gamma: 1.04,
    sharpen: 8,
    grayscale: true,
    autoLevels: true,
    invert: false,
    border: false,
    ditherMode: 'none',
    threshold: 128
  },
  'colorsoft-soft': {
    brightness: 100,
    contrast: 108,
    saturation: 82,
    exposure: 2,
    gamma: 1.03,
    sharpen: 8,
    grayscale: false,
    autoLevels: true,
    invert: false,
    border: false,
    ditherMode: 'none',
    threshold: 128
  },
  'line-art': {
    brightness: 100,
    contrast: 140,
    saturation: 100,
    exposure: 0,
    gamma: 0.95,
    sharpen: 18,
    grayscale: true,
    autoLevels: true,
    invert: false,
    border: false,
    ditherMode: 'threshold',
    threshold: 145
  }
};

const LOOK_KEYS = Object.keys(LOOK_PRESETS);
const favoritesApi = window.KindleModsFavorites || null;
const HISTORY_FIELDS = [
  'width',
  'height',
  'fitMode',
  'background',
  'scale',
  'minScale',
  'offsetX',
  'offsetY',
  'rotation',
  'flipX',
  'flipY',
  'brightness',
  'contrast',
  'saturation',
  'exposure',
  'gamma',
  'sharpen',
  'grayscale',
  'autoLevels',
  'invert',
  'border',
  'ditherMode',
  'threshold',
  'exportFormat',
  'alphaTolerance',
  'displayLook'
];

const HISTORY_LIMIT = 250;

const state = {
  image: null,
  imageName: 'kindle_screensaver',
  sourceCanvas: null,
  sourcePixels: null,
  sourceMask: null,
  removedPixelCount: 0,
  maskedSourceCanvas: null,
  maskedSourceDirty: false,
  width: 1236,
  height: 1648,
  fitMode: 'cover',
  background: 'transparent',
  scale: 1,
  minScale: 1,
  offsetX: 0,
  offsetY: 0,
  rotation: 0,
  flipX: 1,
  flipY: 1,
  dragging: false,
  lastX: 0,
  lastY: 0,
  previewScale: 1,
  brightness: 100,
  contrast: 100,
  saturation: 100,
  exposure: 0,
  gamma: 1,
  sharpen: 0,
  grayscale: true,
  autoLevels: false,
  invert: false,
  border: false,
  ditherMode: 'none',
  threshold: 128,
  exportFormat: 'image/png',
  instantAlphaMode: false,
  instantAlphaSettingsOpen: false,
  alphaTolerance: 28,
  previewFrameX: 0,
  previewFrameY: 0,
  previewFrameWidth: 0,
  previewFrameHeight: 0,
  displayLook: 'balanced',
  undoStack: [],
  redoStack: [],
  historyDraft: null,
  dragHistorySnapshot: null,
  wheelHistoryTimer: null,
  alphaPainting: false,
  alphaStrokeSnapshot: null,
  alphaStrokeChanged: false,
  selectionMode: false,
  selectionRect: null,
  selectionDragging: false,
  selectionStart: null,
  tooltipPinned: false,
  tooltipTarget: null,
  compositionGuide: true,
  previewOutputCanvas: document.createElement('canvas'),
  previewRenderQueued: false
};

const els = {};

document.addEventListener('DOMContentLoaded', () => {
  [
    'imageUpload', 'dropZone', 'uploadMeta', 'devicePreset', 'targetWidth', 'targetHeight',
    'favoriteImportBtn', 'favoritesPicker', 'favoritesPickerBackdrop', 'favoritesPickerClose', 'favoritesPickerGrid', 'favoritesPickerEmpty',
    'fitMode', 'backgroundColor', 'rotateLeftBtn', 'rotateRightBtn', 'flipXBtn', 'flipYBtn',
    'canvasWrap', 'editorCanvas', 'emptyState', 'zoomOverlay', 'centerBtn', 'fitBtn', 'resetBtn',
    'downloadBtn', 'zoom', 'zoomInBtn', 'zoomOutBtn', 'zoomInput', 'brightness', 'contrast',
    'saturation', 'exposure', 'gamma', 'sharpen', 'grayscale', 'autoLevels', 'invert', 'border',
    'ditherMode', 'threshold', 'thresholdGroup', 'exportFormat', 'canvasDimsDisplay',
    'instantAlphaBtn', 'instantAlphaSettingsBtn', 'instantAlphaSettingsPanel',
    'alphaTolerance', 'alphaToleranceValue', 'undoBtn', 'redoBtn', 'displayLook', 'selectionModeBtn',
    'eraseSelectionBtn', 'cropSelectionBtn', 'selectionHint', 'studioTooltip'
  ].forEach(id => {
    els[id] = document.getElementById(id);
  });

  populatePresets();
  bindEvents();
  syncStateToControls();
  syncInteractionState();
  updateFavoriteImportState();
  updateCanvasInfo();
  resizePreview();
  loadDemoImageIfRequested();
});

function populatePresets() {
  els.devicePreset.innerHTML = Object.keys(KINDLE_PRESETS)
    .map(name => `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`)
    .join('');
  syncDevicePresetFromSize();
}

function bindEvents() {
  els.imageUpload.addEventListener('change', event => {
    const file = event.target.files && event.target.files[0];
    if (file) loadFile(file);
  });

  if (els.favoriteImportBtn) {
    els.favoriteImportBtn.addEventListener('click', () => {
      openFavoritesPicker();
    });
  }
  if (els.favoritesPickerBackdrop) {
    els.favoritesPickerBackdrop.addEventListener('click', closeFavoritesPicker);
  }
  if (els.favoritesPickerClose) {
    els.favoritesPickerClose.addEventListener('click', closeFavoritesPicker);
  }
  if (favoritesApi) {
    window.addEventListener(favoritesApi.CHANGE_EVENT, () => {
      updateFavoriteImportState();
      if (!els.favoritesPicker?.hidden) {
        renderFavoritesPicker();
      }
    });
  }

  ['dragenter', 'dragover'].forEach(type => {
    els.dropZone.addEventListener(type, event => {
      event.preventDefault();
      els.dropZone.classList.add('is-dragging');
    });
  });

  ['dragleave', 'drop'].forEach(type => {
    els.dropZone.addEventListener(type, event => {
      event.preventDefault();
      els.dropZone.classList.remove('is-dragging');
    });
  });

  els.dropZone.addEventListener('drop', event => {
    const file = event.dataTransfer.files && event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) loadFile(file);
  });

  els.devicePreset.addEventListener('change', () => {
    const before = captureHistorySnapshot();
    const preset = KINDLE_PRESETS[els.devicePreset.value];
    if (preset) {
      state.width = preset[0];
      state.height = preset[1];
      fitImage(true);
    }
    syncStateToControls();
    requestPreviewRender();
    commitHistorySnapshot(before);
  });

  bindTrackedControl('targetWidth', { onInput: handleSizeInput });
  bindTrackedControl('targetHeight', { onInput: handleSizeInput });
  bindTrackedControl('fitMode', {
    onInput: () => {
      state.fitMode = els.fitMode.value;
      fitImage(true);
    }
  });
  bindTrackedControl('backgroundColor', {
    onInput: () => {
      state.background = els.backgroundColor.value;
      requestPreviewRender();
    }
  });
  bindTrackedControl('displayLook', {
    onInput: () => {
      if (els.displayLook.value === 'custom') return;
      applyDisplayLook(els.displayLook.value);
      syncStateToControls();
      requestPreviewRender();
    }
  });

  ['zoom', 'brightness', 'contrast', 'saturation', 'exposure', 'gamma', 'sharpen', 'threshold'].forEach(id => {
    bindTrackedControl(id, {
      onInput: () => {
        syncControlsToState();
        if (id === 'zoom') updateZoomFromControl();
        requestPreviewRender();
      }
    });
  });

  bindTrackedControl('alphaTolerance', {
    onInput: () => {
      state.alphaTolerance = Number(els.alphaTolerance.value);
      updateInstantAlphaUI();
    }
  });

  ['grayscale', 'autoLevels', 'invert', 'border'].forEach(id => {
    bindTrackedControl(id, {
      onInput: () => {
        syncControlsToState();
        requestPreviewRender();
      }
    });
  });

  bindTrackedControl('ditherMode', {
    onInput: () => {
      state.ditherMode = els.ditherMode.value;
      updateValueLabels();
      syncDisplayLookFromState();
      requestPreviewRender();
    }
  });

  els.rotateLeftBtn.addEventListener('click', () => {
    const before = captureHistorySnapshot();
    rotate(-90);
    commitHistorySnapshot(before);
  });
  els.rotateRightBtn.addEventListener('click', () => {
    const before = captureHistorySnapshot();
    rotate(90);
    commitHistorySnapshot(before);
  });
  els.flipXBtn.addEventListener('click', () => {
    const before = captureHistorySnapshot();
    state.flipX *= -1;
    requestPreviewRender();
    commitHistorySnapshot(before);
  });
  els.flipYBtn.addEventListener('click', () => {
    const before = captureHistorySnapshot();
    state.flipY *= -1;
    requestPreviewRender();
    commitHistorySnapshot(before);
  });

  els.centerBtn.addEventListener('click', () => {
    const before = captureHistorySnapshot();
    centerImage();
    commitHistorySnapshot(before);
  });
  els.fitBtn.addEventListener('click', () => {
    const before = captureHistorySnapshot();
    fitImage(true);
    commitHistorySnapshot(before);
  });
  els.resetBtn.addEventListener('click', () => {
    const before = captureHistorySnapshot({ includeMask: true });
    resetEdits();
    commitHistorySnapshot(before);
  });

  els.downloadBtn.addEventListener('click', downloadImage);
  els.undoBtn.addEventListener('click', undoHistory);
  els.redoBtn.addEventListener('click', redoHistory);

  els.zoomInBtn.addEventListener('click', () => {
    const before = captureHistorySnapshot();
    els.zoom.value = Math.min(400, Number(els.zoom.value) + 25);
    updateZoomFromControl();
    requestPreviewRender();
    commitHistorySnapshot(before);
  });
  els.zoomOutBtn.addEventListener('click', () => {
    const before = captureHistorySnapshot();
    els.zoom.value = Math.max(25, Number(els.zoom.value) - 25);
    updateZoomFromControl();
    requestPreviewRender();
    commitHistorySnapshot(before);
  });
  els.zoomInput.addEventListener('focus', () => {
    armHistoryDraft();
    window.requestAnimationFrame(() => {
      els.zoomInput.select();
    });
  });
  els.zoomInput.addEventListener('input', () => {
    els.zoomInput.value = String(els.zoomInput.value).replace(/[^\d]/g, '');
  });
  els.zoomInput.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      commitZoomInput();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      restoreZoomInput();
    }
  });
  els.zoomInput.addEventListener('blur', () => {
    restoreZoomInput();
  });

  els.exportFormat.addEventListener('change', () => {
    state.exportFormat = els.exportFormat.value;
  });

  els.instantAlphaBtn.addEventListener('click', toggleInstantAlphaMode);
  if (els.instantAlphaSettingsBtn) {
    els.instantAlphaSettingsBtn.addEventListener('click', event => {
      event.preventDefault();
      toggleInstantAlphaSettings();
    });
  }
  els.selectionModeBtn.addEventListener('click', toggleSelectionMode);
  els.eraseSelectionBtn.addEventListener('click', eraseSelectionArea);
  els.cropSelectionBtn.addEventListener('click', cropToSelection);

  els.editorCanvas.addEventListener('pointerdown', startInteraction);
  els.editorCanvas.addEventListener('pointermove', moveInteraction);
  els.editorCanvas.addEventListener('pointerup', endInteraction);
  els.editorCanvas.addEventListener('pointercancel', endInteraction);
  els.editorCanvas.addEventListener('wheel', handleWheel, { passive: false });
  window.addEventListener('resize', resizePreview);
  window.addEventListener('keydown', handleKeyboardShortcuts);
  setupTooltips();
}

function bindTrackedControl(id, { onInput } = {}) {
  const el = els[id];
  if (!el) return;
  const arm = () => armHistoryDraft();
  el.addEventListener('pointerdown', arm);
  el.addEventListener('focus', arm);
  if (onInput) {
    el.addEventListener('input', onInput);
  }
  el.addEventListener('change', () => {
    if (onInput && !matchesInputEventBehavior(el)) {
      onInput();
    }
    commitHistoryDraft();
  });
}

function matchesInputEventBehavior(el) {
  return el.matches('input[type="range"], input[type="number"], select');
}

function loadFile(file) {
  const url = URL.createObjectURL(file);
  const image = new Image();
  image.onload = () => {
    URL.revokeObjectURL(url);
    commitLoadedImage(
      image,
      file.name.replace(/\.[^.]+$/, '') || 'kindle_screensaver',
      `${file.name} - ${image.naturalWidth} x ${image.naturalHeight}`
    );
  };
  image.onerror = () => {
    URL.revokeObjectURL(url);
    els.uploadMeta.textContent = 'Could not load image';
  };
  image.src = url;
}

function loadImageFromPath(src, imageName, metaText) {
  const image = new Image();
  image.decoding = 'async';
  image.onload = () => {
    commitLoadedImage(
      image,
      imageName || 'favorite_image',
      metaText || `${imageName || 'Favorite image'} - ${image.naturalWidth} x ${image.naturalHeight}`
    );
  };
  image.onerror = () => {
    els.uploadMeta.textContent = 'Could not load favorite image';
  };
  image.src = src;
}

function commitLoadedImage(image, name, metaText) {
  state.image = image;
  state.imageName = name;
  initializeSourceImageState(image);
  clearHistory();
  state.selectionRect = null;
  state.selectionMode = false;
  state.instantAlphaMode = false;
  els.uploadMeta.textContent = metaText;
  els.emptyState.hidden = true;
  els.downloadBtn.disabled = false;
  resetEdits();
  syncInteractionState();
}

function loadDemoImageIfRequested() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('demo') !== 'instant-alpha') return;

  const demoCanvas = document.createElement('canvas');
  demoCanvas.width = 1200;
  demoCanvas.height = 1600;
  const ctx = demoCanvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, demoCanvas.width, demoCanvas.height);

  ctx.fillStyle = '#d9d9d9';
  ctx.fillRect(120, 140, 960, 1280);

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(190, 210, 320, 250);

  ctx.fillStyle = '#1c1c1c';
  ctx.beginPath();
  ctx.ellipse(610, 650, 240, 280, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#f0c7a3';
  ctx.beginPath();
  ctx.ellipse(610, 575, 150, 170, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#8a4f2b';
  ctx.beginPath();
  ctx.ellipse(610, 520, 160, 105, 0, Math.PI, 0);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = '700 68px Georgia';
  ctx.fillText('Sample Card', 240, 370);

  const image = new Image();
  image.onload = () => {
    commitLoadedImage(image, 'instant-alpha-demo', `Demo image - ${image.naturalWidth} x ${image.naturalHeight}`);
  };
  image.src = demoCanvas.toDataURL('image/png');
}

function updateFavoriteImportState() {
  if (!els.favoriteImportBtn) return;
  const count = favoritesApi ? favoritesApi.loadFavorites().length : 0;
  els.favoriteImportBtn.disabled = count === 0;
}

function openFavoritesPicker() {
  if (!favoritesApi) return;
  renderFavoritesPicker();
  if (els.favoritesPicker) {
    els.favoritesPicker.hidden = false;
  }
}

function closeFavoritesPicker() {
  if (els.favoritesPicker) {
    els.favoritesPicker.hidden = true;
  }
}

function renderFavoritesPicker() {
  if (!els.favoritesPickerGrid || !els.favoritesPickerEmpty) return;
  const favorites = favoritesApi ? favoritesApi.loadFavorites() : [];
  els.favoritesPickerGrid.innerHTML = '';
  els.favoritesPickerEmpty.hidden = favorites.length !== 0;

  if (favorites.length === 0) {
    return;
  }

  const fragment = document.createDocumentFragment();
  favorites.forEach(entry => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'studio-favorite-tile';
    button.title = `${entry.author} - ${entry.filename}`;

    const thumb = document.createElement('img');
    thumb.className = 'studio-favorite-thumb';
    thumb.alt = entry.filename;
    thumb.loading = 'lazy';
    thumb.decoding = 'async';
    thumb.src = favoritesApi.imagePath(entry.author, entry.filename);

    const label = document.createElement('div');
    label.className = 'studio-favorite-meta';
    label.innerHTML = `
      <strong>${escapeHtml(entry.author)}</strong>
      <span>${escapeHtml(entry.filename)}</span>
    `;

    button.appendChild(thumb);
    button.appendChild(label);
    button.addEventListener('click', () => {
      closeFavoritesPicker();
      const fileBase = entry.filename.replace(/\.[^.]+$/, '') || 'favorite_image';
      loadImageFromPath(
        favoritesApi.imagePath(entry.author, entry.filename),
        fileBase,
        `${entry.author} / ${entry.filename}`
      );
    });
    fragment.appendChild(button);
  });

  els.favoritesPickerGrid.appendChild(fragment);
}

function handleSizeInput() {
  state.width = clamp(parseInt(els.targetWidth.value, 10) || state.width, 100, 4096);
  state.height = clamp(parseInt(els.targetHeight.value, 10) || state.height, 100, 4096);
  syncDevicePresetFromSize();
  updateCanvasInfo();
  fitImage(true);
}

function rotate(delta) {
  state.rotation = (state.rotation + delta + 360) % 360;
  fitImage(true);
}

function resetEdits() {
  state.rotation = 0;
  state.flipX = 1;
  state.flipY = 1;
  state.instantAlphaMode = false;
  state.selectionMode = false;
  clearSelection(false);
  applyDisplayLook('balanced');
  clearCutoutMask(false);
  syncStateToControls();
  syncInteractionState();
  fitImage(true);
}

function applyDisplayLook(name) {
  const preset = LOOK_PRESETS[name] || LOOK_PRESETS.balanced;
  state.displayLook = LOOK_PRESETS[name] ? name : 'custom';
  Object.assign(state, preset);
}

function syncDisplayLookFromState() {
  const match = LOOK_KEYS.find(key => lookPresetMatchesState(LOOK_PRESETS[key]));
  state.displayLook = match || 'custom';
  if (els.displayLook) {
    els.displayLook.value = state.displayLook;
  }
}

function lookPresetMatchesState(preset) {
  return Object.keys(preset).every(key => state[key] === preset[key]);
}

function syncControlsToState() {
  state.brightness = Number(els.brightness.value);
  state.contrast = Number(els.contrast.value);
  state.saturation = Number(els.saturation.value);
  state.exposure = Number(els.exposure.value);
  state.gamma = Number(els.gamma.value) / 100;
  state.sharpen = Number(els.sharpen.value);
  state.grayscale = els.grayscale.checked;
  state.autoLevels = els.autoLevels.checked;
  state.invert = els.invert.checked;
  state.border = els.border.checked;
  state.ditherMode = els.ditherMode.value;
  state.threshold = Number(els.threshold.value);
  state.exportFormat = els.exportFormat.value;
  state.alphaTolerance = Number(els.alphaTolerance.value);
  syncDisplayLookFromState();
  updateValueLabels();
}

function syncStateToControls() {
  els.targetWidth.value = state.width;
  els.targetHeight.value = state.height;
  els.fitMode.value = state.fitMode;
  els.backgroundColor.value = state.background;
  els.brightness.value = state.brightness;
  els.contrast.value = state.contrast;
  els.saturation.value = state.saturation;
  els.exposure.value = state.exposure;
  els.gamma.value = Math.round(state.gamma * 100);
  els.sharpen.value = state.sharpen;
  els.grayscale.checked = state.grayscale;
  els.autoLevels.checked = state.autoLevels;
  els.invert.checked = state.invert;
  els.border.checked = state.border;
  els.ditherMode.value = state.ditherMode;
  els.threshold.value = state.threshold;
  els.exportFormat.value = state.exportFormat;
  els.alphaTolerance.value = state.alphaTolerance;
  els.displayLook.value = state.displayLook;
  els.zoom.value = Math.round((state.scale / Math.max(state.minScale, 0.0001)) * 100) || 100;
  if (els.zoomInput) {
    els.zoomInput.value = els.zoom.value;
  }
  syncDevicePresetFromSize();
  updateCanvasInfo();
  updateValueLabels();
  updateInstantAlphaUI();
  updateSelectionUI();
  updateHistoryButtons();
}

function updateValueLabels() {
  const z = `${Math.round(Number(els.zoom.value))}%`;
  setText('zoomValue', z);
  if (els.zoomInput) {
    els.zoomInput.value = String(Math.round(Number(els.zoom.value)));
  }
  setText('brightnessValue', `${state.brightness}%`);
  setText('contrastValue', `${state.contrast}%`);
  setText('saturationValue', `${state.saturation}%`);
  setText('exposureValue', `${state.exposure}`);
  setText('gammaValue', state.gamma.toFixed(2));
  setText('sharpenValue', `${state.sharpen}`);
  setText('thresholdValue', `${state.threshold}`);
  setText('alphaToleranceValue', `${state.alphaTolerance}`);
  if (els.thresholdGroup) {
    els.thresholdGroup.hidden = state.ditherMode !== 'threshold';
  }
}

function updateZoomFromControl() {
  if (!state.image) return;
  const oldScale = state.scale;
  const zoom = Number(els.zoom.value) / 100;
  state.scale = state.minScale * zoom;
  const cx = state.width / 2;
  const cy = state.height / 2;
  state.offsetX = cx - (cx - state.offsetX) * (state.scale / oldScale);
  state.offsetY = cy - (cy - state.offsetY) * (state.scale / oldScale);
  constrainOffsets();
  updateValueLabels();
}

function commitZoomInput() {
  if (!state.image || !els.zoomInput) return;
  const next = sanitizeZoomInput(els.zoomInput.value);
  els.zoomInput.value = String(next);
  els.zoom.value = String(next);
  updateZoomFromControl();
  requestPreviewRender();
  commitHistoryDraft();
}

function restoreZoomInput() {
  if (!els.zoomInput) return;
  els.zoomInput.value = String(Math.round(Number(els.zoom.value)) || 100);
}

function fitImage(updateZoom) {
  if (!state.image) {
    updateCanvasInfo();
    requestPreviewRender();
    return;
  }

  const dims = transformedImageSize();
  const cover = Math.max(state.width / dims.width, state.height / dims.height);
  const contain = Math.min(state.width / dims.width, state.height / dims.height);
  state.minScale = state.fitMode === 'contain' ? contain : cover;
  state.scale = state.minScale;
  centerImage(false);
  if (updateZoom) {
    els.zoom.value = 100;
    updateValueLabels();
  }
  updateCanvasInfo();
  requestPreviewRender();
}

function centerImage(redraw = true) {
  if (!state.image) return;
  const dims = transformedImageSize();
  state.offsetX = (state.width - dims.width * state.scale) / 2;
  state.offsetY = (state.height - dims.height * state.scale) / 2;
  constrainOffsets();
  if (redraw) requestPreviewRender();
}

function resizePreview() {
  const rect = els.canvasWrap.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;
  const cssWidth = Math.max(320, Math.floor(rect.width));
  const cssHeight = Math.max(360, Math.floor(rect.height));
  els.editorCanvas.width = Math.floor(cssWidth * ratio);
  els.editorCanvas.height = Math.floor(cssHeight * ratio);
  els.editorCanvas.style.width = `${cssWidth}px`;
  els.editorCanvas.style.height = `${cssHeight}px`;
  drawPreview();
}

function requestPreviewRender() {
  if (state.previewRenderQueued) return;
  state.previewRenderQueued = true;
  window.requestAnimationFrame(() => {
    state.previewRenderQueued = false;
    drawPreview();
  });
}

function drawPreview() {
  const canvas = els.editorCanvas;
  const ctx = canvas.getContext('2d');
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const ratio = window.devicePixelRatio || 1;
  ctx.scale(ratio, ratio);
  const cssWidth = canvas.width / ratio;
  const cssHeight = canvas.height / ratio;

  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bg-base').trim() || '#111';
  ctx.fillRect(0, 0, cssWidth, cssHeight);

  const scale = Math.min(cssWidth / state.width, cssHeight / state.height) * 0.94;
  state.previewScale = scale;
  const frameWidth = state.width * scale;
  const frameHeight = state.height * scale;
  const x = (cssWidth - frameWidth) / 2;
  const y = (cssHeight - frameHeight) / 2;
  state.previewFrameX = x;
  state.previewFrameY = y;
  state.previewFrameWidth = frameWidth;
  state.previewFrameHeight = frameHeight;

  if (!state.image) {
    drawEmptyFrame(ctx, x, y, frameWidth, frameHeight);
    return;
  }

  if (state.background === 'transparent' || hasRemovedPixels()) {
    drawTransparencyGrid(ctx, x, y, frameWidth, frameHeight);
  }

  const renderWidth = Math.max(1, Math.round(frameWidth));
  const renderHeight = Math.max(1, Math.round(frameHeight));
  const output = renderOutput(state.background, renderWidth, renderHeight);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(output, x, y, frameWidth, frameHeight);

  drawSelectionOverlay(ctx, x, y, scale);
  drawCompositionGuide(ctx, x, y, frameWidth, frameHeight);

  ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#ddd';
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, frameWidth, frameHeight);

  ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
  ctx.fillRect(x + 10, y + 10, 152, 28);
  ctx.fillStyle = '#fff';
  ctx.font = '13px Inter, sans-serif';
  ctx.fillText(`${state.width} x ${state.height}`, x + 20, y + 29);
}

function updateCanvasInfo() {
  setText('canvasDimsDisplay', `${state.width} x ${state.height} px`);
}

function syncInteractionState() {
  const hasImage = Boolean(state.image);
  [
    'rotateLeftBtn',
    'rotateRightBtn',
    'flipXBtn',
    'flipYBtn',
    'centerBtn',
    'fitBtn',
    'resetBtn',
    'instantAlphaBtn',
    'instantAlphaSettingsBtn',
    'selectionModeBtn',
    'eraseSelectionBtn',
    'cropSelectionBtn',
    'alphaTolerance',
    'zoom',
    'zoomInput',
    'zoomInBtn',
    'zoomOutBtn',
    'brightness',
    'contrast',
    'saturation',
    'exposure',
    'gamma',
    'sharpen',
    'grayscale',
    'autoLevels',
    'invert',
    'border',
    'ditherMode',
    'threshold',
    'displayLook'
  ].forEach(id => {
    if (els[id]) {
      els[id].disabled = !hasImage;
    }
  });

  const hasSelection = Boolean(state.selectionRect);
  if (els.eraseSelectionBtn) {
    els.eraseSelectionBtn.disabled = !hasImage || !hasSelection;
  }
  if (els.cropSelectionBtn) {
    els.cropSelectionBtn.disabled = !hasImage || !hasSelection;
  }
  if (els.zoomOverlay) {
    els.zoomOverlay.hidden = !hasImage;
  }
  if (els.canvasWrap) {
    els.canvasWrap.classList.toggle('has-image', hasImage);
    els.canvasWrap.classList.toggle('is-dragging', state.dragging);
    els.canvasWrap.classList.toggle('is-alpha-pick', state.instantAlphaMode);
    els.canvasWrap.classList.toggle('is-selecting', state.selectionMode);
  }
  if (!hasImage && state.instantAlphaSettingsOpen) {
    toggleInstantAlphaSettings(false);
  }
  updateInstantAlphaUI();
  updateSelectionUI();
  updateHistoryButtons();
}

function drawEmptyFrame(ctx, x, y, width, height) {
  if (state.background === 'transparent') {
    drawTransparencyGrid(ctx, x, y, width, height);
  } else {
    ctx.fillStyle = state.background;
    ctx.fillRect(x, y, width, height);
  }
  ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--card-border').trim() || '#444';
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, width, height);
}

function drawTransparencyGrid(ctx, x, y, width, height) {
  const tile = 18;
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, width, height);
  ctx.clip();
  ctx.fillStyle = '#f3f4f6';
  ctx.fillRect(x, y, width, height);
  ctx.fillStyle = '#dde2e7';
  for (let row = 0; row < Math.ceil(height / tile); row++) {
    for (let col = 0; col < Math.ceil(width / tile); col++) {
      if ((row + col) % 2 === 0) continue;
      ctx.fillRect(x + col * tile, y + row * tile, tile, tile);
    }
  }
  ctx.restore();
}

function drawSelectionOverlay(ctx, frameX, frameY, scale) {
  if (!state.selectionRect) return;

  const x = frameX + state.selectionRect.x * scale;
  const y = frameY + state.selectionRect.y * scale;
  const width = state.selectionRect.width * scale;
  const height = state.selectionRect.height * scale;

  ctx.save();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
  ctx.beginPath();
  ctx.rect(frameX, frameY, state.previewFrameWidth, state.previewFrameHeight);
  ctx.rect(x, y, width, height);
  ctx.fill('evenodd');

  ctx.setLineDash([8, 6]);
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#ffffff';
  ctx.strokeRect(x, y, width, height);
  ctx.setLineDash([8, 6]);
  ctx.lineDashOffset = 7;
  ctx.strokeStyle = '#111111';
  ctx.strokeRect(x, y, width, height);
  ctx.restore();
}

function drawCompositionGuide(ctx, frameX, frameY, width, height) {
  if (!state.image || !state.compositionGuide) return;

  const x1 = frameX + width / 3;
  const x2 = frameX + (width * 2) / 3;
  const y1 = frameY + height / 3;
  const y2 = frameY + (height * 2) / 3;

  ctx.save();
  ctx.beginPath();
  ctx.rect(frameX, frameY, width, height);
  ctx.clip();

  ctx.lineWidth = 1;

  ctx.strokeStyle = 'rgba(0, 0, 0, 0.32)';
  [x1, x2].forEach(x => {
    ctx.beginPath();
    ctx.moveTo(x, frameY);
    ctx.lineTo(x, frameY + height);
    ctx.stroke();
  });
  [y1, y2].forEach(y => {
    ctx.beginPath();
    ctx.moveTo(frameX, y);
    ctx.lineTo(frameX + width, y);
    ctx.stroke();
  });

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
  [x1, x2].forEach(x => {
    ctx.beginPath();
    ctx.moveTo(x + 0.5, frameY);
    ctx.lineTo(x + 0.5, frameY + height);
    ctx.stroke();
  });
  [y1, y2].forEach(y => {
    ctx.beginPath();
    ctx.moveTo(frameX, y + 0.5);
    ctx.lineTo(frameX + width, y + 0.5);
    ctx.stroke();
  });

  ctx.restore();
}

function renderOutput(backgroundOverride = state.background, targetWidth = state.width, targetHeight = state.height) {
  const canvas = targetWidth === state.previewOutputCanvas.width && targetHeight === state.previewOutputCanvas.height
    ? state.previewOutputCanvas
    : document.createElement('canvas');
  renderIntoCanvas(canvas, backgroundOverride, targetWidth, targetHeight);
  if (canvas !== state.previewOutputCanvas && targetWidth !== state.width) {
    state.previewOutputCanvas = canvas;
  }
  return canvas;
}

function renderIntoCanvas(canvas, backgroundOverride, targetWidth, targetHeight) {
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  if (backgroundOverride !== 'transparent') {
    ctx.fillStyle = backgroundOverride;
    ctx.fillRect(0, 0, targetWidth, targetHeight);
  } else {
    ctx.clearRect(0, 0, targetWidth, targetHeight);
  }

  drawTransformedImage(ctx, targetWidth, targetHeight);

  const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);
  processPixels(imageData);
  ctx.putImageData(imageData, 0, 0);

  if (state.sharpen > 0) {
    sharpenCanvas(ctx, targetWidth, targetHeight, state.sharpen / 100);
  }

  if (state.border) {
    ctx.save();
    ctx.strokeStyle = state.invert ? '#fff' : '#000';
    ctx.lineWidth = Math.max(2, Math.round(Math.min(targetWidth, targetHeight) * 0.002));
    ctx.strokeRect(ctx.lineWidth / 2, ctx.lineWidth / 2, targetWidth - ctx.lineWidth, targetHeight - ctx.lineWidth);
    ctx.restore();
  }
}

function drawTransformedImage(ctx, targetWidth = state.width, targetHeight = state.height) {
  const dims = transformedImageSize();
  const renderScaleX = targetWidth / state.width;
  const renderScaleY = targetHeight / state.height;
  const cx = (state.offsetX + dims.width * state.scale / 2) * renderScaleX;
  const cy = (state.offsetY + dims.height * state.scale / 2) * renderScaleY;
  const source = getMaskedSourceCanvas() || state.image;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((state.rotation * Math.PI) / 180);
  ctx.scale(state.flipX, state.flipY);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(
    source,
    -(state.image.naturalWidth * state.scale * renderScaleX) / 2,
    -(state.image.naturalHeight * state.scale * renderScaleY) / 2,
    state.image.naturalWidth * state.scale * renderScaleX,
    state.image.naturalHeight * state.scale * renderScaleY
  );
  ctx.restore();
}

function processPixels(imageData) {
  const data = imageData.data;
  const exposure = state.exposure * 2.55;
  const contrast = state.contrast / 100;
  const brightness = state.brightness / 100;
  const saturation = state.grayscale ? 0 : state.saturation / 100;
  const gamma = Math.max(0.1, state.gamma);

  let min = 255;
  let max = 0;
  if (state.autoLevels) {
    for (let i = 0; i < data.length; i += 4) {
      const luma = luminance(data[i], data[i + 1], data[i + 2]);
      min = Math.min(min, luma);
      max = Math.max(max, luma);
    }
    if (max - min < 8) {
      min = 0;
      max = 255;
    }
  }

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    [r, g, b] = applySaturation(r, g, b, saturation);
    r = applyTone(r, brightness, contrast, exposure, gamma);
    g = applyTone(g, brightness, contrast, exposure, gamma);
    b = applyTone(b, brightness, contrast, exposure, gamma);

    if (state.autoLevels) {
      r = ((r - min) * 255) / (max - min);
      g = ((g - min) * 255) / (max - min);
      b = ((b - min) * 255) / (max - min);
    }

    if (state.grayscale) {
      const gray = luminance(r, g, b);
      r = gray;
      g = gray;
      b = gray;
    }

    if (state.invert) {
      r = 255 - r;
      g = 255 - g;
      b = 255 - b;
    }

    data[i] = clamp(Math.round(r), 0, 255);
    data[i + 1] = clamp(Math.round(g), 0, 255);
    data[i + 2] = clamp(Math.round(b), 0, 255);
  }

  if (state.ditherMode === 'threshold') applyThreshold(imageData, state.threshold);
  if (state.ditherMode === 'bayer') applyBayer(imageData, state.threshold);
  if (state.ditherMode === 'floyd') applyFloydSteinberg(imageData, state.threshold);
}

function applyTone(value, brightness, contrast, exposure, gamma) {
  let next = value * brightness + exposure;
  next = (next - 128) * contrast + 128;
  next = 255 * Math.pow(clamp(next, 0, 255) / 255, 1 / gamma);
  return next;
}

function applySaturation(r, g, b, amount) {
  const gray = luminance(r, g, b);
  return [
    gray + (r - gray) * amount,
    gray + (g - gray) * amount,
    gray + (b - gray) * amount
  ];
}

function applyThreshold(imageData, threshold) {
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const value = luminance(data[i], data[i + 1], data[i + 2]) >= threshold ? 255 : 0;
    data[i] = value;
    data[i + 1] = value;
    data[i + 2] = value;
  }
}

function applyBayer(imageData, threshold) {
  const matrix = [
    [0, 8, 2, 10],
    [12, 4, 14, 6],
    [3, 11, 1, 9],
    [15, 7, 13, 5]
  ];
  const data = imageData.data;
  for (let y = 0; y < imageData.height; y++) {
    for (let x = 0; x < imageData.width; x++) {
      const i = (y * imageData.width + x) * 4;
      const value = luminance(data[i], data[i + 1], data[i + 2]);
      const dither = (matrix[y % 4][x % 4] - 7.5) * 10;
      const out = value + dither >= threshold ? 255 : 0;
      data[i] = out;
      data[i + 1] = out;
      data[i + 2] = out;
    }
  }
}

function applyFloydSteinberg(imageData, threshold) {
  const width = imageData.width;
  const height = imageData.height;
  const data = imageData.data;
  const values = new Float32Array(width * height);

  for (let i = 0, p = 0; i < data.length; i += 4, p++) {
    values[p] = luminance(data[i], data[i + 1], data[i + 2]);
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const p = y * width + x;
      const old = values[p];
      const next = old >= threshold ? 255 : 0;
      const err = old - next;
      values[p] = next;
      if (x + 1 < width) values[p + 1] += err * 7 / 16;
      if (y + 1 < height) {
        if (x > 0) values[p + width - 1] += err * 3 / 16;
        values[p + width] += err * 5 / 16;
        if (x + 1 < width) values[p + width + 1] += err * 1 / 16;
      }
    }
  }

  for (let i = 0, p = 0; i < data.length; i += 4, p++) {
    const out = values[p] >= 128 ? 255 : 0;
    data[i] = out;
    data[i + 1] = out;
    data[i + 2] = out;
  }
}

function sharpenCanvas(ctx, width, height, amount) {
  const src = ctx.getImageData(0, 0, width, height);
  const dst = ctx.createImageData(width, height);
  const s = src.data;
  const d = dst.data;
  const center = 1 + 4 * amount;
  const side = -amount;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      for (let c = 0; c < 3; c++) {
        const here = s[i + c] * center;
        const left = s[(y * width + Math.max(0, x - 1)) * 4 + c] * side;
        const right = s[(y * width + Math.min(width - 1, x + 1)) * 4 + c] * side;
        const up = s[(Math.max(0, y - 1) * width + x) * 4 + c] * side;
        const down = s[(Math.min(height - 1, y + 1) * width + x) * 4 + c] * side;
        d[i + c] = clamp(Math.round(here + left + right + up + down), 0, 255);
      }
      d[i + 3] = s[i + 3];
    }
  }
  ctx.putImageData(dst, 0, 0);
}

function startInteraction(event) {
  if (!state.image) return;
  if (state.selectionMode) {
    beginSelection(event);
    return;
  }
  if (state.instantAlphaMode) {
    beginAlphaStroke(event);
    return;
  }

  event.preventDefault();
  els.editorCanvas.setPointerCapture(event.pointerId);
  state.dragHistorySnapshot = captureHistorySnapshot();
  state.dragging = true;
  state.lastX = event.clientX;
  state.lastY = event.clientY;
  syncInteractionState();
}

function moveInteraction(event) {
  if (state.selectionDragging) {
    updateSelectionDrag(event);
    return;
  }
  if (state.alphaPainting) {
    applyInstantAlphaAtPointer(event);
    return;
  }
  if (!state.dragging || !state.image) return;

  event.preventDefault();
  const dx = (event.clientX - state.lastX) / state.previewScale;
  const dy = (event.clientY - state.lastY) / state.previewScale;
  state.offsetX += dx;
  state.offsetY += dy;
  constrainOffsets();
  state.lastX = event.clientX;
  state.lastY = event.clientY;
  requestPreviewRender();
}

function endInteraction(event) {
  if (state.selectionDragging) {
    finishSelectionDrag(event);
    return;
  }
  if (state.alphaPainting) {
    finishAlphaStroke(event);
    return;
  }

  const wasDragging = state.dragging;
  if (state.dragging && event.pointerId != null) {
    try {
      els.editorCanvas.releasePointerCapture(event.pointerId);
    } catch (error) {}
  }

  const before = state.dragHistorySnapshot;
  state.dragging = false;
  state.dragHistorySnapshot = null;
  if (wasDragging) {
    syncInteractionState();
  }
  if (before) {
    commitHistorySnapshot(before);
  }
}

function beginAlphaStroke(event) {
  event.preventDefault();
  els.editorCanvas.setPointerCapture(event.pointerId);
  state.alphaPainting = true;
  state.alphaStrokeSnapshot = captureHistorySnapshot({ includeMask: true });
  state.alphaStrokeChanged = false;
  applyInstantAlphaAtPointer(event);
}

function finishAlphaStroke(event) {
  if (event.pointerId != null) {
    try {
      els.editorCanvas.releasePointerCapture(event.pointerId);
    } catch (error) {}
  }
  const before = state.alphaStrokeSnapshot;
  const changed = state.alphaStrokeChanged;
  state.alphaPainting = false;
  state.alphaStrokeSnapshot = null;
  state.alphaStrokeChanged = false;
  syncInteractionState();
  if (before && changed) {
    commitHistorySnapshot(before);
  }
}

function beginSelection(event) {
  const point = pointerEventToOutputPoint(event, { clampToFrame: true });
  if (!point) return;

  event.preventDefault();
  els.editorCanvas.setPointerCapture(event.pointerId);
  state.selectionDragging = true;
  state.selectionStart = point;
  state.selectionRect = { x: point.x, y: point.y, width: 0, height: 0 };
  updateSelectionUI();
  requestPreviewRender();
}

function updateSelectionDrag(event) {
  const point = pointerEventToOutputPoint(event, { clampToFrame: true });
  if (!point) return;

  event.preventDefault();
  state.selectionRect = normalizeRect(state.selectionStart.x, state.selectionStart.y, point.x, point.y);
  updateSelectionUI();
  requestPreviewRender();
}

function finishSelectionDrag(event) {
  if (event.pointerId != null) {
    try {
      els.editorCanvas.releasePointerCapture(event.pointerId);
    } catch (error) {}
  }

  state.selectionDragging = false;
  state.selectionStart = null;
  if (state.selectionRect && (state.selectionRect.width < 4 || state.selectionRect.height < 4)) {
    state.selectionRect = null;
  }
  syncInteractionState();
  updateSelectionUI();
  requestPreviewRender();
}

function handleWheel(event) {
  if (!state.image) return;
  event.preventDefault();
  armHistoryDraft();
  clearTimeout(state.wheelHistoryTimer);
  els.zoom.value = clamp(Number(els.zoom.value) + (event.deltaY < 0 ? 8 : -8), 25, 400);
  syncControlsToState();
  updateZoomFromControl();
  requestPreviewRender();
  state.wheelHistoryTimer = window.setTimeout(() => {
    commitHistoryDraft();
    state.wheelHistoryTimer = null;
  }, 180);
}

function constrainOffsets() {
  if (!state.image) return;
  const dims = transformedImageSize();
  const scaledWidth = dims.width * state.scale;
  const scaledHeight = dims.height * state.scale;

  if (scaledWidth <= state.width) {
    state.offsetX = clamp(state.offsetX, 0, state.width - scaledWidth);
  } else {
    state.offsetX = clamp(state.offsetX, state.width - scaledWidth, 0);
  }

  if (scaledHeight <= state.height) {
    state.offsetY = clamp(state.offsetY, 0, state.height - scaledHeight);
  } else {
    state.offsetY = clamp(state.offsetY, state.height - scaledHeight, 0);
  }
}

function downloadImage() {
  if (!state.image) return;
  const exportBackground = state.exportFormat === 'image/jpeg' && state.background === 'transparent'
    ? '#ffffff'
    : state.background;
  const output = renderOutput(exportBackground, state.width, state.height);
  const link = document.createElement('a');
  const ext = state.exportFormat === 'image/jpeg' ? 'jpg' : state.exportFormat === 'image/webp' ? 'webp' : 'png';
  link.download = `${slugify(state.imageName)}_${state.width}x${state.height}.${ext}`;
  link.href = output.toDataURL(state.exportFormat, 0.92);
  link.click();
}

function initializeSourceImageState(image) {
  const canvas = document.createElement('canvas');
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(image, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  state.sourceCanvas = canvas;
  state.sourcePixels = imageData.data;
  state.sourceMask = new Uint8ClampedArray(canvas.width * canvas.height);
  state.sourceMask.fill(255);
  state.removedPixelCount = 0;
  state.maskedSourceCanvas = document.createElement('canvas');
  state.maskedSourceCanvas.width = canvas.width;
  state.maskedSourceCanvas.height = canvas.height;
  state.maskedSourceDirty = true;
}

function getMaskedSourceCanvas() {
  if (!state.image || !state.maskedSourceCanvas || !state.sourcePixels || !state.sourceMask) return null;
  if (!state.maskedSourceDirty) return state.maskedSourceCanvas;

  const ctx = state.maskedSourceCanvas.getContext('2d', { willReadFrequently: true });
  const imageData = ctx.createImageData(state.maskedSourceCanvas.width, state.maskedSourceCanvas.height);
  const out = imageData.data;
  for (let i = 0, p = 0; i < state.sourceMask.length; i++, p += 4) {
    out[p] = state.sourcePixels[p];
    out[p + 1] = state.sourcePixels[p + 1];
    out[p + 2] = state.sourcePixels[p + 2];
    out[p + 3] = Math.round((state.sourcePixels[p + 3] * state.sourceMask[i]) / 255);
  }
  ctx.putImageData(imageData, 0, 0);
  state.maskedSourceDirty = false;
  return state.maskedSourceCanvas;
}

function toggleInstantAlphaMode() {
  if (!state.image) return;
  state.instantAlphaMode = !state.instantAlphaMode;
  if (state.instantAlphaMode) {
    state.selectionMode = false;
  }
  syncInteractionState();
}

function toggleInstantAlphaSettings(forceOpen) {
  const next = typeof forceOpen === 'boolean' ? forceOpen : !state.instantAlphaSettingsOpen;
  state.instantAlphaSettingsOpen = next;
  if (els.instantAlphaSettingsPanel) {
    els.instantAlphaSettingsPanel.hidden = !next;
  }
  if (els.instantAlphaSettingsBtn) {
    els.instantAlphaSettingsBtn.setAttribute('aria-expanded', String(next));
    els.instantAlphaSettingsBtn.classList.toggle('is-active', next);
  }
}

function updateInstantAlphaUI() {
  setText('alphaToleranceValue', `${state.alphaTolerance}`);
  if (els.instantAlphaBtn) {
    els.instantAlphaBtn.classList.toggle('is-active', state.instantAlphaMode);
    els.instantAlphaBtn.setAttribute('aria-pressed', String(state.instantAlphaMode));
    els.instantAlphaBtn.setAttribute('title', state.instantAlphaMode ? 'Remove Background (active)' : 'Remove Background');
  }
  if (els.instantAlphaSettingsBtn) {
    els.instantAlphaSettingsBtn.setAttribute('aria-expanded', String(state.instantAlphaSettingsOpen));
    els.instantAlphaSettingsBtn.classList.toggle('is-active', state.instantAlphaSettingsOpen);
  }
  if (els.instantAlphaSettingsPanel) {
    els.instantAlphaSettingsPanel.hidden = !state.instantAlphaSettingsOpen;
  }
}

function applyInstantAlphaAtPointer(event) {
  const outputPoint = pointerEventToOutputPoint(event, { clampToFrame: true });
  if (!outputPoint) {
    return;
  }

  const sourcePoint = outputPointToSourcePoint(outputPoint.x, outputPoint.y);
  if (!sourcePoint) {
    return;
  }

  const removed = removeContiguousColorRegion(sourcePoint.x, sourcePoint.y, state.alphaTolerance);
  if (removed > 0) {
    state.maskedSourceDirty = true;
    state.alphaStrokeChanged = true;
    if (state.background !== 'transparent') {
      state.background = 'transparent';
      els.backgroundColor.value = 'transparent';
    }
    syncDisplayLookFromState();
    syncInteractionState();
    requestPreviewRender();
  }
}

function toggleSelectionMode() {
  if (!state.image) return;
  const next = !state.selectionMode;
  state.selectionMode = next;
  if (next) {
    state.instantAlphaMode = false;
  } else {
    clearSelection(false);
  }
  syncInteractionState();
}

function updateSelectionUI() {
  if (els.selectionModeBtn) {
    els.selectionModeBtn.classList.toggle('is-active', state.selectionMode);
    els.selectionModeBtn.setAttribute('aria-pressed', String(state.selectionMode));
    const label = state.selectionMode ? 'Drawing Selection' : 'Select Area';
    els.selectionModeBtn.setAttribute('aria-label', label);
    els.selectionModeBtn.setAttribute('title', label);
  }
  if (els.selectionHint) {
    if (state.selectionRect) {
      els.selectionHint.textContent = `Selection ready: ${Math.round(state.selectionRect.width)} x ${Math.round(state.selectionRect.height)} px.`;
    } else {
      els.selectionHint.textContent = '';
    }
  }
}

function clearSelection(redraw = true) {
  state.selectionRect = null;
  updateSelectionUI();
  syncInteractionState();
  if (redraw) requestPreviewRender();
}

function eraseSelectionArea() {
  if (!state.selectionRect || !state.sourceMask) return;
  const before = captureHistorySnapshot({ includeMask: true });
  const removed = removeSelectionRect(state.selectionRect);
  if (removed > 0) {
    state.maskedSourceDirty = true;
    if (state.background !== 'transparent') {
      state.background = 'transparent';
      els.backgroundColor.value = 'transparent';
    }
    state.selectionRect = null;
    commitHistorySnapshot(before);
    syncInteractionState();
    if (els.selectionHint) {
      els.selectionHint.textContent = `Removed ${removed.toLocaleString()} pixels inside the current selection.`;
    }
    requestPreviewRender();
  }
}

function cropToSelection() {
  if (!state.selectionRect || !state.image) return;
  const cropX = clamp(Math.round(state.selectionRect.x), 0, state.width - 1);
  const cropY = clamp(Math.round(state.selectionRect.y), 0, state.height - 1);
  const cropWidth = clamp(Math.round(state.selectionRect.width), 1, state.width - cropX);
  const cropHeight = clamp(Math.round(state.selectionRect.height), 1, state.height - cropY);

  const output = renderOutput(state.background, state.width, state.height);
  const cropCanvas = document.createElement('canvas');
  cropCanvas.width = cropWidth;
  cropCanvas.height = cropHeight;
  const ctx = cropCanvas.getContext('2d');
  ctx.drawImage(output, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

  const image = new Image();
  image.onload = () => {
    commitLoadedImage(image, `${state.imageName}-crop`, `Cropped image - ${cropWidth} x ${cropHeight}`);
    state.width = cropWidth;
    state.height = cropHeight;
    syncDevicePresetFromSize();
    syncStateToControls();
    fitImage(true);
  };
  image.src = cropCanvas.toDataURL('image/png');
}

function pointerEventToOutputPoint(event, { clampToFrame = false } = {}) {
  const rect = els.editorCanvas.getBoundingClientRect();
  let localX = event.clientX - rect.left;
  let localY = event.clientY - rect.top;

  if (clampToFrame) {
    localX = clamp(localX, state.previewFrameX, state.previewFrameX + state.previewFrameWidth);
    localY = clamp(localY, state.previewFrameY, state.previewFrameY + state.previewFrameHeight);
  }

  if (
    localX < state.previewFrameX ||
    localY < state.previewFrameY ||
    localX > state.previewFrameX + state.previewFrameWidth ||
    localY > state.previewFrameY + state.previewFrameHeight
  ) {
    return null;
  }

  return {
    x: (localX - state.previewFrameX) / state.previewScale,
    y: (localY - state.previewFrameY) / state.previewScale
  };
}

function outputPointToSourcePoint(x, y) {
  if (!state.image) return null;
  const dims = transformedImageSize();
  const cx = state.offsetX + dims.width * state.scale / 2;
  const cy = state.offsetY + dims.height * state.scale / 2;
  const px = x - cx;
  const py = y - cy;
  const theta = (state.rotation * Math.PI) / 180;
  const cos = Math.cos(theta);
  const sin = Math.sin(theta);
  const rx = px * cos + py * sin;
  const ry = -px * sin + py * cos;
  const unflippedX = rx / state.flipX;
  const unflippedY = ry / state.flipY;
  const sourceX = Math.round(unflippedX / state.scale + state.image.naturalWidth / 2);
  const sourceY = Math.round(unflippedY / state.scale + state.image.naturalHeight / 2);
  if (
    sourceX < 0 ||
    sourceY < 0 ||
    sourceX >= state.image.naturalWidth ||
    sourceY >= state.image.naturalHeight
  ) {
    return null;
  }
  return { x: sourceX, y: sourceY };
}

function sourcePointToOutputPoint(x, y) {
  if (!state.image) return null;
  const localX = (x - state.image.naturalWidth / 2) * state.scale * state.flipX;
  const localY = (y - state.image.naturalHeight / 2) * state.scale * state.flipY;
  const theta = (state.rotation * Math.PI) / 180;
  const cos = Math.cos(theta);
  const sin = Math.sin(theta);
  const rotatedX = localX * cos - localY * sin;
  const rotatedY = localX * sin + localY * cos;
  const dims = transformedImageSize();
  const centerX = state.offsetX + dims.width * state.scale / 2;
  const centerY = state.offsetY + dims.height * state.scale / 2;
  return {
    x: rotatedX + centerX,
    y: rotatedY + centerY
  };
}

function removeContiguousColorRegion(seedX, seedY, tolerance) {
  if (!state.sourcePixels || !state.sourceMask) return 0;
  const width = state.image.naturalWidth;
  const height = state.image.naturalHeight;
  const total = width * height;
  const seedIndex = seedY * width + seedX;
  if (seedIndex < 0 || seedIndex >= total || state.sourceMask[seedIndex] === 0) return 0;

  const seedOffset = seedIndex * 4;
  const sr = state.sourcePixels[seedOffset];
  const sg = state.sourcePixels[seedOffset + 1];
  const sb = state.sourcePixels[seedOffset + 2];
  const sa = state.sourcePixels[seedOffset + 3];
  if (sa === 0) return 0;

  const visited = new Uint8Array(total);
  const stack = new Int32Array(total);
  let stackSize = 0;
  let removed = 0;
  stack[stackSize++] = seedIndex;

  while (stackSize > 0) {
    const index = stack[--stackSize];
    if (visited[index]) continue;
    visited[index] = 1;
    if (state.sourceMask[index] === 0) continue;
    const offset = index * 4;
    if (!pixelMatchesTolerance(offset, sr, sg, sb, tolerance)) continue;

    state.sourceMask[index] = 0;
    removed++;

    const x = index % width;
    const y = (index / width) | 0;
    if (x > 0) stack[stackSize++] = index - 1;
    if (x + 1 < width) stack[stackSize++] = index + 1;
    if (y > 0) stack[stackSize++] = index - width;
    if (y + 1 < height) stack[stackSize++] = index + width;
  }

  if (removed > 0) {
    state.removedPixelCount += removed;
  }
  return removed;
}

function removeSelectionRect(rect) {
  let removed = 0;
  const minX = rect.x;
  const minY = rect.y;
  const maxX = rect.x + rect.width;
  const maxY = rect.y + rect.height;
  const width = state.image.naturalWidth;
  const height = state.image.naturalHeight;
  const padding = Math.max(0.9, Math.abs(state.scale) * 0.8);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = y * width + x;
      if (state.sourceMask[index] === 0) continue;
      const outputPoint = sourcePointToOutputPoint(x + 0.5, y + 0.5);
      if (!outputPoint) continue;
      if (
        outputPoint.x >= minX - padding &&
        outputPoint.x <= maxX + padding &&
        outputPoint.y >= minY - padding &&
        outputPoint.y <= maxY + padding
      ) {
        state.sourceMask[index] = 0;
        removed++;
      }
    }
  }

  if (removed > 0) {
    state.removedPixelCount += removed;
  }
  return removed;
}

function pixelMatchesTolerance(offset, sr, sg, sb, tolerance) {
  const dr = Math.abs(state.sourcePixels[offset] - sr);
  const dg = Math.abs(state.sourcePixels[offset + 1] - sg);
  const db = Math.abs(state.sourcePixels[offset + 2] - sb);
  return Math.max(dr, dg, db) <= tolerance;
}

function clearCutoutMask(redraw = true) {
  if (state.sourceMask) {
    state.sourceMask.fill(255);
    state.removedPixelCount = 0;
    state.maskedSourceDirty = true;
  }
  syncInteractionState();
  if (redraw) {
    requestPreviewRender();
  }
}

function hasRemovedPixels() {
  return state.removedPixelCount > 0;
}

function recalculateRemovedPixelCount() {
  if (!state.sourceMask) {
    state.removedPixelCount = 0;
    return;
  }
  let removed = 0;
  for (let i = 0; i < state.sourceMask.length; i++) {
    if (state.sourceMask[i] !== 255) removed++;
  }
  state.removedPixelCount = removed;
}

function transformedImageSize() {
  if (!state.image) return { width: state.width, height: state.height };
  const rotated = state.rotation % 180 !== 0;
  return rotated
    ? { width: state.image.naturalHeight, height: state.image.naturalWidth }
    : { width: state.image.naturalWidth, height: state.image.naturalHeight };
}

function syncDevicePresetFromSize() {
  const match = Object.entries(KINDLE_PRESETS).find(([, dims]) => dims && dims[0] === state.width && dims[1] === state.height);
  els.devicePreset.value = match ? match[0] : 'Custom';
}

function captureHistorySnapshot({ includeMask = false } = {}) {
  const snapshot = {};
  HISTORY_FIELDS.forEach(key => {
    snapshot[key] = state[key];
  });
  if (includeMask && state.sourceMask) {
    snapshot.sourceMask = state.sourceMask.slice();
  }
  return snapshot;
}

function commitHistorySnapshot(before) {
  if (!before) return false;
  clearTimeout(state.wheelHistoryTimer);
  state.wheelHistoryTimer = null;
  const after = captureHistorySnapshot({ includeMask: Boolean(before.sourceMask) });
  if (historySnapshotsEqual(before, after)) return false;
  state.undoStack.push(before);
  if (state.undoStack.length > HISTORY_LIMIT) {
    state.undoStack.shift();
  }
  state.redoStack = [];
  state.historyDraft = null;
  updateHistoryButtons();
  return true;
}

function historySnapshotsEqual(a, b) {
  for (const key of HISTORY_FIELDS) {
    if (a[key] !== b[key]) return false;
  }
  if (a.sourceMask || b.sourceMask) {
    if (!a.sourceMask || !b.sourceMask || a.sourceMask.length !== b.sourceMask.length) return false;
    for (let i = 0; i < a.sourceMask.length; i++) {
      if (a.sourceMask[i] !== b.sourceMask[i]) return false;
    }
  }
  return true;
}

function armHistoryDraft(options = {}) {
  const includeMask = Boolean(options.includeMask);
  if (!state.historyDraft) {
    state.historyDraft = captureHistorySnapshot({ includeMask });
    return;
  }
  if (includeMask && !state.historyDraft.sourceMask) {
    state.historyDraft = captureHistorySnapshot({ includeMask: true });
  }
}

function commitHistoryDraft() {
  if (!state.historyDraft) return;
  const before = state.historyDraft;
  state.historyDraft = null;
  commitHistorySnapshot(before);
}

function clearHistory() {
  state.undoStack = [];
  state.redoStack = [];
  state.historyDraft = null;
  state.dragHistorySnapshot = null;
  clearTimeout(state.wheelHistoryTimer);
  state.wheelHistoryTimer = null;
  updateHistoryButtons();
}

function updateHistoryButtons() {
  if (els.undoBtn) {
    els.undoBtn.disabled = state.undoStack.length === 0;
  }
  if (els.redoBtn) {
    els.redoBtn.disabled = state.redoStack.length === 0;
  }
}

function undoHistory() {
  if (state.undoStack.length === 0) return;
  const snapshot = state.undoStack.pop();
  const current = captureHistorySnapshot({ includeMask: Boolean(snapshot.sourceMask) });
  state.redoStack.push(current);
  applyHistorySnapshot(snapshot);
}

function redoHistory() {
  if (state.redoStack.length === 0) return;
  const snapshot = state.redoStack.pop();
  const current = captureHistorySnapshot({ includeMask: Boolean(snapshot.sourceMask) });
  state.undoStack.push(current);
  applyHistorySnapshot(snapshot);
}

function applyHistorySnapshot(snapshot) {
  HISTORY_FIELDS.forEach(key => {
    if (key in snapshot) {
      state[key] = snapshot[key];
    }
  });
  if (snapshot.sourceMask && state.sourceMask) {
    state.sourceMask = snapshot.sourceMask.slice();
    state.maskedSourceDirty = true;
    recalculateRemovedPixelCount();
  }
  state.dragging = false;
  state.alphaPainting = false;
  syncStateToControls();
  syncInteractionState();
  requestPreviewRender();
}

function handleKeyboardShortcuts(event) {
  if (event.defaultPrevented) return;
  const isInput = event.target && (
    event.target.tagName === 'INPUT' ||
    event.target.tagName === 'SELECT' ||
    event.target.tagName === 'TEXTAREA'
  );
  if (isInput) return;

  const key = event.key.toLowerCase();
  const wantsUndo = (event.metaKey || event.ctrlKey) && !event.shiftKey && key === 'z';
  const wantsRedo = (event.metaKey || event.ctrlKey) && (key === 'y' || (event.shiftKey && key === 'z'));
  const wantsRemoveSelection = state.selectionRect && !event.metaKey && !event.ctrlKey && (key === 'backspace' || key === 'delete');
  const wantsClearSelection = state.selectionRect && !event.metaKey && !event.ctrlKey && key === 'escape';
  const wantsCloseAlphaSettings = state.instantAlphaSettingsOpen && key === 'escape';
  const wantsCloseFavoritesPicker = els.favoritesPicker && !els.favoritesPicker.hidden && key === 'escape';
  const wantsHideTooltip = state.tooltipPinned && key === 'escape';
  if (wantsUndo) {
    event.preventDefault();
    undoHistory();
  } else if (wantsRedo) {
    event.preventDefault();
    redoHistory();
  } else if (wantsCloseFavoritesPicker) {
    event.preventDefault();
    closeFavoritesPicker();
  } else if (wantsHideTooltip) {
    event.preventDefault();
    hideTooltip(true);
  } else if (wantsCloseAlphaSettings) {
    event.preventDefault();
    toggleInstantAlphaSettings(false);
  } else if (wantsRemoveSelection) {
    event.preventDefault();
    eraseSelectionArea();
  } else if (wantsClearSelection) {
    event.preventDefault();
    clearSelection();
  }
}

function setupTooltips() {
  const targets = document.querySelectorAll('.studio-help-btn[data-help]');
  targets.forEach(target => {
    target.addEventListener('pointerenter', () => {
      if (!state.tooltipPinned) showTooltip(target);
    });
    target.addEventListener('pointerleave', () => {
      if (!state.tooltipPinned) hideTooltip();
    });
    target.addEventListener('focusin', () => showTooltip(target, true));
    target.addEventListener('blur', () => {
      if (!state.tooltipPinned) hideTooltip();
    });
    target.addEventListener('click', event => {
      event.preventDefault();
      const isSameTarget = state.tooltipPinned && state.tooltipTarget === target;
      if (isSameTarget) {
        hideTooltip(true);
      } else {
        showTooltip(target, true);
      }
    });
  });
  document.addEventListener('pointerdown', event => {
    if (!event.target.closest('.studio-help-btn') && !event.target.closest('#studioTooltip')) {
      hideTooltip(true);
    }
    if (!event.target.closest('#instantAlphaSettingsPanel') && !event.target.closest('#instantAlphaSettingsBtn')) {
      toggleInstantAlphaSettings(false);
    }
  });
  window.addEventListener('resize', () => {
    if (state.tooltipTarget && !els.studioTooltip.hidden) {
      positionTooltip(state.tooltipTarget);
    }
  });
  document.addEventListener('scroll', () => {
    if (state.tooltipTarget && !els.studioTooltip.hidden) {
      positionTooltip(state.tooltipTarget);
    }
  }, true);
}

function showTooltip(target, pinned = false) {
  if (!els.studioTooltip) return;
  const message = target.getAttribute('data-help');
  if (!message) return;
  state.tooltipPinned = pinned;
  state.tooltipTarget = target;
  els.studioTooltip.textContent = message;
  els.studioTooltip.hidden = false;
  els.studioTooltip.dataset.pinned = pinned ? 'true' : 'false';
  positionTooltip(target);
}

function hideTooltip(force = false) {
  if (!els.studioTooltip) return;
  if (state.tooltipPinned && !force) return;
  els.studioTooltip.hidden = true;
  els.studioTooltip.removeAttribute('data-pinned');
  state.tooltipPinned = false;
  state.tooltipTarget = null;
}

function positionTooltip(target) {
  if (!els.studioTooltip || els.studioTooltip.hidden) return;
  const rect = target.getBoundingClientRect();
  const tooltipRect = els.studioTooltip.getBoundingClientRect();
  const gap = 10;
  let left = rect.left + rect.width / 2 - tooltipRect.width / 2;
  let top = rect.top - tooltipRect.height - gap;

  left = clamp(left, 10, window.innerWidth - tooltipRect.width - 10);
  if (top < 10) {
    top = rect.bottom + gap;
  }

  els.studioTooltip.style.left = `${left}px`;
  els.studioTooltip.style.top = `${top}px`;
}

function normalizeRect(startX, startY, endX, endY) {
  const left = Math.min(startX, endX);
  const top = Math.min(startY, endY);
  return {
    x: left,
    y: top,
    width: Math.abs(endX - startX),
    height: Math.abs(endY - startY)
  };
}

function luminance(r, g, b) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function sanitizeZoomInput(value) {
  const digits = String(value).replace(/[^\d]/g, '');
  return clamp(Number(digits) || 100, 25, 400);
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70) || 'kindle-screensaver';
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  })[char]);
}
