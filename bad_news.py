import os
import re
import json

EXTENSIONS = ('.js', '.jsx', '.ts', '.tsx')

TABLE_PATTERN = re.compile(
    r"(?:from|into|update|join|table)\s*[\(\'\"]([a-zA-Z0-9_]+)[\'\"]|"
    r"\.from\(['\"]([a-zA-Z0-9_]+)['\"]\)", 
    re.IGNORECASE
)

COLUMN_PATTERN = re.compile(
    r'\b([a-z0-9_]+(?:_id|_name|_url|_city|_at|_by|full_name|username|bio|website|email|phone|current_city|avatar_url|cover_url))\b', 
    re.IGNORECASE
)

def extract_schema_from_file(file_path):
    tables = set()
    columns = set()
    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()

        for match in TABLE_PATTERN.findall(content):
            tbl = match[0] or match[1]
            if tbl and tbl.lower() != 'react':
                tables.add(tbl)

        cols = COLUMN_PATTERN.findall(content)
        for col in cols:
            columns.add(col)
    except Exception:
        pass
    return tables, columns

def run_services_comparison_audit(src_dir="./src"):
    services_dir = os.path.join(src_dir, "services")
    
    if not os.path.exists(src_dir) or not os.path.exists(services_dir):
        print(json.dumps({"error": "Directory structure invalid. 'src' or 'src/services' missing."}, indent=2))
        return

    # Step 1: Services Folder Master Schema Extract
    services_tables = set()
    services_columns = set()
    services_files_map = {}

    for root, _, files in os.walk(services_dir):
        for file in files:
            if file.endswith(EXTENSIONS):
                file_path = os.path.join(root, file)
                t, c = extract_schema_from_file(file_path)
                services_tables.update(t)
                services_columns.update(c)
                rel_path = os.path.relpath(file_path, src_dir).replace('\\', '/')
                services_files_map[rel_path] = {"tables": sorted(list(t)), "columns": sorted(list(c))}

    # Step 2: Rest of Repository Schema Extract
    other_tables = set()
    other_columns = set()
    other_files_map = {}

    for root, _, files in os.walk(src_dir):
        if os.path.commonpath([root, services_dir]) == services_dir:
            continue

        for file in files:
            if file.endswith(EXTENSIONS):
                file_path = os.path.join(root, file)
                t, c = extract_schema_from_file(file_path)
                other_tables.update(t)
                other_columns.update(c)
                
                if t or c:
                    rel_path = os.path.relpath(file_path, src_dir).replace('\\', '/')
                    other_files_map[rel_path] = {"tables": sorted(list(t)), "columns": sorted(list(c))}

    # Step 3: Compare & Find Discrepancies
    missing_tables_in_repo = sorted(list(services_tables - other_tables))
    missing_columns_in_repo = sorted(list(services_columns - other_columns))
    extra_tables_in_repo = sorted(list(other_tables - services_tables))
    extra_columns_in_repo = sorted(list(other_columns - services_columns))

    report = {
        "audit_type": "SERVICES_VS_REPOSITORY_COMPARISON",
        "services_master_truth": {
            "total_tables": len(services_tables),
            "tables": sorted(list(services_tables)),
            "total_columns": len(services_columns),
            "columns": sorted(list(services_columns))
        },
        "discrepancies": {
            "defined_in_services_but_missing_in_repo": {
                "tables": missing_tables_in_repo,
                "columns": missing_columns_in_repo
            },
            "used_in_repo_but_missing_in_services": {
                "tables": extra_tables_in_repo,
                "columns": extra_columns_in_repo
            }
        },
        "repository_files_breakdown": other_files_map
    }

    print(json.dumps(report, indent=2))

if __name__ == "__main__":
    run_services_comparison_audit()
