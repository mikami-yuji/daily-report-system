
import os
import sys

def create_launcher(dist_dir):
    if not os.path.exists(dist_dir):
        print(f"Error: Directory {dist_dir} does not exist")
        return

    print(f"Creating launcher in {dist_dir}")

    # Create simple readme
    readme_path = os.path.join(dist_dir, "README.txt")
    try:
        with open(readme_path, "w", encoding="utf-8") as f:
            f.write("営業日報システム\n\n")
            f.write("DailyReportSystem.exe をダブルクリックして起動してください。\n")
            f.write("黒い画面（コンソール）が表示されますが、正常な動作です。閉じないでください。\n")
            f.write("起動するとブラウザが自動的に開かない場合は、http://localhost:8001 にアクセスしてください。\n")
        print(f"Created {readme_path}")
    except Exception as e:
        print(f"Error creating README: {e}")

    # Create a wrapper batch file
    bat_path = os.path.join(dist_dir, "起動.bat")
    try:
        with open(bat_path, "w", encoding="cp932") as f:
            f.write("@echo off\n")
            f.write("echo Starting Daily Report System...\n")
            f.write("start \"\" \"DailyReportSystem.exe\"\n")
            f.write("timeout /t 5\n")
            f.write("start http://localhost:8001\n")
        print(f"Created {bat_path}")
    except Exception as e:
        print(f"Error creating batch file: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python create_launcher.py <dist_dir>")
        sys.exit(1)
    
    create_launcher(sys.argv[1])
