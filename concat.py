import os

def is_code_file(filename):
    exts = ['.js', '.jsx', '.ts', '.tsx', '.py', '.html', '.css', '.json', '.md']
    return any(filename.endswith(ext) for ext in exts)

def should_ignore(path):
    ignores = [
        'node_modules', '.venv', 'venv', '__pycache__', 'build', 'dist', 
        '.git', 'package-lock.json', 'yarn.lock', '.next', '.vscode', '.idea'
    ]
    path_parts = path.replace('\\', '/').split('/')
    return any(ig in path_parts or ig in path.lower() for ig in ignores)

def write_files(directories, output_file):
    with open(output_file, 'w', encoding='utf-8') as outfile:
        for directory in directories:
            if not os.path.exists(directory): continue
            
            for root, dirs, files in os.walk(directory):
                # Filter dirs in place
                dirs[:] = [d for d in dirs if not should_ignore(os.path.join(root, d))]
                
                for file in files:
                    filepath = os.path.join(root, file)
                    if not is_code_file(file):
                        continue
                    if should_ignore(filepath):
                        continue
                        
                    try:
                        with open(filepath, 'r', encoding='utf-8') as infile:
                            content = infile.read()
                            outfile.write(f"\n\n{'='*80}\n")
                            outfile.write(f"FILE: {filepath}\n")
                            outfile.write(f"{'='*80}\n\n")
                            outfile.write(content)
                    except Exception as e:
                        pass # Ignore read errors (e.g. binary disguised as text)

base_path = r'c:\enosh\Enosh\smf'

# Frontend directories
frontend_dirs = [os.path.join(base_path, 'admin-panel'), os.path.join(base_path, 'client')]
# Backend directories
backend_dirs = [os.path.join(base_path, 'backend_django')]

write_files(frontend_dirs, os.path.join(base_path, 'frontend_all.txt'))
write_files(backend_dirs, os.path.join(base_path, 'backend_all.txt'))

print("Concatenation complete!")
