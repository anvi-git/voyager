#!/usr/bin/env node

/**
 * Permanently sanitize all imported markdown files
 * Removes Substack references and cleans HTML content
 */

const fs = require('fs');
const path = require('path');

// Define collections
const collections = [
  { file: 'blog_data.js', varName: 'BLOG_ARTICLES' },
  { file: 'ht_data.js', varName: 'HT_ARTICLES' },
  { file: 'lss_data.js', varName: 'LSS_ARTICLES' },
  { file: 'spacesound_data.js', varName: 'SPACESOUND_ARTICLES' }
];

// Load data file
function loadDataFile(file, varName) {
  const txt = fs.readFileSync(file, 'utf8');
  return Function('window={};' + txt + ';return window.' + varName)();
}

// Regex-based sanitization (no external dependencies)
function sanitizeHtml(html) {
  if (!html) return html;
  
  let cleaned = html;
  
  // Remove Substack-specific wrapper divs and widgets
  cleaned = cleaned.replace(/<div[^>]*class="[^"]*subscription-widget-wrap-editor[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '');
  cleaned = cleaned.replace(/<div[^>]*class="[^"]*digest-post-embed[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '');
  cleaned = cleaned.replace(/<div[^>]*class="[^"]*button-wrapper[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '');
  cleaned = cleaned.replace(/<div[^>]*data-component-name="[^"]*Subscribe[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '');
  
  // Remove Substack iframes
  cleaned = cleaned.replace(/<iframe[^>]*src="[^"]*substack[^"]*"[^>]*>[\s\S]*?<\/iframe>/gi, '');
  
  // Keep image tags so imported posts preserve their original media.
  
  // Remove instagram embeds
  cleaned = cleaned.replace(/<div[^>]*class="[^"]*instagram[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '');
  
  // Strip Substack links (convert to plain text)
  cleaned = cleaned.replace(/<a[^>]*href="[^"]*(?:substack\.com|utm_source=substack)[^"]*"[^>]*>([^<]*)<\/a>/gi, '$1');
  
  // Remove style attributes from all tags
  cleaned = cleaned.replace(/\s+style="[^"]*"/gi, '');
  
  // Remove data-* attributes (Substack tracking)
  cleaned = cleaned.replace(/\s+data-[a-z-]*="[^"]*"/gi, '');
  
  // Remove onclick and other event handlers
  cleaned = cleaned.replace(/\s+on[a-z]+="[^"]*"/gi, '');
  
  // Strip utm parameters from URLs
  cleaned = cleaned.replace(/([?&])utm_source=[^&\s"]*&?/gi, '$1');
  cleaned = cleaned.replace(/([?&])utm_[a-z_]*=[^&\s"]*&?/gi, '$1');
  // Clean up leftover trailing ? or &
  cleaned = cleaned.replace(/([?&])$/gm, '');
  
  // Strip Substack CDN links and replace with just the content reference
  cleaned = cleaned.replace(/https:\/\/substackcdn\.com\/[^\s"]*\//gi, '');
  
  // Clean up multiple consecutive newlines
  cleaned = cleaned.replace(/\n\n\n+/g, '\n\n');
  
  return cleaned;
}

// Process files
async function main() {
  let totalFiles = 0;
  let processed = 0;
  let errors = 0;

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
        
        // Check if content looks like HTML (containing tags)
        const looksLikeHtml = /<[a-z][\s\S]*>/i.test(content);
        
        if (looksLikeHtml) {
          // Sanitize HTML content
          const cleaned = sanitizeHtml(content);
          fs.writeFileSync(markdownPath, cleaned, 'utf8');
          console.log(`  ✓ ${id}: ${path.basename(markdownPath)}`);
        } else {
          console.log(`  - ${id}: ${path.basename(markdownPath)} (plain text, skipped)`);
        }
        
        processed++;
      } catch (err) {
        console.log(`  ✗ ${id}: ${path.basename(markdownPath)} - ${err.message}`);
        errors++;
      }
    }
  }
  
  console.log(`\n=== Summary ===`);
  console.log(`Total files: ${totalFiles}`);
  console.log(`Processed: ${processed}`);
  console.log(`Errors: ${errors}`);
  console.log(`\n⚠️  WARNING: This operation overwrites original markdown files.`);
  console.log(`   Make sure you have git backups if needed.`);
}

main().catch(console.error);
