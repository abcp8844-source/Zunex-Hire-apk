import os
import re
import subprocess

EXTENSIONS = ('.js', '.jsx', '.ts', '.tsx')

def build_project_registry(src_dir):
    registry = {}
    for root, _, files in os.walk(src_dir):
        for file in files:
            if file.endswith(EXTENSIONS):
                name_without_ext = os.path.splitext(file)[0]
                full_path = os.path.normpath(os.path.join(root, file))
                if name_without_ext not in registry:
                    registry[name_without_ext] = [full_path]
                else:
                    registry[name_without_ext].append(full_path)
    return registry

def fix_imports_in_file(file_path, registry):
    current_dir = os.path.dirname(file_path)
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    import_pattern = r"(from\s+['\"]|import\s+['\"])(?:\./|\.\./|@/)([^'\"]+)(['\"])"

    def replacer(match):
        prefix = match.group(1)
        import_path = match.group(2)
        suffix = match.group(3)

        target_name = os.path.basename(import_path)
        target_name_no_ext = os.path.splitext(target_name)[0]

        if target_name_no_ext in registry:
            candidates = registry[target_name_no_ext]
            actual_file_path = candidates[0]
            
            rel_path = os.path.relpath(actual_file_path, current_dir).replace('\\', '/')
            rel_path = os.path.splitext(rel_path)[0]

            if not rel_path.startswith('.'):
                rel_path = './' + rel_path

            return f"{prefix}{rel_path}{suffix}"

        return match.group(0)

    updated_content = re.sub(import_pattern, replacer, content)

    if updated_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(updated_content)
        return True

    return False

def resolve_and_fix_all_imports(src_dir):
    registry = build_project_registry(src_dir)
    updated_files = 0
    total_files = 0

    for root, _, files in os.walk(src_dir):
        for file in files:
            if file.endswith(EXTENSIONS):
                total_files += 1
                full_file_path = os.path.normpath(os.path.join(root, file))
                if fix_imports_in_file(full_file_path, registry):
                    updated_files += 1

    print(f"Total scanned: {total_files}, Updated: {updated_files}")

def run_typecheck():
    try:
        subprocess.run(['npx', 'tsc', '--noEmit'], check=True)
        print("Typecheck passed successfully.")
    except subprocess.CalledProcessError:
        print("Typecheck failed with errors.")

if __name__ == "__main__":
    scan_dir = './src'
    if os.path.exists(scan_dir):
        resolve_and_fix_all_imports(scan_dir)
        run_typecheck()
    else:
        print("Error: 'src' directory not found.")
