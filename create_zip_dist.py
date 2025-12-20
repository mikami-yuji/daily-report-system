import shutil
import os

src_dir = r"c:\Users\asahi\.gemini\antigravity\playground\pyro-eclipse\backend\dist\DailyReportSystem"
output_filename = r"c:\Users\asahi\.gemini\antigravity\playground\pyro-eclipse\DailyReportSystem_Standalone"


print(f"Starting zip creation...")
print(f"Source: {src_dir}")
print(f"Output: {output_filename}")

if os.path.exists(src_dir):
    try:
        shutil.make_archive(output_filename, 'zip', src_dir)
        print(f"Created {output_filename}.zip")
    except Exception as e:
        print(f"Error creating zip: {e}")
else:
    print(f"Source directory not found: {src_dir}")
