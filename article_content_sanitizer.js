(function () {
  function cleanText(value) {
    return (value || '').replace(/\s+/g, ' ').trim().toLowerCase();
  }

  function shouldDropByText(text) {
    const t = cleanText(text);
    if (!t) return false;

    const blockedSnippets = [
      'share space of sound',
      'subscribe now',
      'get 40% off',
      'reader-supported publication',
      'this newsletter is one of three',
      'questa newsletter e una tra le tre',
      'ko-fi',
      'utm_source=substack',
      'support my work',
      'share heralding time',
      'share last scattering surface'
    ];

    return blockedSnippets.some(snippet => t.includes(snippet));
  }

  function unwrapAnchor(anchor) {
    const parent = anchor.parentNode;
    if (!parent) return;
    const textNode = anchor.ownerDocument.createTextNode(anchor.textContent || '');
    parent.replaceChild(textNode, anchor);
  }

  function sanitizeImportedArticleHtml(html) {
    const raw = (html || '').trim();
    if (!raw) return '';

    const parser = new DOMParser();
    const doc = parser.parseFromString(raw, 'text/html');

    const blockedSelectors = [
      '.subscription-widget-wrap-editor',
      '.subscription-widget',
      '.digest-post-embed',
      '.native-video-embed',
      '.instagram',
      '.button-wrapper',
      '[data-component-name="SubscribeWidgetToDOM"]',
      '[data-component-name="ButtonCreateButton"]',
      '[data-component-name="InstagramToDOM"]',
      '[data-component-name="VideoPlaceholder"]',
      '[data-component-name="DigestPostEmbedToDOM"]'
    ];

    doc.querySelectorAll(blockedSelectors.join(',')).forEach(node => node.remove());

    doc.querySelectorAll('iframe').forEach(frame => {
      const src = frame.getAttribute('src') || '';
      if (/substack/i.test(src)) {
        frame.remove();
        return;
      }

      const keep = {
        src: src,
        loading: 'lazy',
        allow: frame.getAttribute('allow') || '',
        allowfullscreen: frame.getAttribute('allowfullscreen') || 'true'
      };

      Array.from(frame.attributes).forEach(attr => frame.removeAttribute(attr.name));
      Object.entries(keep).forEach(([key, value]) => {
        if (value) frame.setAttribute(key, value);
      });
    });

    doc.querySelectorAll('a').forEach(anchor => {
      const href = (anchor.getAttribute('href') || '').trim();
      if (!href) return;

      if (/substack/i.test(href) || href.includes('utm_source=substack')) {
        unwrapAnchor(anchor);
      }
    });

    const allNodes = Array.from(doc.body.querySelectorAll('*'));
    allNodes.forEach(node => {
      if (shouldDropByText(node.textContent || '')) {
        node.remove();
        return;
      }

      Array.from(node.attributes).forEach(attr => {
        const name = attr.name.toLowerCase();
        if (name === 'src' || name === 'srcset' || name === 'href' || name === 'alt' || name === 'title' || name === 'loading' || name === 'allow' || name === 'allowfullscreen' || name === 'type' || name === 'sizes') {
          return;
        }
        node.removeAttribute(attr.name);
      });
    });

    Array.from(doc.body.querySelectorAll('*')).forEach(node => {
      if (['IMG', 'IFRAME', 'HR', 'BR'].includes(node.tagName)) return;
      const text = cleanText(node.textContent || '');
      if (!text && node.children.length === 0) {
        node.remove();
      }
    });

    return doc.body.innerHTML.trim();
  }

  window.sanitizeImportedArticleHtml = sanitizeImportedArticleHtml;
})();
