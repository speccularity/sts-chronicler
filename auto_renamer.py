import os
import re
import tkinter as tk
from tkinter import messagebox
from PIL import Image, ImageTk, ImageEnhance
import pytesseract
import easyocr
import numpy as np

reader = easyocr.Reader(['en'], gpu=True)

# WINDOWS USERS ONLY: Uncomment and adjust the path below if Python cannot find tesseract
# pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

class CardRenamerApp:
    def __init__(self, master, directory):
        self.master = master
        self.directory = directory
        self.master.title("Slay the Spire Auto-Renamer")
        self.master.geometry("600x850")
        
        # Clean existing filenames (replace underscores with spaces)
        self.clean_existing_filenames()
        
        # Gather numeric files
        self.files = self.get_numeric_files()
        self.current_index = 0

        if not self.files:
            messagebox.showinfo("Complete", "No files with strictly numeric names were found!")
            self.master.quit()
            return

        # --- UI Setup ---
        self.status_label = tk.Label(master, text="", font=("Arial", 12))
        self.status_label.pack(pady=10)

        self.image_label = tk.Label(master)
        self.image_label.pack(pady=10)

        instructions = tk.Label(master, text="Review the OCR guess, then press Enter:", font=("Arial", 10))
        instructions.pack(pady=5)

        self.entry = tk.Entry(master, font=("Arial", 16), width=30)
        self.entry.pack(pady=5)
        self.entry.bind("<Return>", self.rename_and_next)
        
        # Auto-Process Button
        self.auto_btn = tk.Button(master, text="⚡ Auto-Rename Remaining (OCR)", 
                                  font=("Arial", 12, "bold"), bg="#4CAF50", fg="white", 
                                  command=self.auto_process_remaining)
        self.auto_btn.pack(pady=15)

        # Load the first image
        self.load_image()

    def clean_existing_filenames(self):
        for filename in os.listdir(self.directory):
            if '_' in filename:
                old_path = os.path.join(self.directory, filename)
                new_path = os.path.join(self.directory, filename.replace('_', ' '))
                if not os.path.exists(new_path):
                    try:
                        os.rename(old_path, new_path)
                    except Exception:
                        pass

    def get_numeric_files(self):
        all_files = os.listdir(self.directory)
        numeric_files = []
        for f in all_files:
            if f.lower().endswith('.png'):
                basename = os.path.splitext(f)[0]
                if re.match(r'^\d+$', basename):
                    numeric_files.append(os.path.join(self.directory, f))
        return numeric_files

    def extract_card_name(self, image_path):
        """Uses EasyOCR with RGB binarization and character allowlisting."""
        try:
            img = Image.open(image_path)
            width, height = img.size
            
            # 1. Crop to banner region
            crop_box = (width * 0.18, height * 0.08, width * 0.82, height * 0.19)
            banner = img.crop(crop_box)
            
            # 2. Scale up 4x 
            banner = banner.resize((banner.width * 4, banner.height * 4), Image.Resampling.LANCZOS)
            
            # 3. Apply RGB Thresholding to remove drop-shadows (Fixes 'F' vs 'E')
            rgb = banner.convert('RGB')
            pixels = rgb.load()
            
            bw = Image.new('L', rgb.size)
            bw_pixels = bw.load()
            
            w, h = rgb.size
            for y in range(h):
                for x in range(w):
                    r, g, b = pixels[x, y]
                    
                    # Target both White (normal) and Green (upgraded) text
                    is_white_text = (r > 205 and g > 205 and b > 205)
                    is_green_text = (g > 100 and g > (r + 18) and g > (b + 18))
                    
                    if is_white_text or is_green_text:
                        bw_pixels[x, y] = 0   # Turn text pure black
                    else:
                        bw_pixels[x, y] = 255 # Turn shadows and background pure white
            
            # 4. Convert the cleaned PIL image into a NumPy array for EasyOCR
            img_array = np.array(bw)
            
            # 5. Read text using an allowlist (Forces it to look for the '+' symbol)
            allowed_chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz +'"
            results = reader.readtext(img_array, allowlist=allowed_chars, detail=0)
            
            if results:
                # Combine results if it read multiple blocks
                text = " ".join(results)
                
                # Final cleanup to strip any leftover artifacts
                clean_text = re.sub(r'[^A-Za-z \+\']', '', text).strip()
                clean_text = ' '.join(clean_text.split())
                return clean_text
            
            return ""
        except Exception as e:
            print(f"OCR failed for {image_path}: {e}")
            return ""

    # def extract_card_name(self, image_path):
    #         """Uses Tesseract OCR with dual RGB thresholding (White & Green text) to read card names."""
    #         try:
    #             img = Image.open(image_path)
    #             width, height = img.size
                
    #             # Crop to banner region (X: 18% to 82%, Y: 8% to 19%)
    #             crop_box = (width * 0.18, height * 0.08, width * 0.82, height * 0.19)
    #             banner = img.crop(crop_box)
                
    #             # 1. Scale up 4x for sharp letter resolution
    #             banner = banner.resize((banner.width * 4, banner.height * 4), Image.Resampling.LANCZOS)
                
    #             # 2. Convert to RGB for channel-based color evaluation
    #             rgb = banner.convert('RGB')
    #             pixels = rgb.load()
                
    #             # 3. Create a binary image (Black text on White background)
    #             bw = Image.new('L', rgb.size)
    #             bw_pixels = bw.load()
                
    #             w, h = rgb.size
    #             for y in range(h):
    #                 for x in range(w):
    #                     r, g, b = pixels[x, y]
                        
    #                     # Condition A: White text fill (Normal cards)
    #                     is_white_text = (r > 205 and g > 205 and b > 205)
                        
    #                     # Condition B: Green text fill (Upgraded cards)
    #                     # Requires green channel to be dominant over red & blue by at least 18 units
    #                     is_green_text = (g > 100 and g > (r + 18) and g > (b + 18))
                        
    #                     if is_white_text or is_green_text:
    #                         bw_pixels[x, y] = 0   # Turn text BLACK
    #                     else:
    #                         bw_pixels[x, y] = 255 # Turn background/outlines WHITE
                
    #             # 4. Tesseract Config: PSM 6 (single uniform block of text)
    #             # Whitelist includes letters, spaces, apostrophes, and the '+' sign
    #             custom_config = r'--psm 6 -c tessedit_char_whitelist="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz +\'"'
                
    #             ocr_text = pytesseract.image_to_string(bw, config=custom_config).strip()
                
    #             # Clean up unwanted artifacts
    #             clean_text = re.sub(r'[^A-Za-z \+\']', '', ocr_text)
    #             clean_text = ' '.join(clean_text.split())
                
    #             return clean_text
    #         except Exception as e:
    #             print(f"OCR failed for {image_path}: {e}")
    #             return ""

    def load_image(self):
        if self.current_index >= len(self.files):
            messagebox.showinfo("Complete", "All numeric cards have been successfully renamed!")
            self.master.quit()
            return

        current_file = self.files[self.current_index]
        file_name = os.path.basename(current_file)
        
        self.status_label.config(text=f"Card {self.current_index + 1} of {len(self.files)}  |  Original File: {file_name}")

        try:
            img = Image.open(current_file)
            img.thumbnail((450, 600)) 
            self.tk_img = ImageTk.PhotoImage(img)
            self.image_label.config(image=self.tk_img)
        except Exception as e:
            messagebox.showerror("Error", f"Could not load image {file_name}\nError: {e}")
            self.master.quit()
            return

        # Clear text box and auto-fill with OCR result
        self.entry.delete(0, tk.END)
        guessed_name = self.extract_card_name(current_file)
        if guessed_name:
            self.entry.insert(0, guessed_name)
            
        self.entry.focus()

    def rename_and_next(self, event=None):
        new_name = self.entry.get().strip()
        
        if not new_name:
            messagebox.showwarning("Warning", "Card name cannot be empty!")
            return

        success = self.perform_rename(self.files[self.current_index], new_name)
        if success:
            self.current_index += 1
            self.load_image()

    def perform_rename(self, current_file_path, new_name):
        directory = os.path.dirname(current_file_path)

        if not new_name.lower().endswith('.png'):
            new_name += '.png'

        new_file_path = os.path.join(directory, new_name)

        if os.path.exists(new_file_path):
            messagebox.showerror("Collision Error", f"A file named '{new_name}' already exists!")
            return False

        try:
            os.rename(current_file_path, new_file_path)
            return True
        except Exception as e:
            messagebox.showerror("File Error", f"Failed to rename file:\n{e}")
            return False

    def auto_process_remaining(self):
        """Attempts to OCR and automatically rename all remaining files silently."""
        auto_count = 0
        starting_index = self.current_index
        total_remaining = len(self.files) - starting_index

        self.auto_btn.config(text="Processing...", state=tk.DISABLED)
        self.master.update()

        while self.current_index < len(self.files):
            current_file = self.files[self.current_index]
            guessed_name = self.extract_card_name(current_file)
            
            # Only auto-approve if OCR returned something substantial (at least 3 characters)
            if guessed_name and len(guessed_name) >= 3:
                success = self.perform_rename(current_file, guessed_name)
                if success:
                    self.current_index += 1
                    auto_count += 1
                    continue
            
            # If OCR failed, was too short, or renaming failed, stop the auto-loop
            # so the user can handle this tricky card manually.
            break 
            
        # If we broke out of the loop but still have files left, load the troublesome file in the GUI
        if self.current_index < len(self.files):
            self.auto_btn.config(text="⚡ Auto-Rename Remaining (OCR)", state=tk.NORMAL)
            self.load_image()
            messagebox.showinfo("Auto-Pause", f"Auto-processed {auto_count} cards.\n\nStopped because OCR was uncertain about the current card. Please verify this one manually.")
        else:
            messagebox.showinfo("Complete", f"Auto-processed {auto_count} out of {total_remaining} cards.\nAll done!")
            self.master.quit()


if __name__ == "__main__":
    target_directory = input("Enter the full path to your cards directory: ").strip()
    
    if target_directory.startswith('"') and target_directory.endswith('"'):
        target_directory = target_directory[1:-1]
    elif target_directory.startswith("'") and target_directory.endswith("'"):
        target_directory = target_directory[1:-1]
        
    if not os.path.isdir(target_directory):
        print(f"Error: The directory '{target_directory}' does not exist.")
    else:
        root = tk.Tk()
        root.lift()
        root.attributes('-topmost', True)
        root.after_idle(root.attributes, '-topmost', False)
        
        app = CardRenamerApp(root, target_directory)
        root.mainloop()