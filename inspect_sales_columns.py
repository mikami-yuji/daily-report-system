import pandas as pd
import os

CSV_PATH = r'backend\data\sales_data.csv'

def inspect_csv():
    if not os.path.exists(CSV_PATH):
        print(f"File not found: {CSV_PATH}")
        return

    try:
        try:
            df = pd.read_csv(CSV_PATH, encoding='cp932')
        except:
            df = pd.read_csv(CSV_PATH, encoding='utf-8')
        
        print(f"Columns ({len(df.columns)}):")
        for idx, col in enumerate(df.columns):
            print(f"{idx}: {col}")
            
        print("\nFirst row:")
        print(df.iloc[0].to_dict())

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    inspect_csv()
