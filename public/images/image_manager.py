#!/usr/bin/env python3
"""
Image Manager - GUI tool for managing and deleting images from images.json
"""

import tkinter as tk
from tkinter import messagebox
from PIL import Image, ImageTk
import json
import os
from pathlib import Path

class ImageManager:
    def __init__(self, root):
        self.root = root
        self.root.title("Image Manager")
        self.root.geometry("1000x900")
        self.root.configure(bg='#2b2b2b')

        # Set working directory - use current directory
        self.base_dir = Path.cwd()
        self.json_path = self.base_dir / "images.json"

        # Stats
        self.deleted_count = 0
        self.skipped_count = 0
        self.missing_count = 0
        self.auto_skip_missing = False  # Don't auto-skip by default

        # Load data
        self.load_images_data()

        # Current state
        self.current_user = None
        self.current_image_index = 0
        self.current_photo = None

        # Setup UI
        self.setup_ui()

        # Load first image
        self.load_next_image()

    def load_images_data(self):
        """Load images.json file"""
        try:
            with open(self.json_path, 'r') as f:
                self.images_data = json.load(f)

            # Create flat list of (user, image) tuples
            self.image_list = []
            for user, images in self.images_data.items():
                for img in images:
                    self.image_list.append((user, img))

            print(f"Loaded {len(self.image_list)} images from {len(self.images_data)} users")
        except Exception as e:
            messagebox.showerror("Error", f"Failed to load images.json: {e}")
            self.images_data = {}
            self.image_list = []

    def save_images_data(self):
        """Save images.json file"""
        try:
            with open(self.json_path, 'w') as f:
                json.dump(self.images_data, f, indent=2)
            return True
        except Exception as e:
            messagebox.showerror("Error", f"Failed to save images.json: {e}")
            return False

    def get_folder_size(self):
        """Calculate total size of sorted folder in MB"""
        total_size = 0
        try:
            for dirpath, dirnames, filenames in os.walk(self.base_dir):
                for filename in filenames:
                    filepath = os.path.join(dirpath, filename)
                    try:
                        total_size += os.path.getsize(filepath)
                    except:
                        pass
            return total_size / (1024 * 1024)  # Convert to MB
        except:
            return 0

    def setup_ui(self):
        """Create the UI components"""

        # Top stats panel
        stats_frame = tk.Frame(self.root, bg='#1e1e1e', pady=10)
        stats_frame.pack(fill='x', padx=10, pady=5)

        # Folder size
        self.folder_size_label = tk.Label(
            stats_frame,
            text=f"Folder Size: {self.get_folder_size():.2f} MB",
            font=('Arial', 16, 'bold'),
            bg='#1e1e1e',
            fg='#00ff00'
        )
        self.folder_size_label.pack()

        # Stats row
        stats_row = tk.Frame(stats_frame, bg='#1e1e1e')
        stats_row.pack(pady=5)

        self.deleted_label = tk.Label(
            stats_row,
            text=f"Deleted: {self.deleted_count}",
            font=('Arial', 14, 'bold'),
            bg='#1e1e1e',
            fg='#ff4444'
        )
        self.deleted_label.pack(side='left', padx=20)

        self.skipped_label = tk.Label(
            stats_row,
            text=f"Skipped: {self.skipped_count}",
            font=('Arial', 14, 'bold'),
            bg='#1e1e1e',
            fg='#44aaff'
        )
        self.skipped_label.pack(side='left', padx=20)

        self.remaining_label = tk.Label(
            stats_row,
            text=f"Remaining: {len(self.image_list)}",
            font=('Arial', 14, 'bold'),
            bg='#1e1e1e',
            fg='#ffffff'
        )
        self.remaining_label.pack(side='left', padx=20)

        self.missing_label = tk.Label(
            stats_row,
            text=f"Missing: {self.missing_count}",
            font=('Arial', 14, 'bold'),
            bg='#1e1e1e',
            fg='#ffaa00'
        )
        self.missing_label.pack(side='left', padx=20)

        # Image info
        self.info_label = tk.Label(
            self.root,
            text="",
            font=('Arial', 12),
            bg='#2b2b2b',
            fg='#cccccc'
        )
        self.info_label.pack(pady=5)

        # Image display area
        image_frame = tk.Frame(self.root, bg='#1e1e1e')
        image_frame.pack(fill='both', expand=True, padx=10, pady=10)

        self.image_label = tk.Label(
            image_frame,
            bg='#1e1e1e',
            text="No more images",
            font=('Arial', 20),
            fg='#888888'
        )
        self.image_label.pack(expand=True)

        # Button frame
        button_frame = tk.Frame(self.root, bg='#2b2b2b')
        button_frame.pack(fill='x', padx=10, pady=10)

        # Back button
        self.back_button = tk.Button(
            button_frame,
            text="BACK",
            font=('Arial', 24, 'bold'),
            bg='#666666',
            fg='white',
            activebackground='#555555',
            activeforeground='white',
            command=self.go_back,
            height=3,
            relief='raised',
            bd=5
        )
        self.back_button.pack(side='left', fill='both', expand=True, padx=5)

        # Skip button
        self.skip_button = tk.Button(
            button_frame,
            text="SKIP",
            font=('Arial', 24, 'bold'),
            bg='#0066cc',
            fg='white',
            activebackground='#0052a3',
            activeforeground='white',
            command=self.skip_image,
            height=3,
            relief='raised',
            bd=5
        )
        self.skip_button.pack(side='left', fill='both', expand=True, padx=5)

        # Delete button
        self.delete_button = tk.Button(
            button_frame,
            text="DELETE",
            font=('Arial', 24, 'bold'),
            bg='#cc0000',
            fg='white',
            activebackground='#a30000',
            activeforeground='white',
            command=self.delete_image,
            height=3,
            relief='raised',
            bd=5
        )
        self.delete_button.pack(side='right', fill='both', expand=True, padx=5)

        # Keyboard bindings
        self.root.bind('<Left>', lambda e: self.go_back())
        self.root.bind('<Right>', lambda e: self.delete_image())
        self.root.bind('<Up>', lambda e: self.go_back())
        self.root.bind('<Down>', lambda e: self.skip_image())
        self.root.bind('<space>', lambda e: self.skip_image())
        self.root.bind('<Delete>', lambda e: self.delete_image())
        self.root.bind('b', lambda e: self.go_back())
        self.root.bind('B', lambda e: self.go_back())

    def find_image_file(self, user, image_name):
        """Find the actual image file"""
        user_dir = self.base_dir / user

        # If user directory doesn't exist, return None
        if not user_dir.exists():
            return None

        # Try exact match (this should work now with rebuilt JSON)
        exact_path = user_dir / image_name
        if exact_path.exists():
            return exact_path

        return None

    def load_next_image(self):
        """Load the next image in the queue"""
        # Keep trying until we find a valid image or run out
        while self.current_image_index < len(self.image_list):
            user, image_name = self.image_list[self.current_image_index]
            self.current_user = user
            self.current_image_name = image_name

            # Update info
            self.info_label.config(
                text=f"User: {user} | Image: {image_name} | {self.current_image_index + 1}/{len(self.image_list)}"
            )

            # Find and load image
            image_path = self.find_image_file(user, image_name)

            if not image_path or not image_path.exists():
                self.missing_count += 1
                self.update_stats()

                # Auto-skip missing files
                if self.auto_skip_missing:
                    # Remove from JSON since file doesn't exist
                    if user in self.images_data and image_name in self.images_data[user]:
                        self.images_data[user].remove(image_name)
                        if len(self.images_data[user]) == 0:
                            del self.images_data[user]
                        self.save_images_data()

                    # Remove from list and continue to next iteration
                    self.image_list.pop(self.current_image_index)
                    continue  # Try next image

                # If not auto-skipping, show error and stop
                self.image_label.config(
                    image='',
                    text=f"Image not found:\n{user}/{image_name}\n\n(Folder or file doesn't exist)",
                    compound='center',
                    fg='#ff6666',
                    font=('Arial', 14)
                )
                self.current_photo = None
                self.current_actual_path = None
                return

            # Store the actual path for deletion
            self.current_actual_path = image_path
            break  # Found a valid image, exit loop

        # Check if we've run out of images
        if self.current_image_index >= len(self.image_list):
            self.show_completion()
            return

        try:
            # Load image
            img = Image.open(image_path)

            # Get available space (accounting for other UI elements)
            available_width = 980
            available_height = 550

            # Calculate scaling to fit image while maintaining aspect ratio
            img_width, img_height = img.size
            width_ratio = available_width / img_width
            height_ratio = available_height / img_height
            scale = min(width_ratio, height_ratio, 1.0)  # Don't upscale

            new_width = int(img_width * scale)
            new_height = int(img_height * scale)

            img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)

            # Convert to PhotoImage
            self.current_photo = ImageTk.PhotoImage(img)
            self.image_label.config(image=self.current_photo, text='')

        except Exception as e:
            self.image_label.config(
                image='',
                text=f"Error loading image:\n{str(e)}",
                compound='center',
                fg='#ff6666'
            )
            self.current_photo = None

    def go_back(self):
        """Go back to previous image"""
        if self.current_image_index > 0:
            self.current_image_index -= 1
            # If we went back after skipping, decrease skip count
            if self.skipped_count > 0:
                self.skipped_count -= 1
            self.update_stats()
            self.load_next_image()

    def skip_image(self):
        """Skip current image"""
        if self.current_image_index >= len(self.image_list):
            return

        self.skipped_count += 1
        self.current_image_index += 1
        self.update_stats()
        self.load_next_image()

    def delete_image(self):
        """Delete current image from both filesystem and JSON"""
        if self.current_image_index >= len(self.image_list):
            return

        user = self.current_user
        image_name = self.current_image_name

        # Use the actual path found during load
        image_path = getattr(self, 'current_actual_path', None)

        try:
            # Delete physical file
            if image_path and image_path.exists():
                os.remove(image_path)
                print(f"Deleted file: {image_path}")
            elif image_path:
                print(f"File not found for deletion: {image_path}")

            # Remove from JSON data
            if user in self.images_data and image_name in self.images_data[user]:
                self.images_data[user].remove(image_name)

                # If user has no more images, remove user entry
                if len(self.images_data[user]) == 0:
                    del self.images_data[user]

            # Save JSON
            if self.save_images_data():
                # Remove from current list
                self.image_list.pop(self.current_image_index)
                self.deleted_count += 1

                # Update stats and load next
                self.update_stats()
                self.load_next_image()

        except Exception as e:
            messagebox.showerror("Error", f"Failed to delete image: {e}")

    def update_stats(self):
        """Update stats display"""
        self.deleted_label.config(text=f"Deleted: {self.deleted_count}")
        self.skipped_label.config(text=f"Skipped: {self.skipped_count}")
        self.remaining_label.config(text=f"Remaining: {len(self.image_list) - self.current_image_index}")
        self.missing_label.config(text=f"Missing: {self.missing_count}")
        self.folder_size_label.config(text=f"Folder Size: {self.get_folder_size():.2f} MB")

    def show_completion(self):
        """Show completion message"""
        self.image_label.config(
            image='',
            text=f"All Done!\n\nDeleted: {self.deleted_count}\nSkipped: {self.skipped_count}\nMissing: {self.missing_count}",
            font=('Arial', 24, 'bold'),
            fg='#00ff00'
        )
        self.skip_button.config(state='disabled')
        self.delete_button.config(state='disabled')

def main():
    root = tk.Tk()
    app = ImageManager(root)
    root.mainloop()

if __name__ == "__main__":
    main()
