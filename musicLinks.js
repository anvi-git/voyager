function renderMusicLinks(containerId, links) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  let html = '<div class="music-links">';
  if (links.spotify) html += `<a href="${escapeHtml(links.spotify)}" class="music-link spotify" target="_blank">Spotify</a>`;
  if (links.appleMusic) html += `<a href="${escapeHtml(links.appleMusic)}" class="music-link apple-music" target="_blank">Apple Music</a>`;
  if (links.youtube) html += `<a href="${escapeHtml(links.youtube)}" class="music-link youtube" target="_blank">YouTube</a>`;
  if (links.bandcamp) html += `<a href="${escapeHtml(links.bandcamp)}" class="music-link bandcamp" target="_blank">Bandcamp</a>`;
  html += '</div>';
  
  container.innerHTML = html;
}