import os
import re

def scan_files(directory):
    issues = []
    
    # Regex to find usages of motion components
    motion_usage_pattern = re.compile(r'\Wmotion\.|<motion\.|AnimatePresence')
    
    # Regex to find proper imports
    motion_import_pattern = re.compile(r'import\s+.*\{?.*motion.*\}?.*from\s+[\'"]framer-motion[\'"]')
    animate_presence_import_pattern = re.compile(r'import\s+.*\{?.*AnimatePresence.*\}?.*from\s+[\'"]framer-motion[\'"]')
    
    # Regex to find BAD imports
    bad_import_pattern = re.compile(r'from\s+[\'"](motion|motion\/react)[\'"]')

    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(('.tsx', '.ts')):
                filepath = os.path.join(root, file)
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    # Check for bad imports
                    if bad_import_pattern.search(content):
                        issues.append(f"BAD IMPORT in: {filepath}")

                    # Check for usage without import
                    has_usage = motion_usage_pattern.search(content)
                    if has_usage:
                        has_import = motion_import_pattern.search(content)
                        has_ap_import = animate_presence_import_pattern.search(content)
                        
                        # Simplistic check: if usage found but no framer-motion import at all
                        if not (has_import or has_ap_import):
                             # Make sure it's not importing from somewhere else (like a wrapper)
                             if "from '@/app/utils/animations'" not in content: 
                                 issues.append(f"POSSIBLE MISSING IMPORT in: {filepath}")

                except Exception as e:
                    print(f"Skipping {filepath}: {e}")
    
    return issues

if __name__ == "__main__":
    problems = scan_files("./src")
    if problems:
        print("ISSUES FOUND:")
        for p in problems:
            print(p)
    else:
        print("No obvious issues found.")
