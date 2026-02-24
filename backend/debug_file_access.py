import os

path = r'\\Asahipack02\社内書類ｎｅｗ\01：部署別　営業部\02：営業日報\2025年度\本社008　2025年度用日報【見上】.xlsm'

print(f"Checking access to file: {path}")

try:
    with open(path, 'rb') as f:
        print("Successfully opened file for reading.")
except Exception as e:
    print(f"Failed to open file: {e}")
