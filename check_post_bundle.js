const fs = require('fs');
const vm = require('vm');

const bundle = fs.readFileSync('post_content_data.js', 'utf8');
const ctx = { window: {} };

try {
  vm.runInNewContext(bundle, ctx, { filename: 'post_content_data.js' });
  const keyCount = Object.keys(ctx.window.POST_CONTENTS || {}).length;
  console.log('bundle_ok', keyCount);
} catch (e) {
  console.log('bundle_error', e.message);
  process.exit(1);
}

const files = ['blog_data.js', 'ht_data.js', 'lss_data.js', 'spacesound_data.js'];
const all = [];

for (const f of files) {
  const txt = fs.readFileSync(f, 'utf8');
  const re = /"markdownFile"\s*:\s*"([^"]+)"|markdownFile\s*:\s*'([^']+)'/g;
  let m;
  while ((m = re.exec(txt))) {
    all.push({ file: f, p: m[1] || m[2] });
  }
}

const missingInBundle = all.filter(x => !Object.prototype.hasOwnProperty.call(ctx.window.POST_CONTENTS, x.p));
console.log('references', all.length);
console.log('missing_in_bundle', missingInBundle.length);
if (missingInBundle.length) {
  missingInBundle.slice(0, 20).forEach(x => console.log(`${x.file}: ${x.p}`));
}
