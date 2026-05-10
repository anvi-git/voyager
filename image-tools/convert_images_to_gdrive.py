#!/usr/bin/env python3
"""
Script to convert local image paths to Google Drive public links.
Usage: python convert_images_to_gdrive.py
"""

import os
import re
import json
from pathlib import Path

# Configuration
IMAGE_MAPPING_FILE = "image_mapping.json"  # File to store image ID mappings
HTML_FILES_DIR = "."  # Your website root directory
IMAGES_DIR = "./images"  # Your local images directory

def create_gdrive_url(file_id):
    """Generate a Google Drive public image URL from file ID"""
    return f"https://drive.google.com/uc?export=view&id={file_id}"

def load_image_mapping():
    """Load existing image ID mappings"""
    if os.path.exists(IMAGE_MAPPING_FILE):
        with open(IMAGE_MAPPING_FILE, 'r') as f:
            return json.load(f)
    return {}

def save_image_mapping(mapping):
    """Save image ID mappings"""
    with open(IMAGE_MAPPING_FILE, 'w') as f:
        json.dump(mapping, f, indent=2)

def setup_gdrive_mapping():
    """
    Load mapping from fetch_gdrive_images.py or create manually if needed
    """
    mapping = load_image_mapping()
    
    if mapping:
        print("=" * 70)
        print("GOOGLE DRIVE IMAGE MAPPING")
        print("=" * 70)
        print(f"\n✓ Found existing mapping with {len(mapping)} images")
        print("\nSample mappings:")
        for i, (img, file_id) in enumerate(list(mapping.items())[:3]):
            print(f"  • {img} → {file_id}")
        if len(mapping) > 3:
            print(f"  ... and {len(mapping) - 3} more")
        return mapping
    
    print("=" * 70)
    print("GOOGLE DRIVE IMAGE MAPPING SETUP")
    print("=" * 70)
    print("\n❌ No image_mapping.json found!")
    print("\nTo auto-generate the mapping, run:")
    print("  python3 fetch_gdrive_images.py")
    print("\nOr manually add the mapping:")
    
    # Find all local images
    if os.path.exists(IMAGES_DIR):
        local_images = []
        for root, dirs, files in os.walk(IMAGES_DIR):
            for file in files:
                if file.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg')):
                    rel_path = os.path.relpath(os.path.join(root, file), IMAGES_DIR)
                    local_images.append(rel_path)
        
        if local_images:
            print(f"\nFound {len(local_images)} images locally:")
            
            print("\n" + "-" * 70)
            print("Enter Google Drive file IDs for each image:")
            print("(Get ID from: right-click image in Drive → Get link → copy ID)")
            print("-" * 70)
            
            for img in sorted(local_images):
                while True:
                    file_id = input(f"\nGoogle Drive ID for '{img}': ").strip()
                    if file_id:
                        mapping[img] = file_id
                        test_url = create_gdrive_url(file_id)
                        print(f"  → URL: {test_url}")
                        break
                    else:
                        print("  Skipped")
                        break
        else:
            print(f"No images found in {IMAGES_DIR}")
    else:
        print(f"Directory {IMAGES_DIR} not found!")
    
    if mapping:
        save_image_mapping(mapping)
        print("\n✓ Mapping saved to " + IMAGE_MAPPING_FILE)
    
    return mapping

def convert_html_files(mapping):
    """
    Convert all HTML files to use Google Drive URLs instead of local paths
    """
    if not mapping:
        print("No image mappings found. Run setup first!")
        return
    
    print("\n" + "=" * 70)
    print("CONVERTING HTML FILES")
    print("=" * 70)
    
    converted_count = 0
    
    # Find all HTML files
    for root, dirs, files in os.walk(HTML_FILES_DIR):
        # Skip node_modules, .git, etc.
        dirs[:] = [d for d in dirs if d not in ['.git', 'node_modules', '.github']]
        
        for file in files:
            if file.endswith('.html'):
                filepath = os.path.join(root, file)
                print(f"\nProcessing: {filepath}")
                
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                original_content = content
                replacements = 0
                
                # Replace image paths
                for img_rel_path, file_id in mapping.items():
                    # Handle different path formats
                    local_patterns = [
                        f"./images/{img_rel_path}",
                        f"images/{img_rel_path}",
                        f"/images/{img_rel_path}",
                    ]
                    
                    gdrive_url = create_gdrive_url(file_id)
                    
                    for pattern in local_patterns:
                        # Replace in src attributes
                        content = re.sub(
                            rf'src=["\'](?:.*/)?{re.escape(img_rel_path)}["\']',
                            f'src="{gdrive_url}"',
                            content,
                            flags=re.IGNORECASE
                        )
                        # Replace in other contexts (backgrounds, etc.)
                        content = re.sub(
                            rf'([\(\"\'])(\./)?' + re.escape(img_rel_path) + r'([\)\"\'])',
                            rf'\1{gdrive_url}\3',
                            content,
                            flags=re.IGNORECASE
                        )
                    
                    if content != original_content:
                        replacements += 1
                
                if replacements > 0:
                    # Create backup
                    backup_path = filepath + '.backup'
                    with open(backup_path, 'w', encoding='utf-8') as f:
                        f.write(original_content)
                    
                    # Save converted file
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(content)
                    
                    print(f"  ✓ Updated {replacements} image references")
                    print(f"  💾 Backup saved to: {backup_path}")
                    converted_count += 1
    
    print(f"\n✓ Converted {converted_count} HTML file(s)")

def main():
    """Main execution"""
    print("\n" + "=" * 70)
    print("GOOGLE DRIVE IMAGE CONVERTER FOR GITHUB WEBSITES")
    print("=" * 70)
    
    mapping = setup_gdrive_mapping()
    
    if mapping:
        confirm = input("\nProceed with converting HTML files? (yes/no): ").lower()
        if confirm in ['yes', 'y']:
            convert_html_files(mapping)
            print("\n✓ Done! Your images are now linked to Google Drive.")
            print("\n📝 Next steps:")
            print("1. Review the converted HTML files (backups are saved)")
            print("2. Test your website to ensure images load")
            print("3. Keep image_mapping.json for future reference")
            print("4. You can now safely delete the ./images/ folder from local")
        else:
            print("Cancelled.")
    else:
        print("No images mapped. Exiting.")

if __name__ == "__main__":
    main()
