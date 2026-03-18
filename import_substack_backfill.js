const path = require('path');
const {
  PUBLICATIONS,
  excerptFromHtml,
  slugify,
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
const LIMIT = 20;

async function fetchArchivePage(baseUrl, offset) {
  const url = `${baseUrl}/api/v1/archive?sort=new&offset=${offset}&limit=${LIMIT}`;
  const res = await fetch(url, {
    headers: {
      'accept': 'application/json',
      'user-agent': 'backyard-thoughts-importer/1.0'
    }
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${url}`);
  }

  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

async function fetchAllArchiveItems(baseUrl) {
  let offset = 0;
  const all = [];
  const seenIds = new Set();

  while (true) {
    const page = await fetchArchivePage(baseUrl, offset);
    if (!page.length) break;

    let added = 0;
    for (const item of page) {
      if (item && item.id && !seenIds.has(item.id)) {
        seenIds.add(item.id);
        all.push(item);
        added += 1;
      }
    }

    if (page.length < LIMIT) break;
    if (added === 0) break;
    offset += LIMIT;
  }

  return all;
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

async function backfillPublication(publication) {
  const existing = readExistingArticles(WORKSPACE, publication);
  const slugToExistingPath = existingSlugToMarkdownPath(existing);
  const items = await fetchAllArchiveItems(publication.baseUrl);

  const normalized = items
    .map(normalizeApiItem)
    .filter(x => x.slug && x.title)
    .map(post => {
      const existingPath = slugToExistingPath.get(post.slug);
      const markdownFile = existingPath || path.posix.join(publication.postsDir, `${publication.filePrefix}_${post.slug}.md`);
      return { ...post, markdownFile };
    });

  const dedup = new Map();
  normalized.forEach(post => {
    if (!dedup.has(post.slug)) dedup.set(post.slug, post);
  });

  const entriesDesc = stableSortByDateDesc(Array.from(dedup.values()));

  entriesDesc.forEach(post => {
    writeMarkdown(WORKSPACE, post.markdownFile, buildMarkdown(post.title, post.bodyHtml));
  });

  writeDataFile(WORKSPACE, publication, entriesDesc);

  return entriesDesc.length;
}

async function main() {
  console.log('Starting full Substack backfill import...');
  for (const pub of PUBLICATIONS) {
    try {
      const count = await backfillPublication(pub);
      console.log(`${pub.name}: ${count} posts imported (full backfill).`);
    } catch (error) {
      console.error(`${pub.name}: failed -> ${error.message}`);
      process.exitCode = 1;
    }
  }
}

main();
