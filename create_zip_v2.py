import os
import zipfile
import sys
import datetime

# Log file path
LOG_FILE = "zip_creation.log"

def log(message):
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(f"[{timestamp}] {message}\n")
    print(message)

def create_zip():
    current_dir = os.getcwd()
    zip_name = "daily_report_system_dist.zip"
    output_path = os.path.join(current_dir, zip_name)

    log("Starting ZIP creation...")
    
    # Exclusions
    EXCLUDE_DIRS = {
        'node_modules', '.next', '.git', '__pycache__', 'venv', 
        '.vscode', '.idea', 'screenshots', 'playground', 'brain', '.gemini', '.system_generated'
    }
    EXCLUDE_FILES = {
        '.DS_Store', 'Thumbs.db', 'create_zip.py', 'fix_vbs.py', 'zip_creation.log',
        'create_zip_v2.py', 'output.log', zip_name
    }
    EXCLUDE_EXTENSIONS = {'.zip', '.log', '.err', '.tmp'}

    try:
        with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
            count = 0
            for root, dirs, files in os.walk(current_dir):
                # Filter directories
                dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
                
                for file in files:
                    file_path = os.path.join(root, file)
                    rel_path = os.path.relpath(file_path, current_dir)
                    
                    # Check exclusions
                    path_parts = rel_path.split(os.sep)
                    if any(part in EXCLUDE_DIRS for part in path_parts):
                        continue
                        
                    if file in EXCLUDE_FILES:
                        continue
                        
                    if any(file.endswith(ext) for ext in EXCLUDE_EXTENSIONS):
                        continue
                        
                    # Add to ZIP
                    try:
                        log(f"Adding: {rel_path}")
                        zipf.write(file_path, rel_path)
                        count += 1
                    except Exception as e:
                        log(f"ERROR adding {rel_path}: {str(e)}")

        log(f"ZIP creation completed. Total files: {count}")
        log(f"Output: {output_path}")
        
    except Exception as e:
        log(f"FATAL ERROR: {str(e)}")

if __name__ == "__main__":
    # Clear log
    with open(LOG_FILE, "w", encoding="utf-8") as f:
        f.write("--- Log Start ---\n")
    create_zip()
