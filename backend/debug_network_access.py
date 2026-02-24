import os

path = r'\\Asahipack02\社内書類ｎｅｗ\01：部署別　営業部\02：営業日報\2025年度'

print(f"Checking access to: {path}")

try:
    if os.path.exists(path):
        print("Path exists.")
        print("Listing files:")
        files = os.listdir(path)
        for f in files:
            print(f" - {f}")
    else:
        print("Path does NOT exist.")
except Exception as e:
    print(f"Error accessing path: {e}")
