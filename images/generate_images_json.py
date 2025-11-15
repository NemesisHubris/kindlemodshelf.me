#!/usr/bin/env python3
"""
Script to generate images.json file from subdirectories.
Scans all subdirectories for image files and creates a JSON file
with the format: {"folder_name": ["image1.png", "image2.jpg", ...]}
"""

import os
import json
from pathlib import Path

# Common image extensions
IMAGE_EXTENSIONS = {'.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp', '.svg', '.ico', '.tiff', '.tif'}

def is_image_file(filename):
    """Check if a file is an image based on its extension."""
    return Path(filename).suffix.lower() in IMAGE_EXTENSIONS

def scan_subdirectories():
    """
    Scan all subdirectories in the current directory for image files.
    Returns a dictionary with folder names as keys and lists of image filenames as values.
    """
    current_dir = Path.cwd()
    images_by_folder = {}

    # Get all subdirectories (only direct subdirectories, not nested)
    subdirs = [d for d in current_dir.iterdir() if d.is_dir() and not d.name.startswith('.')]

    # Sort subdirectories by name for consistent output
    subdirs.sort(key=lambda x: x.name)

    for subdir in subdirs:
        folder_name = subdir.name
        image_files = []

        # Get all files in this subdirectory (not recursive)
        try:
            files = [f for f in subdir.iterdir() if f.is_file()]

            # Filter for image files and sort by name
            for file in sorted(files, key=lambda x: x.name):
                if is_image_file(file.name):
                    image_files.append(file.name)

            # Only add folder if it contains images
            if image_files:
                images_by_folder[folder_name] = image_files
                print(f"Found {len(image_files)} images in '{folder_name}'")

        except PermissionError:
            print(f"Warning: Permission denied accessing '{folder_name}'")
            continue

    return images_by_folder

def main():
    """Main function to generate images.json file."""
    print("Scanning subdirectories for image files...")
    print("-" * 50)

    # Scan for images
    images_data = scan_subdirectories()

    print("-" * 50)
    print(f"\nTotal folders with images: {len(images_data)}")
    total_images = sum(len(files) for files in images_data.values())
    print(f"Total images found: {total_images}")

    # Write to images.json
    output_file = Path.cwd() / "images.json"

    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(images_data, f, indent=2, ensure_ascii=False)

    print(f"\n✓ Successfully created '{output_file}'")

if __name__ == "__main__":
    main()
