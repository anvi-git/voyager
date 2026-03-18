const path = require('path');
const {
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
} = require('./substack_import_common');

const WORKSPACE = process.cwd();
const ARCHIVE_LIMIT = 20;
const REQUEST_HEADERS = {
  'accept': 'application/rss+xml, application/xml;q=0.9, application/json;q=0.8, text/html;q=0.7, */*;q=0.6',
  'accept-language': 'en-US,en;q=0.9',
  'cache-control': 'no-cache',
  'pragma': 'no-cache',
  'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
};

function extractTag(block, tagName) {
  const re = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i');
  const m = block.match(re);
  return m ? htmlEntityDecode(m[1].trim()) : '';
}

function extractCdataTag(block, tagName) {
  const re = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i');
  const m = block.match(re);
  if (!m) return '';
  const raw = m[1].trim();
  const cdata = raw.match(/^<!\[CDATA\[([\s\S]*)\]\]>$/i);
  return cdata ? cdata[1].trim() : htmlEntityDecode(raw);
}

function parseRssItems(xml) {
  const items = [];
  const matches = xml.match(/<item>([\s\S]*?)<\/item>/gi) || [];

  for (const rawItem of matches) {
    const title = extractCdataTag(rawItem, 'title') || extractTag(rawItem, 'title');
    const link = extractTag(rawItem, 'link');
    const pubDate = extractTag(rawItem, 'pubDate');
    const description = extractCdataTag(rawItem, 'description') || extractTag(rawItem, 'description');
    const content = extractCdataTag(rawItem, 'content:encoded');

    const bodyHtml = content || description;
    const slug = slugFromLink(link) || slugify(title);
    const date = toIsoDateString(pubDate);
    const image = firstImageFromHtml(bodyHtml);
    const excerpt = excerptFromHtml(bodyHtml, description);

    if (!slug || !title) continue;

    items.push({
      slug,
      title,
      bodyHtml,
      date,
      image,
      excerpt,
      _sortDate: pubDate || date
    });
  }

  return items;
}

async function fetchRssItems(baseUrl) {
  const url = `${baseUrl}/feed`;
  const res = await fetch(url, {
    headers: REQUEST_HEADERS
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${url}`);
  }

  const xml = await res.text();
  return parseRssItems(xml);
}

function normalizeApiItem(item) {
  const title = (item.title || '').trim() || 'Untitled';
  const slug = (item.slug || '').trim() || slugify(title);
  const bodyHtml = (item.body_html || '').trim();
  const date = toIsoDateString(item.post_date || item.date || '');
  const image = item.cover_image || firstImageFromHtml(bodyHtml);
  const excerpt = excerptFromHtml(bodyHtml, item.description || item.truncated_body_text || '');

  return {
    slug,
    title,
    bodyHtml,
    date,
    image,
    excerpt,
    _sortDate: item.post_date || item.date || ''
  };
}

async function fetchArchiveLatestItems(baseUrl) {
  const url = `${baseUrl}/api/v1/archive?sort=new&offset=0&limit=${ARCHIVE_LIMIT}`;
  const res = await fetch(url, {
    headers: REQUEST_HEADERS
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${url}`);
  }

  const data = await res.json();
  const items = Array.isArray(data) ? data : [];
  return items.map(normalizeApiItem).filter(x => x.slug && x.title);
}

async function fetchLatestItems(publication) {
  try {
    const rssItems = await fetchRssItems(publication.baseUrl);
    return { items: rssItems, source: 'feed' };
  } catch (rssError) {
    const archiveItems = await fetchArchiveLatestItems(publication.baseUrl);
    return { items: archiveItems, source: `archive fallback (${rssError.message})` };
  }
}

async function incrementalPublication(publication) {
  const existing = readExistingArticles(WORKSPACE, publication);
  const slugToExistingPath = existingSlugToMarkdownPath(existing);

  const mergedBySlug = new Map();
  Object.values(existing).forEach(entry => {
    const mdPath = entry.markdownFile || '';
    const base = path.basename(mdPath, '.md');
    const m = base.match(/^[a-z]+_post_(?:\d+[-_])?(.+)$/i);
    if (!m || !m[1]) return;

    mergedBySlug.set(m[1], {
      slug: m[1],
      title: entry.title || 'Untitled',
      bodyHtml: null,
      date: entry.date || '',
      image: entry.image || '',
      excerpt: entry.excerpt || '',
      markdownFile: mdPath,
      _sortDate: entry.date || ''
    });
  });

  const latestResult = await fetchLatestItems(publication);
  const latestItems = latestResult.items;

  latestItems.forEach(post => {
    const existingPath = slugToExistingPath.get(post.slug);
    const markdownFile = existingPath || path.posix.join(publication.postsDir, `${publication.filePrefix}_${post.slug}.md`);

    mergedBySlug.set(post.slug, {
      ...post,
      markdownFile
    });
  });

  const entriesDesc = stableSortByDateDesc(Array.from(mergedBySlug.values()));

  entriesDesc.forEach(post => {
    if (post.bodyHtml) {
      writeMarkdown(WORKSPACE, post.markdownFile, buildMarkdown(post.title, post.bodyHtml));
    }
  });

  writeDataFile(WORKSPACE, publication, entriesDesc);
  return {
    total: entriesDesc.length,
    updatedFromSource: latestItems.length,
    source: latestResult.source
  };
}

async function main() {
  console.log('Starting incremental RSS import (latest posts only)...');
  for (const pub of PUBLICATIONS) {
    try {
      const result = await incrementalPublication(pub);
      console.log(`${pub.name}: ${result.total} local posts, ${result.updatedFromSource} updated from ${result.source}.`);
    } catch (error) {
      console.error(`${pub.name}: failed -> ${error.message}`);
      process.exitCode = 1;
    }
  }
}

main();
