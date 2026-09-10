import os
import re
import glob
from supabase import create_client

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not url:
    print("ERROR: SUPABASE_URL Missing in Secrets")

if not key:
    print("ERROR: SUPABASE_SERVICE_ROLE_KEY Missing in Secrets")

if not url or not key:
    print("Execution Stopped due to missing environment variables.")
else:
    try:
        supabase = create_client(url, key)

        SERVICES_DIR = "src/services/"
        discovered_schema = {}

        if os.path.exists(SERVICES_DIR):
            for filepath in glob.glob(os.path.join(SERVICES_DIR, "**/*.ts"), recursive=True) + glob.glob(os.path.join(SERVICES_DIR, "**/*.js"), recursive=True):
                with open(filepath, "r", encoding="utf-8") as f:
                    content = f.read()

                tables = re.findall(r"\.from\(['\"]([a-zA-Z0-9_]+)['\"]\)", content)

                for table in tables:
                    if table not in discovered_schema:
                        discovered_schema[table] = set(["id", "created_at"])

                    selects = re.findall(r"\.select\(['\"]([^'\"]+)['\"]\)", content)
                    for sel in selects:
                        cols = [c.strip() for c in sel.replace("\n", "").split(",") if c.strip() and not c.strip().startswith("*")]
                        for col in cols:
                            clean_col = col.split("(")[0].strip()
                            if clean_col and "." not in clean_col:
                                discovered_schema[table].add(clean_col)

                    payloads = re.findall(r"\.(?:insert|update|upsert)\(\s*[\{\[](.*?)[\}\]]\s*\)", content, re.DOTALL)
                    for p in payloads:
                        keys = re.findall(r"([a-zA-Z0-9_]+)\s*:", p)
                        for k in keys:
                            discovered_schema[table].add(k)

        if not discovered_schema:
            discovered_schema = {
                "profiles": {"id", "username", "full_name", "avatar_url", "cover_url", "bio", "city", "website", "phone", "created_at", "updated_at"},
                "friends": {"id", "user_id", "friend_id", "status", "created_at"},
                "groups": {"id", "name", "description", "cover_url", "creator_id", "created_at"},
                "group_members": {"id", "group_id", "user_id", "role", "status", "joined_at"},
                "group_admins": {"id", "group_id", "user_id", "created_at"},
                "posts": {"id", "user_id", "group_id", "content", "image_url", "scheduled_at", "is_approved", "created_at", "updated_at"},
                "likes": {"id", "post_id", "user_id", "created_at"},
                "comments": {"id", "post_id", "user_id", "content", "created_at"},
                "shares": {"id", "post_id", "user_id", "created_at"},
                "notifications": {"id", "receiver_id", "sender_id", "type", "post_id", "group_id", "is_read", "created_at"}
            }

        sql_statements = []

        for table, columns in discovered_schema.items():
            sql_statements.append(f'CREATE TABLE IF NOT EXISTS public."{table}" (id UUID PRIMARY KEY DEFAULT gen_random_uuid());')
            
            for col in columns:
                if col == "id":
                    continue
                col_type = "TEXT DEFAULT ''"
                if "id" in col:
                    col_type = "UUID"
                elif "at" in col:
                    col_type = "TIMESTAMPTZ DEFAULT NOW()"
                elif "is_" in col or "has_" in col:
                    col_type = "BOOLEAN DEFAULT FALSE"

                sql_statements.append(f'ALTER TABLE public."{table}" ADD COLUMN IF NOT EXISTS "{col}" {col_type};')

            sql_statements.append(f'ALTER TABLE public."{table}" ENABLE ROW LEVEL SECURITY;')
            sql_statements.append(f'DROP POLICY IF EXISTS "Full Access Policy" ON public."{table}";')
            sql_statements.append(f'CREATE POLICY "Full Access Policy" ON public."{table}" FOR ALL TO public USING (true) WITH CHECK (true);')

        raw_sql = "\n".join(sql_statements)

        res = supabase.rpc("exec_sql", {"sql": raw_sql}).execute()
        print("SUCCESS: Database Sync Completed.")

    except Exception as err:
        print(f"FAILED ERROR DETAILS: {err}")
