// KindleModShelf Image Cropper & Resizer
// Pure JS, Canvas-based, Client-side only.

const EREADER_DEVICES = {
  "Kindle (11th Gen)": [1072, 1448],
  "Kindle Paperwhite (12th Gen)": [1264, 1680],
  "Kindle Paperwhite (11th Gen)": [1236, 1648],
  "Kindle Paperwhite (10th Gen & earlier)": [1072, 1448],
  "Kindle Oasis (3rd Gen)": [1264, 1680],
  "Kindle Scribe": [1860, 2480],
  "Kobo Nia": [758, 1024],
  "Kobo Clara BW": [1072, 1448],
  "Kobo Clara 2E / HD": [1072, 1448],
  "Kobo Libra 2 / H2O": [1264, 1680],
  "Kobo Sage": [1440, 1920],
  "Kobo Elipsa 2E": [1404, 1872]
};

// Global State
let cropperState = {
  img: null,
  canvas: null,
  ctx: null,
  targetWidth: 1236,
  targetHeight: 1648,
  scale: 1,
  minScale: 1,
  maxScale: 1,
  offsetX: 0,
  offsetY: 0,
  isDragging: false,
  lastMouseX: 0,
  lastMouseY: 0,
  // Filters
  brightness: 100, // %
  contrast: 100, // %
  saturation: 100, // % (0 = Grayscale)
  viewScale: 1
};

