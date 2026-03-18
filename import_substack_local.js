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
    headers: {
      'accept': 'application/rss+xml, application/xml;q=0.9, */*;q=0.8',
      'user-agent': 'backyard-thoughts-importer/1.0'
    }
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${url}`);
  }

  const xml = await res.text();
  return parseRssItems(xml);
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

  const latestItems = await fetchRssItems(publication.baseUrl);

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
  return { total: entriesDesc.length, updatedFromFeed: latestItems.length };
}

async function main() {
  console.log('Starting incremental RSS import (latest posts only)...');
  for (const pub of PUBLICATIONS) {
    try {
      const result = await incrementalPublication(pub);
      console.log(`${pub.name}: ${result.total} local posts, ${result.updatedFromFeed} updated from feed.`);
    } catch (error) {
      console.error(`${pub.name}: failed -> ${error.message}`);
      process.exitCode = 1;
    }
  }
}

main();
