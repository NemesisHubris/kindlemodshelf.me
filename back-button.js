const backBtn = document.querySelector('.back-home-btn');

if (backBtn) {
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
    } else if (!isScrolled && backBtn.classList.contains('scrolled')) {
      backBtn.classList.remove('scrolled');
      // Restore the text
      if (textNode) {
        textNode.style = '';
        backBtn.textContent = '← Back to Home';
      }
    }
  }, { passive: true });
}
