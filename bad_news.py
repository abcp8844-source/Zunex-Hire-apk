import os
import re
import json
import psycopg2
from urllib.parse import urlparse

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

def get_db_connection():
    db_url = os.environ.get("DATABASE_URL") or os.environ.get("SUPABASE_DB_URL")
    if not db_url:
        raise ValueError("Missing DATABASE_URL / Direct Postgres Connection String.")
    return psycopg2.connect(db_url)

def drop_and_rebuild_direct_sql():
    dropped = []
    created = []
    
    conn = get_db_connection()
    conn.autocommit = True
    cursor = conn.cursor()

    for table in MASTER_TABLES_SCHEMA.keys():
        cursor.execute(f"DROP TABLE IF EXISTS public.{table} CASCADE;")
        dropped.append(table)

    for table, schema_cols in MASTER_TABLES_SCHEMA.items():
        cols_def = ", ".join(schema_cols)
        cursor.execute(f"CREATE TABLE public.{table} ({cols_def});")
        created.append(table)

    cursor.close()
    conn.close()
    return dropped, created

def run_direct_rebuild():
    report = {
        "pipeline_status": "STARTING",
        "dropped_tables": [],
        "created_tables": [],
        "error": None
    }

    try:
        dropped, created = drop_and_rebuild_direct_sql()
        report["dropped_tables"] = dropped
        report["created_tables"] = created
        report["pipeline_status"] = "SUCCESS: Wiped and Rebuilt All Database Tables Cleanly"
    except Exception as e:
        report["pipeline_status"] = "FAILED"
        report["error"] = str(e)

    print(json.dumps(report, indent=2))

if __name__ == "__main__":
    run_direct_rebuild()
