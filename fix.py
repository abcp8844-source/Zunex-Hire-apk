import os
from supabase import create_client

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not url or not key:
    raise ValueError("SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing.")

supabase = create_client(url, key)

print("Starting fake data insertion into Zunexhire tables...")

# 1. پہلے پروفائلز (Users) انسرٹ کرتے ہیں
# نوٹ: یہاں auth.users سے مطابقت کے لیے ہمیں عارضی یا پہلے سے موجود UUIDs درکار ہوتے ہیں، 
# لیکن اگر آپ ٹیسٹنگ کے لیے بنا رہے ہیں تو ہم ڈائریکٹ profiles میں انسرٹ کریں گے۔
profiles_data = [
    {
        "full_name": "Ahmad Khan",
        "avatar_url": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
        "bio": "Global Job Seeker & Tech Enthusiast 🚀"
    },
    {
        "full_name": "Sara Ali",
        "avatar_url": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
        "bio": "Travel guide and consultant at Qatar."
    },
    {
        "full_name": "Bilal Ahmed",
        "avatar_url": "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150",
        "bio": "Exploring logistics and opportunities in Oman."
    }
]

# پروفائلز داخل کریں
profiles_res = supabase.table("profiles").insert(profiles_data).execute()
print(f"Profiles inserted successfully.")

# اگر پروفائلز آگئی ہیں تو ان کی آئی ڈیز نکال لیتے ہیں
# (فرض کریں ڈیٹا بیس سے فیچ ہو گئیں)
all_profiles = supabase.table("profiles").select("id, full_name").execute().data

if not all_profiles:
    print("Error: No profiles found to link posts/groups.")
    exit()

admin_id = all_profiles[0]["id"]
user_id_2 = all_profiles[1]["id"] if len(all_profiles) > 1 else admin_id

# 2. گروپس بنانا (Groups Table)
groups_data = [
    {
        "name": "Qatar Jobs & Visa 2026",
        "description": "Official group for job seekers in Doha and Qatar.",
        "privacy": "public",
        "admin_id": admin_id,
        "avatar_url": "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=300"
    },
    {
        "name": "Oman Logistics & Engineering",
        "description": "Connecting engineers and logistics experts in Salalah.",
        "privacy": "public",
        "admin_id": user_id_2,
        "avatar_url": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=300"
    }
]
groups_res = supabase.table("groups").insert(groups_data).execute()
print("Groups inserted.")

# گروپس کی آئی ڈیز حاصل کریں
all_groups = supabase.table("groups").select("id, name").execute().data
group_id_1 = all_groups[0]["id"] if all_groups else None

# 3. پوسٹس بنانا (Posts Table with Images)
posts_data = [
    {
        "user_id": admin_id,
        "group_id": group_id_1,
        "content": "JOBS PUBLIC SECTOR VACANCIES MINISTRY QATAR DOHA 2026. Doha holds one of the most distinctive labor markets.",
        "image_url": "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=600",
        "is_approved": True
    },
    {
        "user_id": user_id_2,
        "group_id": group_id_1,
        "content": "JOBS TEACHER INTERNATIONAL SCHOOLS BAHRAIN RIFFA 2026. Teaching roles across Bahrain international campuses.",
        "image_url": "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600",
        "is_approved": True
    }
]
posts_res = supabase.table("posts").insert(posts_data).execute()
print("Posts with images inserted.")

# پوسٹ آئی ڈی حاصل کریں کمنٹس اور لائکس کے لیے
all_posts = supabase.table("posts").select("id").execute().data
post_id = all_posts[0]["id"] if all_posts else None

if post_id:
    # 4. لائکس انسرٹ کریں (Likes Table)
    supabase.table("likes").insert([
        {"post_id": post_id, "user_id": user_id_2}
    ]).execute()

    # 5. کمنٹس انسرٹ کریں (Comments Table)
    supabase.table("comments").insert([
        {"post_id": post_id, "user_id": user_id_2, "content": "Very helpful post! Can you share details about visa?"}
    ]).execute()
    print("Likes and Comments added successfully.")

# 6. نوٹیفیکیشنز انسرٹ کریں (Notifications Table)
supabase.table("notifications").insert([
    {
        "receiver_id": admin_id,
        "sender_id": user_id_2,
        "type": "like",
        "content": "Sara Ali liked your post.",
        "is_read": False
    }
]).execute()

print("All dummy data injection completed successfully! Now test your app flow.")
