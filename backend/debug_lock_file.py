import os

lock_file = r'\\Asahipack02\社内書類ｎｅｗ\01：部署別　営業部\02：営業日報\2025年度\~$本社008　2025年度用日報【見上】.xlsm'

print(f"Checking for lock file: {lock_file}")

if os.path.exists(lock_file):
    print("Lock file EXISTS. The file is currently open.")
else:
    print("Lock file does NOT exist.")
