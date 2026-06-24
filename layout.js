(function () {
  const path = window.location.pathname.split('/').pop() || 'index.html';

  const pageTitles = {
    'index.html': 'Home',
    'ht.html': 'Heralding Time',
    'lss.html': 'Last Scattering Surface',
    'sp.html': 'Space of Sound',
    'blog.html': 'The Blog',
    'about.html': 'About'
  };

  const activeLabel = pageTitles[path] || '';

  async function loadPartial(targetId, file) {
    const target = document.getElementById(targetId);
    if (!target) return;

    const response = await fetch(file);
    const html = await response.text();
    target.innerHTML = html;
  }

  function activateNav() {
    const navLinks = document.querySelectorAll('.section-nav-item');
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === path) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  function setEditionDate() {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const bar = document.getElementById('edition-date');
    if (!bar) return;

    const now = new Date();
    bar.textContent = `${months[now.getMonth()]} ${now.getFullYear()} · Vol. ${now.getFullYear() - 2025}, No. ${now.getMonth() + 1}${activeLabel ? ' · ' + activeLabel : ''}`;
  }

  document.addEventListener('DOMContentLoaded', async () => {
    await loadPartial('site-header', 'header.html');
    await loadPartial('site-footer', 'footer.html');
    activateNav();
    setEditionDate();
  });
})();