// Initialize the Cropper Modal HTML
function initCropperHTML() {
  if (document.getElementById('cropper-modal')) return;

  const modalHTML = `
    <div id="cropper-modal" class="cropper-modal" style="display:none;">
      <div class="cropper-container">
        <div class="cropper-header">
          <h2>Resize for E-Reader</h2>
          <button id="cropper-close" class="cropper-close-btn">×</button>
        </div>
        
        <div class="cropper-body">
          <div class="cropper-canvas-wrapper" id="cropper-wrapper">
            <div id="cropper-toast" class="cropper-toast"></div>
            <canvas id="cropper-canvas"></canvas>
            <div class="cropper-overlay-text">Drag to Move</div>
          </div>

          <div class="cropper-sidebar">
            <div class="control-group">
              <label>Device Preset</label>
              <select id="device-select" class="builder-select">
                ${Object.keys(EREADER_DEVICES).map(d => `<option value="${d}">${d}</option>`).join('')}
                <option value="Custom">Custom Size...</option>
              </select>
            </div>
            
            <div class="control-group custom-dims" id="custom-dims" style="display:none;">
              <div class="dim-inputs">
                <input type="number" id="custom-w" placeholder="W" class="builder-input" value="1000">
                <span>×</span>
                <input type="number" id="custom-h" placeholder="H" class="builder-input" value="1400">
              </div>
            </div>

            <div class="control-divider"></div>

            <div class="slider-group">
              <label>Zoom</label>
              <input type="range" id="zoom-slider" min="100" max="300" value="100">
            </div>

            <div class="slider-group">
              <label>Brightness</label>
              <input type="range" id="brightness-slider" min="0" max="200" value="100">
            </div>

            <div class="slider-group">
              <label>Contrast</label>
              <input type="range" id="contrast-slider" min="0" max="200" value="100">
            </div>

            <div class="slider-group">
              <label>Saturation (Grayness)</label>
              <input type="range" id="saturation-slider" min="0" max="100" value="100">
            </div>
            
            <div class="button-group">
               <button id="btn-grayscale" class="builder-secondary-btn">Set Grayscale</button>
               <button id="btn-reset" class="builder-secondary-btn">Reset</button>
            </div>

            <div class="cropper-footer">
              <button id="cropper-download" class="builder-apply-btn">Download Image</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHTML);

  // Bind Events
  document.getElementById('cropper-close').onclick = closeCropper;
  document.getElementById('device-select').onchange = handleDeviceChange;
  document.getElementById('cropper-download').onclick = downloadCroppedImage;
  document.getElementById('custom-w').oninput = handleCustomDims;
  document.getElementById('custom-h').oninput = handleCustomDims;
  
  // Slider Events
  document.getElementById('zoom-slider').oninput = handleZoomSlider;
  document.getElementById('brightness-slider').oninput = (e) => { cropperState.brightness = e.target.value; draw(); };
  document.getElementById('contrast-slider').oninput = (e) => { cropperState.contrast = e.target.value; draw(); };
  document.getElementById('saturation-slider').oninput = (e) => { cropperState.saturation = e.target.value; draw(); };
  
  // Buttons
  document.getElementById('btn-grayscale').onclick = () => {
    cropperState.saturation = 0;
    document.getElementById('saturation-slider').value = 0;
    draw();
  };
  document.getElementById('btn-reset').onclick = resetFilters;

  // Set default selection
  document.getElementById('device-select').value = "Kindle Paperwhite (11th Gen)";
}

function showToast(msg) {
  const t = document.getElementById('cropper-toast');
  if (t) {
    t.textContent = msg;
    t.classList.add('visible');
    setTimeout(() => t.classList.remove('visible'), 2000);
  }
}

function openCropper(imageSrc) {
  initCropperHTML();
  
  const modal = document.getElementById('cropper-modal');
  modal.style.display = 'flex';
  
  // Reset Filters
  resetFilters();
  
  cropperState.img = new Image();
  cropperState.img.crossOrigin = "anonymous";
  cropperState.img.src = imageSrc;
  
  cropperState.img.onload = () => {
    initCanvas();
    fitImageToCrop();
    draw();
  };
}

function closeCropper() {
  document.getElementById('cropper-modal').style.display = 'none';
}

function resetFilters() {
  cropperState.brightness = 100;
  cropperState.contrast = 100;
  cropperState.saturation = 100;
  const b = document.getElementById('brightness-slider');
  const c = document.getElementById('contrast-slider');
  const s = document.getElementById('saturation-slider');
  if (b) b.value = 100;
  if (c) c.value = 100;
  if (s) s.value = 100;
  if (cropperState.img) {
      fitImageToCrop();
      draw();
  }
}

function handleDeviceChange(e) {
  const val = e.target.value;
  const customDiv = document.getElementById('custom-dims');
  
  if (val === 'Custom') {
    customDiv.style.display = 'block';
    cropperState.targetWidth = parseInt(document.getElementById('custom-w').value) || 1000;
    cropperState.targetHeight = parseInt(document.getElementById('custom-h').value) || 1400;
  } else {
    customDiv.style.display = 'none';
    const dims = EREADER_DEVICES[val];
    cropperState.targetWidth = dims[0];
    cropperState.targetHeight = dims[1];
  }
  fitImageToCrop();
  draw();
}

function handleCustomDims() {
  const w = parseInt(document.getElementById('custom-w').value);
  const h = parseInt(document.getElementById('custom-h').value);
  if (w && h) {
    cropperState.targetWidth = w;
    cropperState.targetHeight = h;
    calculateLayout();
    constrain();
    draw();
  }
}

function initCanvas() {
  const canvas = document.getElementById('cropper-canvas');
  const wrapper = document.getElementById('cropper-wrapper');
  
  // Initial size
  canvas.width = wrapper.clientWidth;
  canvas.height = wrapper.clientHeight;
  
  cropperState.canvas = canvas;
  cropperState.ctx = canvas.getContext('2d');
  cropperState.ctx.imageSmoothingQuality = 'high';

  // Handle Resize
  const resizeObserver = new ResizeObserver(() => {
    if (!wrapper.clientWidth || !wrapper.clientHeight) return;
    canvas.width = wrapper.clientWidth;
    canvas.height = wrapper.clientHeight;
    if (cropperState.img) {
      calculateLayout();
      constrain();
      draw();
    }
  });
  resizeObserver.observe(wrapper);

  // Mouse Events
  canvas.addEventListener('mousedown', startDrag);
  window.addEventListener('mousemove', drag);
  window.addEventListener('mouseup', endDrag);
  
  // Touch Events
  canvas.addEventListener('touchstart', handleTouchStart, {passive: false});
  canvas.addEventListener('touchmove', handleTouchMove, {passive: false});
  canvas.addEventListener('touchend', endDrag);
}

// Calculate layout metrics (Min Scale, View Scale)
function calculateLayout() {
  if (!cropperState.img) return;
  const { width: cvsW, height: cvsH } = cropperState.canvas;
  const { targetWidth, targetHeight } = cropperState;
  
  // ViewScale: Fit the "Crop Box" into the Canvas with padding
  cropperState.viewScale = Math.min(cvsW / targetWidth, cvsH / targetHeight) * 0.85;
  
  // Calculate size of Crop Box in Canvas Pixels
  const boxW = targetWidth * cropperState.viewScale;
  const boxH = targetHeight * cropperState.viewScale;
  
  // Calculate Minimum Image Scale to cover this box
  // Scale = ScreenPixels / ImagePixels
  cropperState.minScale = Math.max(boxW / cropperState.img.width, boxH / cropperState.img.height);
  cropperState.maxScale = cropperState.minScale * 3; // Allow 3x zoom
  
  // Update Slider Range
  const zoomSlider = document.getElementById('zoom-slider');
  zoomSlider.min = 100;
  zoomSlider.max = 300;
}

function fitImageToCrop() {
  calculateLayout();
  // Reset to min scale (fit)
  cropperState.scale = cropperState.minScale;
  document.getElementById('zoom-slider').value = 100;
  
  // Center
  const { canvas, img, scale } = cropperState;
  cropperState.offsetX = (canvas.width - img.width * scale) / 2;
  cropperState.offsetY = (canvas.height - img.height * scale) / 2;
}

function handleZoomSlider(e) {
  const percent = parseInt(e.target.value); // 100 to 300
  const factor = percent / 100;
  
  const oldScale = cropperState.scale;
  const newScale = cropperState.minScale * factor;
  
  // Zoom towards center of canvas
  const cx = cropperState.canvas.width / 2;
  const cy = cropperState.canvas.height / 2;
  
  cropperState.offsetX = cx - (cx - cropperState.offsetX) * (newScale / oldScale);
  cropperState.offsetY = cy - (cy - cropperState.offsetY) * (newScale / oldScale);
  
  cropperState.scale = newScale;
  constrain();
  draw();
  
  if (percent > 100) {
      showToast("Adjusting Crop Area");
  }
}

function constrain() {
  const { canvas, img, scale, targetWidth, targetHeight, viewScale } = cropperState;
  
  const boxW = targetWidth * viewScale;
  const boxH = targetHeight * viewScale;
  const boxX = (canvas.width - boxW) / 2;
  const boxY = (canvas.height - boxH) / 2;
  
  const imgW = img.width * scale;
  const imgH = img.height * scale;
  
  // Horizontal Constraint
  if (imgW <= boxW) {
    cropperState.offsetX = boxX + (boxW - imgW) / 2;
  } else {
    cropperState.offsetX = Math.min(cropperState.offsetX, boxX);
    cropperState.offsetX = Math.max(cropperState.offsetX, boxX + boxW - imgW);
  }
  
  // Vertical Constraint
  if (imgH <= boxH) {
    cropperState.offsetY = boxY + (boxH - imgH) / 2;
  } else {
    cropperState.offsetY = Math.min(cropperState.offsetY, boxY);
    cropperState.offsetY = Math.max(cropperState.offsetY, boxY + boxH - imgH);
  }
}

function draw() {
  if (!cropperState.ctx) return;
  const { ctx, canvas, img, scale, offsetX, offsetY, targetWidth, targetHeight, viewScale, brightness, contrast, saturation } = cropperState;
  
  if (!viewScale) {
      calculateLayout();
  }
  
  // Clear
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Background
  const bg = getComputedStyle(document.documentElement).getPropertyValue('--bg-base').trim() || '#111';
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Apply Filters
  ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
  
  // Draw Image
  ctx.drawImage(img, offsetX, offsetY, img.width * scale, img.height * scale);
  
  // Reset Filter for overlay
  ctx.filter = 'none';
  
  // Overlay Logic
  const boxW = targetWidth * (cropperState.viewScale || viewScale);
  const boxH = targetHeight * (cropperState.viewScale || viewScale);
  const boxX = (canvas.width - boxW) / 2;
  const boxY = (canvas.height - boxH) / 2;
  
  // Draw semi-transparent overlay everywhere EXCEPT the crop box
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  
  // Top
  ctx.fillRect(0, 0, canvas.width, boxY);
  // Bottom
  ctx.fillRect(0, boxY + boxH, canvas.width, canvas.height - (boxY + boxH));
  // Left
  ctx.fillRect(0, boxY, boxX, boxH);
  // Right
  ctx.fillRect(boxX + boxW, boxY, canvas.width - (boxX + boxW), boxH);
  
  // Border
  ctx.beginPath();
  ctx.strokeStyle = '#5b9dd9';
  ctx.lineWidth = 2;
  ctx.rect(boxX, boxY, boxW, boxH);
  ctx.stroke();
  
  // Dims Text
  ctx.fillStyle = '#fff';
  ctx.font = '14px sans-serif';
  ctx.shadowColor = "black";
  ctx.shadowBlur = 4;
  ctx.fillText(`${targetWidth} x ${targetHeight}`, boxX, boxY - 8);
  ctx.shadowBlur = 0;
}

// Interaction Handlers
function startDrag(e) {
  cropperState.isDragging = true;
  cropperState.lastMouseX = e.clientX;
  cropperState.lastMouseY = e.clientY;
  
  // Only show toast if user is on a preset (not custom)
  if (document.getElementById('device-select').value !== 'Custom') {
      showToast("Repositioning Image");
  }
}

function drag(e) {
  if (!cropperState.isDragging) return;
  e.preventDefault();
  const dx = e.clientX - cropperState.lastMouseX;
  const dy = e.clientY - cropperState.lastMouseY;
  
  cropperState.offsetX += dx;
  cropperState.offsetY += dy;
  
  constrain(); // Enforce boundaries
  
  cropperState.lastMouseX = e.clientX;
  cropperState.lastMouseY = e.clientY;
  draw();
}

function endDrag() {
  cropperState.isDragging = false;
}

function handleTouchStart(e) {
  if (e.touches.length === 1) {
    cropperState.isDragging = true;
    cropperState.lastMouseX = e.touches[0].clientX;
    cropperState.lastMouseY = e.touches[0].clientY;
    if (document.getElementById('device-select').value !== 'Custom') {
        showToast("Repositioning Image");
    }
  }
}

function handleTouchMove(e) {
  e.preventDefault();
  if (e.touches.length === 1 && cropperState.isDragging) {
    const dx = e.touches[0].clientX - cropperState.lastMouseX;
    const dy = e.touches[0].clientY - cropperState.lastMouseY;
    
    cropperState.offsetX += dx;
    cropperState.offsetY += dy;
    
    constrain();
    
    cropperState.lastMouseX = e.touches[0].clientX;
    cropperState.lastMouseY = e.touches[0].clientY;
    draw();
  }
}

// Export
function downloadCroppedImage() {
  const { img, scale, offsetX, offsetY, targetWidth, targetHeight, viewScale, brightness, contrast, saturation } = cropperState;
  
  const exportCanvas = document.createElement('canvas');
  exportCanvas.width = targetWidth;
  exportCanvas.height = targetHeight;
  const ctx = exportCanvas.getContext('2d');
  
  // Calculate Source Coords
  const cvsW = cropperState.canvas.width;
  const cvsH = cropperState.canvas.height;
  const boxW = targetWidth * viewScale;
  const boxH = targetHeight * viewScale;
  const boxX = (cvsW - boxW) / 2;
  const boxY = (cvsH - boxH) / 2;
  
  const sourceX = (boxX - offsetX) / scale;
  const sourceY = (boxY - offsetY) / scale;
  const sourceW = boxW / scale;
  const sourceH = boxH / scale;
  
  // Fill white
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, targetWidth, targetHeight);
  
  // Apply Filters
  ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
  
  // Draw
  ctx.drawImage(img, sourceX, sourceY, sourceW, sourceH, 0, 0, targetWidth, targetHeight);
  
  // Trigger Download
  const link = document.createElement('a');
  const baseName = "kindle_screensaver"; 
  link.download = `${baseName}_${targetWidth}x${targetHeight}.png`;
  link.href = exportCanvas.toDataURL('image/png', 0.9);
  link.click();
}
