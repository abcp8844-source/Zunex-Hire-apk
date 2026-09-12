import os
import re
import subprocess

PATH_MAP = {
    'screens/profile/FriendsListScreen': 'screens/Friends/FriendsListScreen',
    'screens/profile/FindFriendsScreen': 'screens/Friends/FindFriendsScreen',
    'screens/profile/FriendRequestsScreen': 'screens/Friends/FriendRequestsScreen',
    'screens/feed/CreatePostScreen': 'screens/Post/CreatePostScreen',
    'screens/feed/EditPostScreen': 'screens/Post/EditPostScreen',
    'screens/feed/PostImageEditor': 'screens/Post/PostImageEditor',
    'screens/feed/CommentSection': 'screens/Reactions/CommentSection',
    'screens/feed/PostLikeSection': 'screens/Reactions/PostLikeSection',
    'screens/feed/ReactionsModal': 'screens/Reactions/ReactionsModal',
    './FriendsListScreen': '../Friends/FriendsListScreen',
    './FindFriendsScreen': '../Friends/FindFriendsScreen',
    './FriendRequestsScreen': '../Friends/FriendRequestsScreen',
    './CreatePostScreen': '../Post/CreatePostScreen',
    './EditPostScreen': '../Post/EditPostScreen',
    './PostImageEditor': '../Post/PostImageEditor',
    './CommentSection': '../Reactions/CommentSection',
    './PostLikeSection': '../Reactions/PostLikeSection',
    './ReactionsModal': '../Reactions/ReactionsModal',
}

IGNORED_OLD_FILES = {
    os.path.normpath('src/screens/profile/FriendsListScreen.tsx'),
    os.path.normpath('src/screens/profile/FindFriendsScreen.tsx'),
    os.path.normpath('src/screens/profile/FriendRequestsScreen.tsx'),
    os.path.normpath('src/screens/feed/CreatePostScreen.tsx'),
    os.path.normpath('src/screens/feed/EditPostScreen.tsx'),
    os.path.normpath('src/screens/feed/PostImageEditor.tsx'),
    os.path.normpath('src/screens/feed/CommentSection.tsx'),
    os.path.normpath('src/screens/feed/PostLikeSection.tsx'),
    os.path.normpath('src/screens/feed/ReactionsModal.tsx')
}

EXTENSIONS = ('.js', '.jsx', '.ts', '.tsx')

def run_repository_fix(src_dir):
    updated = 0
    for root, _, files in os.walk(src_dir):
        for file in files:
            if file.endswith(EXTENSIONS):
                file_path = os.path.normpath(os.path.join(root, file))
                
                if file_path in IGNORED_OLD_FILES:
                    continue

                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()

                new_content = content

                for old_p, new_p in PATH_MAP.items():
                    if old_p in new_content:
                        new_content = new_content.replace(old_p, new_p)

                norm_path = file_path.replace('\\', '/')
                if any(folder in norm_path for folder in ['screens/Friends', 'screens/Post', 'screens/Reactions']):
                    new_content = re.sub(r"from\s+['\"](\.\./services/)", "from '../../services/", new_content)
                    new_content = re.sub(r"from\s+['\"](\.\./components/)", "from '../../components/", new_content)
                    new_content = re.sub(r"from\s+['\"](\.\./utils/)", "from '../../utils/", new_content)
                    new_content = re.sub(r"from\s+['\"](\.\./types/)", "from '../../types/", new_content)
                    new_content = re.sub(r"from\s+['\"](\.\./navigation/)", "from '../../navigation/", new_content)

                if new_content != content:
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"FIXED: {file_path}")
                    updated += 1

    print(f"\nSUCCESS: {updated} files updated.")

def run_typecheck():
    try:
        subprocess.run(['npx', 'tsc', '--noEmit'], check=True)
        print("VERIFICATION: All connections valid.")
    except subprocess.CalledProcessError as e:
        print("BUILD STATUS: Check complete with errors.")

if __name__ == "__main__":
    run_repository_fix('./src')
    run_typecheck()
