#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const collections = [
  { file: 'ht_data.js', varName: 'HT_ARTICLES' },
  { file: 'lss_data.js', varName: 'LSS_ARTICLES' },
  { file: 'spacesound_data.js', varName: 'SPACESOUND_ARTICLES' }
];

function loadDataFile(filePath, varName) {
  const txt = fs.readFileSync(filePath, 'utf8');
  return Function('window={};' + txt + ';return window.' + varName)();
}

function escapeHtml(text) {
  return (text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function decodeUrl(url) {
  if (!url) return '';
  let out = url.trim();
  try {
    out = decodeURIComponent(out);
  } catch (err) {
    // Keep as-is on malformed URI sequences.
  }
  return out.replace(/&amp;/g, '&').trim();
}

function normalizeSubstackImageUrl(url) {
  const decoded = decodeUrl(url);
  if (!decoded) return '';

  const embedded = decoded.match(/(https:\/\/substack-post-media\.s3\.amazonaws\.com\/public\/images\/[^\s)"']+)/i);
  if (embedded) {
    return embedded[1];
  }

  return decoded;
}

function markdownToHtml(markdown) {
  const src = (markdown || '').replace(/\r\n/g, '\n').trim();
  if (!src) return '';

  const lines = src.split('\n');
  const html = [];
  let paragraph = [];

  const flushParagraph = () => {
    if (!paragraph.length) return;
    const joined = paragraph.join(' ').trim();
    if (joined) {
      html.push(`<p>${escapeHtml(joined)}</p>`);
    }
    paragraph = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      continue;
    }

    const imageMatch = line.match(/^!\[[^\]]*\]\(([^)]+)\)$/);
    if (imageMatch) {
      flushParagraph();
      const srcUrl = normalizeSubstackImageUrl(imageMatch[1]);
      if (srcUrl) {
        html.push(`<figure><img src="${escapeHtml(srcUrl)}" alt="Image"></figure>`);
      }
      continue;
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      flushParagraph();
      const level = headingMatch[1].length;
      html.push(`<h${level}>${escapeHtml(headingMatch[2].trim())}</h${level}>`);
      continue;
    }

    paragraph.push(line);
  }

  flushParagraph();
  return html.join('\n\n');
}

function rewriteDataFileWithHtmlPaths(dataFile, varName) {
  const original = fs.readFileSync(dataFile, 'utf8');
  const data = loadDataFile(dataFile, varName);

  let rewritten = original;

  Object.values(data).forEach(article => {
    const mdPath = article && article.markdownFile;
    if (!mdPath || !mdPath.endsWith('.md')) return;

    const htmlPath = mdPath.replace(/\.md$/i, '.html');
    const absoluteMdPath = path.resolve(mdPath);
    const absoluteHtmlPath = path.resolve(htmlPath);

    if (!fs.existsSync(absoluteMdPath)) return;

    const mdText = fs.readFileSync(absoluteMdPath, 'utf8');
    const htmlText = markdownToHtml(mdText);
    fs.writeFileSync(absoluteHtmlPath, htmlText + '\n', 'utf8');

    const escapedMd = mdPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    rewritten = rewritten.replace(new RegExp(escapedMd, 'g'), htmlPath);
  });

  fs.writeFileSync(dataFile, rewritten, 'utf8');
}

function main() {
  collections.forEach(({ file, varName }) => {
    rewriteDataFileWithHtmlPaths(file, varName);
    console.log(`converted and rewired: ${file}`);
  });
}

main();
