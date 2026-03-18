const fs = require('fs');
const path = require('path');
const vm = require('vm');

const PUBLICATIONS = [
  {
    key: 'ht',
    name: 'Heralding Time',
    baseUrl: 'https://heraldingtime.substack.com',
    dataFile: 'ht_data.js',
    windowKey: 'HT_ARTICLES',
    postsDir: 'posts/heralding_time',
    filePrefix: 'ht_post'
  },
  {
    key: 'lss',
    name: 'Last Scattering Surface',
    baseUrl: 'https://lastscatteringsurface.substack.com',
    dataFile: 'lss_data.js',
    windowKey: 'LSS_ARTICLES',
    postsDir: 'posts/lss',
    filePrefix: 'lss_post'
  },
  {
    key: 'ss',
    name: 'Space of Sound',
    baseUrl: 'https://spaceofsound.substack.com',
    dataFile: 'spacesound_data.js',
    windowKey: 'SPACESOUND_ARTICLES',
    postsDir: 'posts/space_of_sound',
    filePrefix: 'ss_post'
  }
];

function htmlEntityDecode(text) {
  if (!text) return '';
  return text
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ');
}

function stripTags(html) {
  if (!html) return '';
  return htmlEntityDecode(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
}

function excerptFromHtml(html, fallback = '', maxLen = 180) {
  const base = stripTags(fallback) || stripTags(html);
  if (!base) return '';
  return base.length > maxLen ? `${base.slice(0, maxLen - 3).trim()}...` : base;
}

function slugify(text) {
  return (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 120);
}

function slugFromLink(link) {
  if (!link) return '';
  const m = link.match(/\/p\/([^/?#]+)/i);
  return m ? m[1].trim() : '';
}

function firstImageFromHtml(html) {
  if (!html) return '';
  const m = html.match(/<img[^>]+src="([^"]+)"/i);
  return m ? m[1] : '';
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function readExistingArticles(workspacePath, publication) {
  const filePath = path.join(workspacePath, publication.dataFile);
  if (!fs.existsSync(filePath)) return {};

  const code = fs.readFileSync(filePath, 'utf8');
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(code, context);
  return context.window[publication.windowKey] || {};
}

function existingSlugToMarkdownPath(existingArticles) {
  const map = new Map();
  Object.values(existingArticles).forEach(entry => {
    const mdPath = entry.markdownFile || '';
    const base = path.basename(mdPath, '.md');
    const m = base.match(/^[a-z]+_post_(?:\d+[-_])?(.+)$/i);
    if (m && m[1]) map.set(m[1], mdPath);
  });
  return map;
}

function toIsoDateString(dateInput) {
  const d = new Date(dateInput);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
}

function buildMarkdown(title, bodyHtml) {
  return `# ${title || 'Untitled'}\n\n${bodyHtml || ''}\n`;
}

function writeMarkdown(workspacePath, markdownPath, content) {
  const abs = path.join(workspacePath, markdownPath);
  ensureDir(path.dirname(abs));
  fs.writeFileSync(abs, content, 'utf8');
}

function stableSortByDateDesc(items) {
  return [...items].sort((a, b) => {
    const da = new Date(a._sortDate || 0).getTime();
    const db = new Date(b._sortDate || 0).getTime();
    return db - da;
  });
}

function writeDataFile(workspacePath, publication, entriesDesc) {
  const obj = {};
  entriesDesc.forEach((entry, i) => {
    obj[String(i + 1)] = {
      title: entry.title,
      date: entry.date,
      excerpt: entry.excerpt,
      markdownFile: entry.markdownFile,
      image: entry.image
    };
  });

  const filePath = path.join(workspacePath, publication.dataFile);
  const payload = `window.${publication.windowKey} = ${JSON.stringify(obj, null, 2)};\n`;
  fs.writeFileSync(filePath, payload, 'utf8');
}

module.exports = {
  PUBLICATIONS,
  htmlEntityDecode,
  excerptFromHtml,
  slugify,
  slugFromLink,
  firstImageFromHtml,
  readExistingArticles,
  existingSlugToMarkdownPath,
  toIsoDateString,
  buildMarkdown,
  writeMarkdown,
  stableSortByDateDesc,
  writeDataFile
};
