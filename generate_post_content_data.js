const fs = require('fs');
const path = require('path');

const SCRIPT_DIR = __dirname;
const PROJECT_ROOT = SCRIPT_DIR;
const POSTS_DIR = path.join(PROJECT_ROOT, 'posts');
const OUT_FILE = path.join(SCRIPT_DIR, 'post_content_data.js');

function toPosix(relativePath) {
  return relativePath.split(path.sep).join('/');
}

function walk(dir, out = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, out);
      continue;
    }
    if (!entry.isFile()) continue;
    if (!entry.name.toLowerCase().endsWith('.md')) continue;
    out.push(fullPath);
  }
  return out;
}

const files = walk(POSTS_DIR).sort();
const map = {};

for (const filePath of files) {
  const relativePath = toPosix(path.relative(SCRIPT_DIR, filePath));
  map[relativePath] = fs.readFileSync(filePath, 'utf8');
}

const output = `window.POST_CONTENTS = ${JSON.stringify(map, null, 2)};\n`;
fs.writeFileSync(OUT_FILE, output, 'utf8');

console.log(`Generated ${path.basename(OUT_FILE)} with ${files.length} posts.`);
