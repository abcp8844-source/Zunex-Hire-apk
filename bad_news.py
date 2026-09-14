import os
import json
import re
import urllib.request
import urllib.parse
from supabase import create_client

TARGET_SCHEMAS = {
    "profiles": [
        "id UUID PRIMARY KEY DEFAULT gen_random_uuid()",
        "user_id UUID UNIQUE NOT NULL",
        "full_name TEXT",
        "avatar_url TEXT",
        "cover_url TEXT",
        "created_at TIMESTAMPTZ DEFAULT NOW()"
    ],
    "posts": [
        "id UUID PRIMARY KEY DEFAULT gen_random_uuid()",
        "user_id UUID NOT NULL",
        "image_url TEXT",
        "content TEXT",
        "created_at TIMESTAMPTZ DEFAULT NOW()"
    ]
}

def get_supabase_client():
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("SUPABASE_ANON_KEY")
    if not url or not key:
        raise ValueError("SUPABASE_URL or Supabase Key missing in environment.")
    return create_client(url, key)

def get_cloudinary_credentials():
    cloud_name = (
        os.environ.get("CLOUDINARY_CLOUD_NAME") or 
        os.environ.get("EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME") or 
        os.environ.get("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME")
    )
    upload_preset = (
        os.environ.get("CLOUDINARY_UPLOAD_PRESET") or 
        os.environ.get("EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET")
    )
    return cloud_name, upload_preset

def audit_frontend_code(src_dir="./src"):
    code_issues = []
    cloud_name, upload_preset = get_cloudinary_credentials()

    if not os.path.exists(src_dir):
        return ["SRC directory not found."]

    for root, _, files in os.walk(src_dir):
        for file in files:
            if file.endswith(('.js', '.jsx', '.ts', '.tsx')):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                        content = f.read()

                    if "cloudinary" in content.lower() or "upload" in content.lower():
                        if "catch" in content and "console.error" not in content and "Alert" not in content:
                            code_issues.append(f"Silent catch block detected: {file_path}")

                        if "avatar_url" not in content and "cover_url" not in content and "image_url" not in content:
                            code_issues.append(f"Upload logic missing correct Supabase database column payload: {file_path}")

                        if cloud_name and cloud_name not in content and "process.env" not in content and "EXPO_PUBLIC" not in content:
                            code_issues.append(f"Hardcoded or mismatched Cloudinary Name in: {file_path}")

                except Exception as e:
                    code_issues.append(f"Error reading file {file_path}: {str(e)}")

    return code_issues

def test_cloudinary_upload():
    cloud_name, upload_preset = get_cloudinary_credentials()
    report = {
        "cloud_name": cloud_name if cloud_name else "MISSING",
        "upload_preset": upload_preset if upload_preset else "MISSING",
        "status": "FAILED",
        "error": None
    }

    if not cloud_name or not upload_preset:
        report["error"] = "CLOUDINARY_CLOUD_NAME or CLOUDINARY_UPLOAD_PRESET is missing from environment secrets."
        return report

    url = f"https://api.cloudinary.com/v1_1/{cloud_name}/image/upload"
    tiny_pixel = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
    
    payload = urllib.parse.urlencode({
        "file": tiny_pixel,
        "upload_preset": upload_preset
    }).encode("utf-8")

    try:
        req = urllib.request.Request(url, data=payload, method="POST")
        with urllib.request.urlopen(req) as response:
            res_data = json.loads(response.read().decode("utf-8"))
            if "secure_url" in res_data:
                report["status"] = "SUCCESS"
                report["test_image_url"] = res_data["secure_url"]
            else:
                report["error"] = "Upload responded without secure_url."
    except Exception as e:
        report["error"] = f"Cloudinary HTTP Error: {str(e)}"

    return report

def audit_database_tables(supabase):
    db_report = {"tables": {}, "errors": []}

    for table_name, schema_cols in TARGET_SCHEMAS.items():
        try:
            cols_def = ", ".join(schema_cols)
            create_sql = f"CREATE TABLE IF NOT EXISTS public.{table_name} ({cols_def});"
            supabase.rpc('exec_sql', {'sql': create_sql}).execute()
            db_report["tables"][table_name] = "Ready"
        except Exception:
            try:
                supabase.table(table_name).select("id").limit(1).execute()
                db_report["tables"][table_name] = "Accessible"
            except Exception as e:
                db_report["tables"][table_name] = "FAILED"
                db_report["errors"].append(f"Table [{table_name}] Error: {str(e)}")

    return db_report

def run_image_system_audit():
    final_report = {
        "status": "STARTING",
        "cloudinary_test": {},
        "database_audit": {},
        "codebase_audit": [],
        "summary_of_issues": []
    }

    final_report["cloudinary_test"] = test_cloudinary_upload()
    if final_report["cloudinary_test"]["status"] == "FAILED":
        final_report["summary_of_issues"].append(f"Cloudinary: {final_report['cloudinary_test']['error']}")

    try:
        supabase = get_supabase_client()
        final_report["database_audit"] = audit_database_tables(supabase)
        if final_report["database_audit"]["errors"]:
            final_report["summary_of_issues"].extend(final_report["database_audit"]["errors"])
    except Exception as e:
        final_report["summary_of_issues"].append(f"Supabase Connection Failed: {str(e)}")

    final_report["codebase_audit"] = audit_frontend_code("./src")
    if final_report["codebase_audit"]:
        final_report["summary_of_issues"].extend(final_report["codebase_audit"])

    if not final_report["summary_of_issues"]:
        final_report["status"] = "SUCCESS: Image pipeline, Database, and Frontend Code are synced."
    else:
        final_report["status"] = "ISSUES DETECTED"

    print(json.dumps(final_report, indent=2))

if __name__ == "__main__":
    run_image_system_audit()
