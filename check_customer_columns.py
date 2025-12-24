import os
import json
import pandas as pd

def load_config():
    config_path = os.path.join(os.path.dirname(__file__), 'backend', 'config.json')
    default_path = r'\\Asahipack02\社内書類ｎｅｗ\01：部署別　営業部\02：営業日報\2025年度'
    
    if os.path.exists(config_path):
        try:
            with open(config_path, 'r', encoding='utf-8') as f:
                config = json.load(f)
                return config.get('excel_dir', default_path)
        except:
            return default_path
    
    return default_path

def main():
    excel_dir = load_config()
    print(f"Excel Dir: {excel_dir}")
    
    if not os.path.exists(excel_dir):
        print("Excel directory not found.")
        # Fallback to backend/dist if needed? No, user environment seems to have network drive or local mock.
        return

    files = [f for f in os.listdir(excel_dir) if f.endswith('.xlsm') and not f.startswith('~$')]
    if not files:
        print("No .xlsm files found.")
        return
    
    target_file = os.path.join(excel_dir, files[0])
    print(f"Reading: {target_file}")
    
    try:
        df = pd.read_excel(target_file, sheet_name='得意先_List', header=0)
        print("Columns:", df.columns.tolist())
        
        # Check for address or area related columns
        relevant_cols = [c for c in df.columns if 'エリア' in str(c) or '住所' in str(c)]
        print("Relevant Columns:", relevant_cols)
        
        if relevant_cols:
            print("First 5 rows of relevant columns:")
            print(df[relevant_cols].head())
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
