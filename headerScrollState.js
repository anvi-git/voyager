(function () {
  function initHeaderScrollState() {
    var header = document.querySelector('header');
    var titleLink = document.getElementById('site-title-link');
    if (!header || !titleLink) {
      return;
    }

    function updateState() {
      var threshold = window.innerHeight * 0.5;
      var isScrolled = window.scrollY > threshold;
      document.body.classList.toggle('header-scrolled', isScrolled);
    }

    updateState();
    window.addEventListener('scroll', updateState, { passive: true });
    window.addEventListener('resize', updateState);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeaderScrollState);
  } else {
    initHeaderScrollState();
  }
})();
