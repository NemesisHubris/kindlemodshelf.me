const backBtn = document.querySelector('.back-home-btn');

if (backBtn) {
  let hideTimeout;
  let textNode = null;

  // Find and store the text node
  for (let node of backBtn.childNodes) {
    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
      textNode = node;
      break;
    }
  }

  window.addEventListener('scroll', () => {
    const isScrolled = window.scrollY > 100;

    // Add or remove scrolled class
    if (isScrolled && !backBtn.classList.contains('scrolled')) {
      backBtn.classList.add('scrolled');
      // Hide the text
      if (textNode) {
        textNode.style = 'display: none';
        backBtn.textContent = '←';
      }
      // Auto fade to transparent after 3 seconds
      clearTimeout(hideTimeout);
      hideTimeout = setTimeout(() => {
        backBtn.style.opacity = '0.3';
      }, 3000);
    } else if (!isScrolled && backBtn.classList.contains('scrolled')) {
      backBtn.classList.remove('scrolled');
      // Restore the text and opacity
      if (textNode) {
        textNode.style = '';
        backBtn.textContent = '← Back to Home';
      }
      backBtn.style.opacity = '1';
      clearTimeout(hideTimeout);
    }
  }, { passive: true });

  // Handle mouse enter
  backBtn.addEventListener('mouseenter', () => {
    clearTimeout(hideTimeout);
    backBtn.style.opacity = '1';
  });

  // Handle mouse leave
  backBtn.addEventListener('mouseleave', () => {
    if (window.scrollY > 100) {
      // Fade back to transparent after 3 seconds
      hideTimeout = setTimeout(() => {
        if (window.scrollY > 100) {
          backBtn.style.opacity = '0.3';
        }
      }, 3000);
    }
  });
}
