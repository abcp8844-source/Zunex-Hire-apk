import os
import re
import json
from supabase import create_client

EXTENSIONS = ('.js', '.jsx', '.ts', '.tsx')

MASTER_TABLES_SCHEMA = {
    "profiles": [
        "id UUID PRIMARY KEY DEFAULT gen_random_uuid()",
        "user_id UUID UNIQUE NOT NULL",
        "full_name TEXT",
        "username TEXT UNIQUE",
        "avatar_url TEXT",
        "cover_url TEXT",
        "bio TEXT",
        "website TEXT",
        "email TEXT",
        "phone TEXT",
        "current_city TEXT",
        "created_at TIMESTAMPTZ DEFAULT NOW()"
    ],
    "posts": [
        "id UUID PRIMARY KEY DEFAULT gen_random_uuid()",
        "user_id UUID NOT NULL",
        "group_id UUID",
        "image_url TEXT",
        "content TEXT",
        "created_at TIMESTAMPTZ DEFAULT NOW()"
    ],
    "groups": [
        "id UUID PRIMARY KEY DEFAULT gen_random_uuid()",
        "admin_id UUID NOT NULL",
        "name TEXT NOT NULL",
        "avatar_url TEXT",
        "created_at TIMESTAMPTZ DEFAULT NOW()"
    ],
    "group_members": [
        "id UUID PRIMARY KEY DEFAULT gen_random_uuid()",
        "group_id UUID NOT NULL",
        "user_id UUID NOT NULL",
        "created_at TIMESTAMPTZ DEFAULT NOW()"
    ],
    "scheduled_posts": [
        "id UUID PRIMARY KEY DEFAULT gen_random_uuid()",
        "user_id UUID NOT NULL",
        "group_id UUID",
        "scheduled_at TIMESTAMPTZ NOT NULL",
        "created_at TIMESTAMPTZ DEFAULT NOW()"
    ],
    "notifications": [
        "id UUID PRIMARY KEY DEFAULT gen_random_uuid()",
        "sender_id UUID NOT NULL",
        "receiver_id UUID NOT NULL",
        "reference_id UUID",
        "avatar_url TEXT",
        "full_name TEXT",
        "created_at TIMESTAMPTZ DEFAULT NOW()"
    ],
    "comments": [
        "id UUID PRIMARY KEY DEFAULT gen_random_uuid()",
        "post_id UUID NOT NULL",
        "user_id UUID NOT NULL",
        "comment TEXT NOT NULL",
        "created_at TIMESTAMPTZ DEFAULT NOW()"
    ],
    "likes": [
        "id UUID PRIMARY KEY DEFAULT gen_random_uuid()",
        "post_id UUID NOT NULL",
        "user_id UUID NOT NULL",
        "created_at TIMESTAMPTZ DEFAULT NOW()"
    ],
    "shares": [
        "id UUID PRIMARY KEY DEFAULT gen_random_uuid()",
        "post_id UUID NOT NULL",
        "user_id UUID NOT NULL",
        "created_at TIMESTAMPTZ DEFAULT NOW()"
    ],
    "saved_posts": [
        "id UUID PRIMARY KEY DEFAULT gen_random_uuid()",
        "post_id UUID NOT NULL",
        "user_id UUID NOT NULL",
        "created_at TIMESTAMPTZ DEFAULT NOW()"
    ],
    "reports": [
        "id UUID PRIMARY KEY DEFAULT gen_random_uuid()",
        "reporter_id UUID NOT NULL",
        "post_id UUID",
        "reason TEXT",
        "created_at TIMESTAMPTZ DEFAULT NOW()"
    ],
    "friend_requests": [
        "id UUID PRIMARY KEY DEFAULT gen_random_uuid()",
        "sender_id UUID NOT NULL",
        "receiver_id UUID NOT NULL",
        "status TEXT DEFAULT 'pending'",
        "created_at TIMESTAMPTZ DEFAULT NOW()"
    ],
    "friends": [
        "id UUID PRIMARY KEY DEFAULT gen_random_uuid()",
        "user_id UUID NOT NULL",
        "friend_id UUID NOT NULL",
        "created_at TIMESTAMPTZ DEFAULT NOW()"
    ],
    "blocked_users": [
        "id UUID PRIMARY KEY DEFAULT gen_random_uuid()",
        "user_id UUID NOT NULL",
        "blocked_id UUID NOT NULL",
        "created_at TIMESTAMPTZ DEFAULT NOW()"
    ],
    "activity_logs": [
        "id UUID PRIMARY KEY DEFAULT gen_random_uuid()",
        "user_id UUID NOT NULL",
        "action TEXT NOT NULL",
        "created_at TIMESTAMPTZ DEFAULT NOW()"
    ]
}

def get_supabase_client():
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("SUPABASE_ANON_KEY")
    if not url or not key:
        raise ValueError("Missing SUPABASE_URL or Supabase Key environment variables.")
    return create_client(url, key)

def fix_frontend_repository_code(src_dir="./src"):
    modified_files = 0
    replacements = {
        r"\byourwebsite\b": "website",
        r"\bsetBio\b": "bio",
        r"\bsetEmail\b": "email",
        r"\bsetPhone\b": "phone",
        r"\bsetUsername\b": "username",
        r"\bsetWebsite\b": "website"
    }

    for root, _, files in os.walk(src_dir):
        for file in files:
            if file.endswith(EXTENSIONS):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                        content = f.read()

                    new_content = content
                    for reg_pattern, replace_val in replacements.items():
                        new_content = re.sub(reg_pattern, replace_val, new_content)

                    if new_content != content:
                        with open(file_path, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                        modified_files += 1
                except Exception:
                    pass
    return modified_files

def create_database_schema(supabase):
    created_tables = []
    errors = []

    for table, schema_cols in MASTER_TABLES_SCHEMA.items():
        try:
            # Table probe: If table does not exist, insert via REST definition check or query payload
            probe = supabase.table(table).select("*").limit(1).execute()
            created_tables.append(table)
        except Exception:
            try:
                # Direct creation query mapping fallback
                cols_def = ", ".join(schema_cols)
                create_sql = f"CREATE TABLE public.{table} ({cols_def});"
                supabase.rpc('exec_sql', {'sql': create_sql}).execute()
                created_tables.append(table)
            except Exception as e:
                errors.append(f"Create Table Error [{table}]: {str(e)}")

    return created_tables, errors

def run_clean_rebuild_pipeline():
    src_dir = "./src"
    report = {
        "pipeline_status": "STARTING",
        "frontend_fixed_files": 0,
        "database_connection": False,
        "created_tables": [],
        "errors": []
    }

    report["frontend_fixed_files"] = fix_frontend_repository_code(src_dir)

    try:
        supabase = get_supabase_client()
        report["database_connection"] = True
    except Exception as e:
        report["pipeline_status"] = "FAILED: DATABASE AUTH ERROR"
        report["errors"].append(str(e))
        print(json.dumps(report, indent=2))
        return

    created, errors = create_database_schema(supabase)
    report["created_tables"] = created
    report["errors"] = errors

    if not errors:
        report["pipeline_status"] = "SUCCESS: Code repaired and Database tables verified/created."
    else:
        report["pipeline_status"] = "COMPLETED WITH WARNINGS"

    print(json.dumps(report, indent=2))

if __name__ == "__main__":
    run_clean_rebuild_pipeline()
