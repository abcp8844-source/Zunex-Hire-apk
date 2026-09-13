import os
import re
import json

EXTENSIONS = ('.js', '.jsx', '.ts', '.tsx')

TABLE_USAGE_PATTERN = re.compile(
    r"(?:from|into|update|join|table)\s*[\(\'\"]([a-zA-Z0-9_]+)[\'\"]|"
    r"\.from\(['\"]([a-zA-Z0-9_]+)['\"]\)", 
    re.IGNORECASE
)

OPERATION_PATTERNS = {
    "READ (Incoming)": re.compile(r"\b(select|fetch|get|find|read)\b", re.IGNORECASE),
    "WRITE (Outgoing)": re.compile(r"\b(insert|update|upsert|delete|post|put|patch)\b", re.IGNORECASE)
}

COLUMN_PATTERN = re.compile(r'\b([a-z0-9_]+(?:_id|_name|_url|_city|_at|_by|full_name|username|bio|website|email|phone|current_city|avatar_url|cover_url))\b', re.IGNORECASE)

def audit_file_data_flow(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()

        tables_found = set()
        for match in TABLE_USAGE_PATTERN.findall(content):
            table = match[0] or match[1]
            if table:
                tables_found.add(table)

        columns_found = sorted(list(set(COLUMN_PATTERN.findall(content))))

        operations_found = []
        for op_type, pattern in OPERATION_PATTERNS.items():
            if pattern.search(content):
                operations_found.append(op_type)

        if tables_found or columns_found:
            return {
                "tables_accessed": sorted(list(tables_found)),
                "data_direction": operations_found if operations_found else ["UNKNOWN/INTERNAL"],
                "columns_referenced": columns_found
            }
    except Exception:
        pass
    return None

def run_read_only_data_audit(src_dir="./src"):
    if not os.path.exists(src_dir):
        print(json.dumps({"error": f"Directory '{src_dir}' not found."}, indent=2))
        return

    audit_logs = {
        "audit_type": "READ_ONLY_DATA_FLOW_LOGS",
        "target_directory": src_dir,
        "files_with_data_flow": {}
    }

    for root, _, files in os.walk(src_dir):
        for file in files:
            if file.endswith(EXTENSIONS):
                file_path = os.path.join(root, file)
                rel_path = os.path.relpath(file_path, src_dir).replace('\\', '/')
                
                file_analysis = audit_file_data_flow(file_path)
                if file_analysis:
                    audit_logs["files_with_data_flow"][rel_path] = file_analysis

    print(json.dumps(audit_logs, indent=2))

if __name__ == "__main__":
    run_read_only_data_audit()
