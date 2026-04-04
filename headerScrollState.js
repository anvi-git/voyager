(function() {
  const STORAGE_KEY = 'backyard-thoughts-language';
  const THEME_STORAGE_KEY = 'backyard-thoughts-theme';
  const LANG_PARAM = 'lang';
  const SUPPORTED_LANGS = new Set(['en', 'it']);
  const SUPPORTED_THEMES = new Set(['light', 'dark']);
  const SCROLLED_THRESHOLD = 18;

  const copy = {
    en: {
      nav: {
        blog: 'the blog',
        about: 'about'
      },
      labels: {
        menu: 'Open menu',
        themeToggle: 'Switch theme',
        themeLight: 'Switch to light theme',
        themeDark: 'Switch to dark theme',
        home: 'Backyard Thoughts home',
        brand: 'Backyard Thoughts',
        toggle: 'Switch to Italian',
        website: 'Website',
        newsletters: 'Newsletters',
        playlists: 'Playlists',
        github: 'GitHub',
        buyCoffee: 'buy me a coffee',
        emailMe: 'Email Me',
        intro: "i'm doing stuff. from sprouts, a tree.",
        published: 'Published',
        latest: 'Latest',
        previous: 'Previous',
        next: 'Next',
        noPosts: 'No posts yet.',
        noRelatedPosts: 'No related posts yet.',
        unableToLoad: 'Unable to load post content.',
        archiveNote: 'Archive note: this local file currently contains only a short preview. Source file:',
        readAlso: 'read also...',
        links: 'links',
        builtByMe: 'built by me.'
      },
      titles: {
        index: 'Backyard Thoughts',
        landing: 'anvi_tree',
        about: 'about',
        blog: 'Blog',
        blogArticle: 'Blog Article',
        ht: 'HERALDING TIME',
        htArticle: 'Heralding Time Article',
        lss: 'LAST SCATTERING SURFACE',
        lssArticle: 'Last Scattering Surface Article',
        sp: 'SPACE of SOUND',
        spArticle: 'SPACE of SOUND Article',
        post: 'Post'
      },
      index: {
        title: 'Backyard Thoughts',
        body: 'Welcome. Use the <a href="about.html">about</a> section to read the bio and contact details, or jump straight to the publications from the banner above.'
      },
      about: {
        title: 'about',
        html: `
          <section class="about-copy">
            <h1>Hello there!</h1>
            <p>My name is Antonio and I have a background in Physics and Astrophysics.<br>
            I'm currently enrolled in a Master course in Space Science.<br>
            I'm also writing on Substack three publications:<br>
            - <a href="https://heraldingtime.substack.com/" target="_blank" rel="noopener noreferrer">Heralding Time</a>, a blog on the history and philosophy of science;<br>
            - <a href="https://lastscatteringsurface.substack.com/" target="_blank" rel="noopener noreferrer">LAST SCATTERING SURFACE</a>, a blog on astrophysics and cosmology;<br>
            - <a href="https://spaceofsound.substack.com/" target="_blank" rel="noopener noreferrer">SPACE of SOUND</a>, a blog on music.</p>
            <h2>Contact</h2>
            <p>If you'd like to get in touch with me, feel free to send me an <a href="mailto:aviscusi11@gmail.com">email</a>.</p>
          </section>
        `
      },
      landing: {
        website: 'Website',
        newsletters: 'Newsletters',
        playlists: 'Playlists',
        github: 'GitHub',
        intro: "i'm doing stuff. from sprouts, a tree.",
        coffee: 'buy me a coffee',
        email: 'Email Me',
        footer: 'built by me.'
      }
    },
    it: {
      nav: {
        blog: 'il blog',
        about: 'chi sono'
      },
      labels: {
        menu: 'Apri menu',
        themeToggle: 'Cambia tema',
        themeLight: 'Passa al tema chiaro',
        themeDark: 'Passa al tema scuro',
        home: 'Home di Backyard Thoughts',
        brand: 'Backyard Thoughts',
        toggle: 'Switch to English',
        website: 'Sito web',
        newsletters: 'Newsletter',
        playlists: 'Playlist',
        github: 'GitHub',
        buyCoffee: 'offrimi un caffè',
        emailMe: 'Scrivimi',
        intro: 'faccio cose. da germogli, un albero.',
        published: 'Pubblicato',
        latest: 'Ultimo',
        previous: 'Precedente',
        next: 'Successivo',
        noPosts: 'Nessun post ancora.',
        noRelatedPosts: 'Nessun post correlato al momento.',
        unableToLoad: 'Impossibile caricare il contenuto del post.',
        archiveNote: 'Nota archivio: questo file locale contiene solo un’anteprima breve. File sorgente:',
        readAlso: 'leggi anche...',
        links: 'link',
        builtByMe: 'costruito da me.'
      },
      titles: {
        index: 'Backyard Thoughts',
        landing: 'anvi_tree',
        about: 'chi sono',
        blog: 'Il blog',
        blogArticle: 'Articolo del blog',
        ht: 'HERALDING TIME',
        htArticle: 'Articolo di Heralding Time',
        lss: 'LAST SCATTERING SURFACE',
        lssArticle: 'Articolo di Last Scattering Surface',
        sp: 'SPACE of SOUND',
        spArticle: 'Articolo di SPACE of SOUND',
        post: 'Post'
      },
      index: {
        title: 'Backyard Thoughts',
        body: 'Benvenuto. Usa la sezione <a href="about.html">chi sono</a> per leggere la biografia e i contatti, oppure vai direttamente alle pubblicazioni dal banner qui sopra.'
      },
      about: {
        title: 'chi sono',
        html: `
          <section class="about-copy">
            <h1>Ciao!</h1>
            <p>Mi chiamo Antonio e ho una formazione in Fisica e Astrofisica.<br>
            Attualmente frequento un Master in Space Science.<br>
            Scrivo anche su Substack tre pubblicazioni:<br>
            - <a href="https://heraldingtime.substack.com/" target="_blank" rel="noopener noreferrer">Heralding Time</a>, un blog sulla storia e la filosofia della scienza;<br>
            - <a href="https://lastscatteringsurface.substack.com/" target="_blank" rel="noopener noreferrer">LAST SCATTERING SURFACE</a>, un blog su astrofisica e cosmologia;<br>
            - <a href="https://spaceofsound.substack.com/" target="_blank" rel="noopener noreferrer">SPACE of SOUND</a>, un blog sulla musica.</p>
            <h2>Contatti</h2>
            <p>Se vuoi metterti in contatto con me, puoi mandarmi una <a href="mailto:aviscusi11@gmail.com">email</a>.</p>
          </section>
        `
      },
      landing: {
        website: 'Sito web',
        newsletters: 'Newsletter',
        playlists: 'Playlist',
        github: 'GitHub',
        intro: 'faccio cose. da germogli, un albero.',
        coffee: 'offrimi un caffè',
        email: 'Scrivimi',
        footer: 'costruito da me.'
      }
    }
  };

  let initialized = false;
  let pendingFrame = 0;
  let pendingTimeout = 0;

  function getCurrentPage() {
    return (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
  }

  function getLanguage() {
    const searchParams = new URLSearchParams(window.location.search);
    const queryLanguage = (searchParams.get(LANG_PARAM) || '').toLowerCase();
    if (SUPPORTED_LANGS.has(queryLanguage)) {
      return queryLanguage;
    }

    try {
      const storedLanguage = (window.localStorage && window.localStorage.getItem(STORAGE_KEY)) || '';
      if (SUPPORTED_LANGS.has(storedLanguage)) {
        return storedLanguage;
      }
    } catch (error) {
      // Ignore storage access issues.
    }

    const htmlLanguage = (document.documentElement.getAttribute('lang') || '').toLowerCase();
    if (SUPPORTED_LANGS.has(htmlLanguage)) {
      return htmlLanguage;
    }

    return 'en';
  }

  function persistLanguage(language) {
    try {
      if (window.localStorage) {
        window.localStorage.setItem(STORAGE_KEY, language);
      }
    } catch (error) {
      // Ignore storage access issues.
    }
  }

  function getTheme() {
    try {
      const storedTheme = (window.localStorage && window.localStorage.getItem(THEME_STORAGE_KEY)) || '';
      if (SUPPORTED_THEMES.has(storedTheme)) {
        return storedTheme;
      }
    } catch (error) {
      // Ignore storage access issues.
    }

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    return 'light';
  }

  function persistTheme(theme) {
    try {
      if (window.localStorage) {
        window.localStorage.setItem(THEME_STORAGE_KEY, theme);
      }
    } catch (error) {
      // Ignore storage access issues.
    }
  }

  function applyTheme(theme) {
    if (!document.body) return;

    document.body.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    persistTheme(theme);
  }

  function localizedUrl(target, language) {
    try {
      const url = new URL(target, window.location.href);
      if (!['http:', 'https:'].includes(url.protocol)) {
        return target;
      }

      if (url.origin !== window.location.origin) {
        return target;
      }

      url.searchParams.set(LANG_PARAM, language);
      return url.toString();
    } catch (error) {
      return target;
    }
  }

  function setFirstTextNode(element, value) {
    if (!element) return;

    for (let index = 0; index < element.childNodes.length; index += 1) {
      const node = element.childNodes[index];
      if (node.nodeType === Node.TEXT_NODE) {
        node.nodeValue = value;
        return;
      }
    }

    element.insertBefore(document.createTextNode(value), element.firstChild);
  }

  function updateTitle(language) {
    const page = getCurrentPage();
    const titles = copy[language].titles;
    const pageTitles = {
      'index.html': titles.index,
      'landing_page.html': titles.landing,
      'about.html': titles.about,
      'blog.html': titles.blog,
      'blog_article.html': titles.blogArticle,
      'ht.html': titles.ht,
      'ht_article.html': titles.htArticle,
      'lss.html': titles.lss,
      'lss_article.html': titles.lssArticle,
      'sp.html': titles.sp,
      'spacesound_article.html': titles.spArticle,
      'post_template.html': titles.post
    };

    if (pageTitles[page]) {
      document.title = pageTitles[page];
    }
  }

  function updateHeader(language) {
    const text = copy[language].labels;
    const theme = getTheme();

    const siteInitials = document.getElementById('site-initials');
    if (siteInitials) {
      siteInitials.setAttribute('aria-label', text.home);
    }

    const siteTitleLink = document.getElementById('site-title-link');
    if (siteTitleLink) {
      siteTitleLink.setAttribute('aria-label', text.brand);
    }

    const menuTrigger = document.getElementById('menu-trigger');
    if (menuTrigger) {
      menuTrigger.setAttribute('aria-label', text.menu);
    }

    const blogLink = document.querySelector('#blog h2 a');
    if (blogLink) {
      blogLink.textContent = copy[language].nav.blog;
    }

    const aboutLink = document.querySelector('#about h2 a');
    if (aboutLink) {
      aboutLink.textContent = copy[language].nav.about;
    }

    const titleContainer = document.getElementById('title-container');
    if (titleContainer) {
      let headerActions = document.getElementById('header-actions');
      if (!headerActions) {
        headerActions = document.createElement('div');
        headerActions.id = 'header-actions';
        titleContainer.appendChild(headerActions);
      } else if (headerActions.parentNode !== titleContainer) {
        titleContainer.appendChild(headerActions);
      }

      let languageToggle = document.getElementById('language-toggle');
      if (!languageToggle) {
        languageToggle = document.createElement('a');
        languageToggle.id = 'language-toggle';
        languageToggle.className = 'language-toggle';
        languageToggle.setAttribute('data-no-lang', 'true');
      }

      let themeToggle = document.getElementById('theme-toggle');
      if (!themeToggle) {
        themeToggle = document.createElement('a');
        themeToggle.id = 'theme-toggle';
        themeToggle.className = 'theme-toggle';
        themeToggle.setAttribute('data-no-lang', 'true');
        themeToggle.href = '#';
        themeToggle.addEventListener('click', event => {
          event.preventDefault();
          const nextTheme = getTheme() === 'dark' ? 'light' : 'dark';
          applyTheme(nextTheme);
          scheduleLocalization();
        });
      }

      if (languageToggle.parentNode !== headerActions) {
        headerActions.appendChild(languageToggle);
      }
      if (themeToggle.parentNode !== headerActions) {
        headerActions.appendChild(themeToggle);
      }
      if (menuTrigger) {
        headerActions.appendChild(menuTrigger);
      }

      const targetLanguage = language === 'it' ? 'en' : 'it';
      languageToggle.textContent = targetLanguage === 'it' ? 'ITA' : 'ENG';
      languageToggle.href = localizedUrl(window.location.href, targetLanguage);
      languageToggle.setAttribute('aria-label', text.toggle);
      languageToggle.setAttribute('title', text.toggle);

      const targetTheme = theme === 'dark' ? 'light' : 'dark';
      const themeLabel = targetTheme === 'dark' ? text.themeDark : text.themeLight;
      const iconPath = targetTheme === 'dark' ? 'svg_images/moon.svg' : 'svg_images/sun.svg';
      const iconImage = document.createElement('img');
      iconImage.className = 'theme-toggle-icon';
      iconImage.src = iconPath;
      iconImage.alt = '';
      iconImage.setAttribute('aria-hidden', 'true');
      themeToggle.replaceChildren(iconImage);
      themeToggle.setAttribute('aria-label', themeLabel);
      themeToggle.setAttribute('title', themeLabel);
    }
  }

  function updatePublicationControls(language) {
    const text = copy[language].labels;

    document.querySelectorAll('.publication-featured-meta').forEach(node => {
      node.textContent = text.latest;
    });

    document.querySelectorAll('.publication-section-nav.prev').forEach(node => {
      node.textContent = text.previous;
      node.setAttribute('aria-label', text.previous);
    });

    document.querySelectorAll('.publication-section-nav.next').forEach(node => {
      node.textContent = text.next;
      node.setAttribute('aria-label', text.next);
    });
  }

  function updateBlogPage(language) {
    const text = copy[language].labels;
    const headings = document.querySelectorAll('#blog-sidebar section h2');

    if (headings[0]) {
      headings[0].textContent = text.readAlso;
    }

    if (headings[1]) {
      headings[1].textContent = text.links;
    }
  }

  function updateLandingPage(language) {
    if (getCurrentPage() !== 'landing_page.html') {
      return;
    }

    const text = copy[language].landing;
    const container = document.querySelector('.container');
    if (!container) return;

    const headingNodes = Array.from(container.children).filter(node => node.tagName === 'H2');
    if (headingNodes[0]) headingNodes[0].textContent = text.website;
    if (headingNodes[1]) headingNodes[1].textContent = text.newsletters;
    if (headingNodes[2]) headingNodes[2].textContent = text.playlists;
    if (headingNodes[3]) headingNodes[3].textContent = text.github;

    const introNode = container.querySelector('.profile > p:last-of-type');
    if (introNode) {
      introNode.textContent = text.intro;
    }

    const coffeeButton = container.querySelector('.link-button[href*="ko-fi.com"]');
    if (coffeeButton) {
      coffeeButton.innerHTML = `<span></span> ${text.coffee}`;
    }

    const emailButton = container.querySelector('.link-button[href^="mailto:"]');
    if (emailButton) {
      emailButton.innerHTML = `<span>✉️</span> ${text.email}`;
    }

    const footerNode = container.querySelector('.footer p');
    if (footerNode) {
      footerNode.textContent = text.footer;
    }
  }

  function updateIndexPage(language) {
    if (getCurrentPage() !== 'index.html') {
      return;
    }

    const text = copy[language].index;
    const titleNode = document.querySelector('main section h1');
    const paragraphNode = document.querySelector('main section p');

    if (titleNode) {
      titleNode.textContent = text.title;
    }

    if (paragraphNode) {
      paragraphNode.innerHTML = text.body;
      const aboutLink = paragraphNode.querySelector('a[href="about.html"]');
      if (aboutLink) {
        aboutLink.textContent = language === 'it' ? 'chi sono' : 'about';
        aboutLink.setAttribute('href', localizedUrl('about.html', language));
      }
    }
  }

  function updateAboutPage(language) {
    if (getCurrentPage() !== 'about.html') {
      return;
    }

    const mainNode = document.querySelector('main');
    if (!mainNode) return;

    mainNode.innerHTML = copy[language].about.html;
  }

  function updateDynamicNotices(language) {
    const text = copy[language].labels;
    const replacements = [
      ['No posts yet.', text.noPosts],
      ['No related posts yet.', text.noRelatedPosts],
      ['Unable to load post content.', text.unableToLoad],
      ['Archive note: this local file currently contains only a short preview. Source file:', text.archiveNote]
    ];

    replacements.forEach(([source, target]) => {
      document.querySelectorAll('body *').forEach(element => {
        element.childNodes.forEach(node => {
          if (node.nodeType !== Node.TEXT_NODE) return;
          const value = (node.nodeValue || '').trim();
          if (!value) return;

          if (source === 'Archive note: this local file currently contains only a short preview. Source file:') {
            if (value.startsWith(source)) {
              node.nodeValue = node.nodeValue.replace(source, target);
            }
            return;
          }

          if (source === 'Unable to load post content.') {
            if (value.startsWith(source)) {
              node.nodeValue = node.nodeValue.replace(source, target);
            }
            return;
          }

          if (value === source) {
            node.nodeValue = node.nodeValue.replace(source, target);
          }
        });
      });
    });

    const blogMeta = document.querySelector('.blog-article-meta');
    if (blogMeta) {
      setFirstTextNode(blogMeta, `${text.published} `);
    }
  }

  function localizeLinks(language) {
    document.querySelectorAll('a[href]').forEach(link => {
      if (link.id === 'language-toggle' || link.getAttribute('data-no-lang') === 'true') {
        return;
      }

      const href = link.getAttribute('href');
      if (!href) return;
      if (
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('javascript:') ||
        href.startsWith('#')
      ) {
        return;
      }

      const localized = localizedUrl(href, language);
      if (localized !== href) {
        link.setAttribute('href', localized);
      }
    });
  }

  function updateScrollState() {
    if (!document.body) return;
    document.body.classList.toggle('header-scrolled', window.scrollY > SCROLLED_THRESHOLD);
  }

  function localizeDocument() {
    const language = getLanguage();
    const theme = getTheme();

    applyTheme(theme);
    document.documentElement.setAttribute('lang', language);
    if (document.body) {
      document.body.setAttribute('data-language', language);
    }

    persistLanguage(language);
    updateTitle(language);
    updateHeader(language);
    updatePublicationControls(language);
    updateBlogPage(language);
    updateLandingPage(language);
    updateIndexPage(language);
    updateAboutPage(language);
    updateDynamicNotices(language);
    localizeLinks(language);
    updateScrollState();
  }

  function scheduleLocalization() {
    if (!initialized) return;
    if (pendingFrame) {
      cancelAnimationFrame(pendingFrame);
    }
    if (pendingTimeout) {
      clearTimeout(pendingTimeout);
    }

    pendingFrame = window.requestAnimationFrame(() => {
      pendingFrame = 0;
      localizeDocument();
    });

    pendingTimeout = window.setTimeout(() => {
      pendingTimeout = 0;
      localizeDocument();
    }, 120);
  }

  function initialize() {
    if (initialized) return;
    initialized = true;

    localizeDocument();
    window.requestAnimationFrame(localizeDocument);
    window.setTimeout(localizeDocument, 250);

    window.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState, { passive: true });
    window.addEventListener('pageshow', localizeDocument);
    window.addEventListener('load', localizeDocument);
  }

  window.BackyardLanguage = {
    getLanguage,
    localizedUrl,
    localizeDocument,
    scheduleLocalization
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }
})();
