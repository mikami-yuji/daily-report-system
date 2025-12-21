import requests
import time
import sys
import os

BASE_URL = "http://localhost:8001"
UPLOAD_URL = f"{BASE_URL}/api/sales/upload"
GET_URL = f"{BASE_URL}/api/sales/43006"

# Create dummy sales csv
dummy_csv_path = 'backend/dummy_global_sales.csv'
with open(dummy_csv_path, 'w', encoding='utf-8') as f:
    f.write("タイトル,順位,得意先コード,得意先名称,売上金額,粗利金額,前年対比率,前年売上,前年粗利,前々年売上,前々年粗利\n")
    f.write("ランキング,1,43006,GlobalTestCorp,999999,111111,120.5,888888,222222,777777,333333\n")

# Wait for server
time.sleep(2)

try:
    # 1. Upload
    print(f"Uploading to {UPLOAD_URL}...")
    files = {'file': ('dummy_global_sales.csv', open(dummy_csv_path, 'rb'), 'text/csv')}
    res = requests.post(UPLOAD_URL, files=files)
    print(f"Upload Status: {res.status_code}")
    print(f"Upload Body: {res.text}")
    
    if res.status_code != 200:
        print("Upload failed")
        sys.exit(1)

    # 2. Get Data
    print(f"Fetching from {GET_URL}...")
    res = requests.get(GET_URL)
    print(f"Get Status: {res.status_code}")
    print(f"Get Body: {res.text}")
    
    data = res.json()
    data = res.json()
    
    expected_fields = ["found", "rank", "sales_amount", "gross_profit", "sales_yoy", "sales_last_year", "profit_last_year", "sales_2y_ago", "profit_2y_ago", "customer_name", "updated_at"]
    missing_fields = [f for f in expected_fields if f not in data]
    
    if missing_fields:
        print(f"TEST FAILED: Missing fields: {missing_fields}")
        sys.exit(1)

    if (data.get('found') == True and 
        data.get('sales_amount') == 999999 and 
        data.get('sales_last_year') == 888888 and
        data.get('profit_last_year') == 222222):
        print("TEST PASSED: Global sales data integration works.")
    else:
        print(f"TEST FAILED: Data mismatch. Got: {data}")
        sys.exit(1)

except Exception as e:
    print(f"Exception: {e}")
    sys.exit(1)
finally:
    if os.path.exists(dummy_csv_path):
        os.remove(dummy_csv_path)
