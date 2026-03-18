#!/usr/bin/env python3
"""
Script to generate ../images.json from author subdirectories.
Scans all direct subdirectories in public/images/ for image files and creates
the gallery index with the format:
{"author_name": ["image1.png", "image2.jpg", ...]}
"""

import json
from pathlib import Path

# Common image extensions
IMAGE_EXTENSIONS = {'.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp', '.svg', '.ico', '.tiff', '.tif'}

def is_image_file(filename):
    """Check if a file is an image based on its extension."""
    return Path(filename).suffix.lower() in IMAGE_EXTENSIONS

def is_author_directory(path):
    """Return True for author folders that should appear in the gallery."""
    if not path.is_dir():
        return False

    # Keep hidden author names like `.buoyancy`, but ignore tool/cache dirs.
    ignored = {"__pycache__"}
    return path.name not in ignored


def scan_subdirectories(base_dir):
    """
    Scan all direct subdirectories in base_dir for image files.
    Returns a dictionary with folder names as keys and lists of image filenames as values.
    """
    images_by_folder = {}

    # Get all author subdirectories (only direct subdirectories, not nested)
    subdirs = [d for d in base_dir.iterdir() if is_author_directory(d)]

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
    script_dir = Path(__file__).resolve().parent
    output_file = script_dir.parent / "images.json"

    print(f"Scanning author folders in '{script_dir}' for image files...")
    print("-" * 50)

    # Scan for images
    images_data = scan_subdirectories(script_dir)

    print("-" * 50)
    print(f"\nTotal folders with images: {len(images_data)}")
    total_images = sum(len(files) for files in images_data.values())
    print(f"Total images found: {total_images}")

    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(images_data, f, indent=2, ensure_ascii=False)
        f.write("\n")

    print(f"\n✓ Successfully created '{output_file}'")

if __name__ == "__main__":
    main()
