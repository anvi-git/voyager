#!/usr/bin/env node

/**
 * Add missing img fallback tags to picture elements in markdown files
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

function fixPictureElements(html) {
  if (!html) return html;
  
  // Replace picture elements without img fallback
  const fixed = html.replace(/<picture>(\s*<source[^>]*>)*\s*<\/picture>/gi, (match) => {
    // Extract srcset from first source tag
    const sourceMatch = match.match(/<source[^>]*srcset="([^"]*)"/i);
    if (!sourceMatch) return match;
    
    const srcset = sourceMatch[1];
    const firstUrl = srcset.split(/\s+/)[0];
    
    // Replace with picture + img
    return match.replace('</picture>', `<img src="${firstUrl}" alt="Image"></picture>`);
  });
  
  return fixed;
}

async function main() {
  let totalFiles = 0;
  let fixed = 0;

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
        const beforeCount = (content.match(/<picture>/gi) || []).length;
        
        const updated = fixPictureElements(content);
        
        const afterCount = (updated.match(/<picture>/gi) || []).length;
        const afterImgCount = (updated.match(/<picture>[\s\S]*?<img/gi) || []).length;
        
        if (updated !== content) {
          fs.writeFileSync(markdownPath, updated, 'utf8');
          console.log(`  ✓ ${id}: Added img fallback tags (${beforeCount} pictures, ${afterImgCount} now with img)`);
          fixed++;
        } else {
          console.log(`  - ${id}: No changes needed`);
        }
      } catch (err) {
        console.log(`  ✗ ${id}: ${err.message}`);
      }
    }
  }
  
  console.log(`\n=== Summary ===`);
  console.log(`Total files processed: ${totalFiles}`);
  console.log(`Files fixed: ${fixed}`);
}

main().catch(console.error);
