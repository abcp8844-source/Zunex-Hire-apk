import os

# پرانے امپورٹ پاتھ اور ان کے نئے راستے (Mapping)
PATH_MAP = {
    # 1. Friends System (Moved from profile to Friends)
    'screens/profile/FriendsListScreen': 'screens/Friends/FriendsListScreen',
    'screens/profile/FindFriendsScreen': 'screens/Friends/FindFriendsScreen',
    'screens/profile/FriendRequestsScreen': 'screens/Friends/FriendRequestsScreen',
    
    # 2. Post System (Moved from feed to Post)
    'screens/feed/CreatePostScreen': 'screens/Post/CreatePostScreen',
    'screens/feed/EditPostScreen': 'screens/Post/EditPostScreen',
    'screens/feed/PostImageEditor': 'screens/Post/PostImageEditor',

    # 3. Reactions System (Moved from feed to Reactions)
    'screens/feed/CommentSection': 'screens/Reactions/CommentSection',
    'screens/feed/PostLikeSection': 'screens/Reactions/PostLikeSection',
    'screens/feed/ReactionsModal': 'screens/Reactions/ReactionsModal'
}

EXTENSIONS = ('.js', '.jsx', '.ts', '.tsx')

def scan_and_fix_imports(target_directory):
    updated_files_count = 0
    
    for root, _, files in os.walk(target_directory):
        for file in files:
            if file.endswith(EXTENSIONS):
                file_path = os.path.join(root, file)
                
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                modified_content = content
                for old_path, new_path in PATH_MAP.items():
                    if old_path in modified_content:
                        modified_content = modified_content.replace(old_path, new_path)
                
                if modified_content != content:
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(modified_content)
                    print(f"Updated: {file_path}")
                    updated_files_count += 1

    print(f"\nExecution Complete: {updated_files_count} files successfully updated.")

if __name__ == "__main__":
    scan_and_fix_imports('./src')
