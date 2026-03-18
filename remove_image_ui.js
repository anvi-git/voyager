#!/usr/bin/env node

/**
 * Remove image interaction UI (.image-link-expand) from all markdown files
 */

const fs = require('fs');

const collections = [
  { file: 'blog_data.js', varName: 'BLOG_ARTICLES' },
  { file: 'ht_data.js', varName: 'HT_ARTICLES' },
  { file: 'lss_data.js', varName: 'LSS_ARTICLES' },
  { file: 'spacesound_data.js', varName: 'SPACESOUND_ARTICLES' }
];

function loadDataFile(file, varName) {
  const txt = fs.readFileSync(file, 'utf8');
  return Function('window={};' + txt + ';return window.' + varName)();
}

function removeImageUI(html) {
  if (!html) return html;
  
  // Remove .image-link-expand divs and everything inside them
  let cleaned = html.replace(/<div[^>]*class="[^"]*image-link-expand[^"]*"[^>]*>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/a>/gi, '</a>');
  
  return cleaned;
}

async function main() {
  let totalFiles = 0;
  let cleaned = 0;

  for (const { file, varName } of collections) {
    console.log(`\nProcessing ${file}...`);
    
    const data = loadDataFile(file, varName);
    
    for (const [id, article] of Object.entries(data)) {
      const markdownPath = article.markdownFile;
      if (!markdownPath || !fs.existsSync(markdownPath)) {
        continue;
      }
      
      totalFiles++;
      try {
        let content = fs.readFileSync(markdownPath, 'utf8');
        const before = (content.match(/image-link-expand/gi) || []).length;
        
        const updated = removeImageUI(content);
        
        const after = (updated.match(/image-link-expand/gi) || []).length;
        
        if (updated !== content) {
          fs.writeFileSync(markdownPath, updated, 'utf8');
          console.log(`  ✓ ${id}: Removed ${before} image UI elements`);
          cleaned++;
        } else {
          console.log(`  - ${id}: No image UI found`);
        }
      } catch (err) {
        console.log(`  ✗ ${id}: ${err.message}`);
      }
    }
  }
  
  console.log(`\n=== Summary ===`);
  console.log(`Total files processed: ${totalFiles}`);
  console.log(`Files cleaned: ${cleaned}`);
}

main().catch(console.error);
