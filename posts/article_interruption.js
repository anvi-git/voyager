function renderInterruption(containerId, captionText) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.warn(`Interruption container with ID "${containerId}" not found.`);
    return;
  }
  const escapedText = (captionText || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
  const interruptionHtml = `<div class="article-interruption"><p>${escapedText}</p></div>`;
  container.innerHTML = interruptionHtml;
}

function createInterruption(captionText) {
  const escapedText = (captionText || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
  return `<div class="article-interruption"><p>${escapedText}</p></div>`;
}