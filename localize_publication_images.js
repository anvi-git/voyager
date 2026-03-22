#!/usr/bin/env node

const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const crypto = require('crypto');
const https = require('https');
const http = require('http');

const ROOT = process.cwd();

const PUBLICATIONS = {
  lss: {
    postsDir: path.join(ROOT, 'posts', 'lss'),
    outputBase: path.join(ROOT, 'images', 'lss', 'posts'),
    filePrefix: 'lss_post_'
  },
  ss: {
    postsDir: path.join(ROOT, 'posts', 'space_of_sound'),
    outputBase: path.join(ROOT, 'images', 'sos', 'posts'),
    filePrefix: 'ss_post_'
  }
};

function isRemoteUrl(value) {
  return /^https?:\/\//i.test(value || '');
}

function sanitizeFileName(name) {
  return name.replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/-+/g, '-');
}

function hash8(input) {
  return crypto.createHash('sha1').update(input).digest('hex').slice(0, 8);
}

function urlToBasename(url, fallbackIndex) {
  try {
    const parsed = new URL(url);
    const raw = path.basename(parsed.pathname || '') || `image-${fallbackIndex}`;
    const clean = sanitizeFileName(raw);
    return clean || `image-${fallbackIndex}`;
  } catch {
    return `image-${fallbackIndex}`;
  }
}

function fetchBuffer(url, redirects = 5) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https://') ? https : http;
    const requestOptions = {
      headers: {
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
        referer: 'https://substack.com/'
      }
    };

    client
      .get(url, requestOptions, (res) => {
        const code = res.statusCode || 0;

        if ([301, 302, 303, 307, 308].includes(code) && res.headers.location && redirects > 0) {
          const nextUrl = new URL(res.headers.location, url).toString();
          res.resume();
          resolve(fetchBuffer(nextUrl, redirects - 1));
          return;
        }

        if (code < 200 || code >= 300) {
          res.resume();
          reject(new Error(`HTTP ${code} for ${url}`));
          return;
        }

        const chunks = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => resolve(Buffer.concat(chunks)));
      })
      .on('error', reject);
  });
}

async function localizeFile(filePath, publication) {
  const relFile = path.relative(ROOT, filePath);
  const fileName = path.basename(filePath);
  const slug = fileName.replace(publication.filePrefix, '').replace(/\.html$/i, '');

  let content = await fsp.readFile(filePath, 'utf8');
  const srcRegex = /(<img\b[^>]*\bsrc=")(.*?)("[^>]*>)/gi;

  const matches = [];
  let match;
  while ((match = srcRegex.exec(content)) !== null) {
    matches.push({ src: match[2] });
  }

  const remoteUrls = Array.from(new Set(matches.map((m) => m.src).filter(isRemoteUrl)));
  if (remoteUrls.length === 0) {
    return { relFile, updated: false, downloaded: 0, rewritten: 0, failures: [] };
  }

  const outDir = path.join(publication.outputBase, slug);
  await fsp.mkdir(outDir, { recursive: true });

  const usedNames = new Set();
  const mapping = new Map();
  let downloaded = 0;
  const failures = [];

  for (let i = 0; i < remoteUrls.length; i += 1) {
    const url = remoteUrls[i];
    let base = urlToBasename(url, i + 1);

    if (usedNames.has(base)) {
      const ext = path.extname(base);
      const stem = ext ? base.slice(0, -ext.length) : base;
      base = `${stem}-${hash8(url)}${ext}`;
    }
    usedNames.add(base);

    const outPath = path.join(outDir, base);

    try {
      if (!fs.existsSync(outPath)) {
        const data = await fetchBuffer(url);
        await fsp.writeFile(outPath, data);
        downloaded += 1;
      }

      const relAsset = path.posix.join(
        path.relative(ROOT, publication.outputBase).replace(/\\/g, '/'),
        slug,
        base
      );
      mapping.set(url, relAsset);
    } catch (err) {
      failures.push({ url, error: err.message });
    }
  }

  let rewritten = 0;
  for (const [fromUrl, toPath] of mapping.entries()) {
    const escaped = fromUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(escaped, 'g');
    const before = content;
    content = content.replace(re, toPath);
    if (content !== before) {
      rewritten += 1;
    }
  }

  await fsp.writeFile(filePath, content, 'utf8');
  return { relFile, updated: true, downloaded, rewritten, failures };
}

async function localizePublication(key) {
  const publication = PUBLICATIONS[key];
  if (!publication) {
    throw new Error(`Unknown publication key: ${key}`);
  }

  const entries = await fsp.readdir(publication.postsDir);
  const htmlFiles = entries.filter((n) => n.endsWith('.html')).map((n) => path.join(publication.postsDir, n));

  let updatedCount = 0;
  let totalDownloaded = 0;
  let totalFailures = 0;

  for (const file of htmlFiles) {
    const result = await localizeFile(file, publication);
    if (!result.updated) continue;

    updatedCount += 1;
    totalDownloaded += result.downloaded;
    totalFailures += result.failures.length;

    console.log(`[${key}] updated ${result.relFile} (downloaded ${result.downloaded}, rewritten ${result.rewritten})`);
    if (result.failures.length) {
      result.failures.forEach((f) => {
        console.log(`  skipped ${f.url} (${f.error})`);
      });
    }
  }

  console.log(`[${key}] done: ${updatedCount} files updated, ${totalDownloaded} images downloaded, ${totalFailures} failures`);
}

async function main() {
  const keys = process.argv.slice(2);
  const runKeys = keys.length ? keys : ['lss', 'ss'];

  for (const key of runKeys) {
    await localizePublication(key);
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
