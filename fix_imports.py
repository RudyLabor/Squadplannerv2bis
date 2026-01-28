import os

def fix_imports(directory):
    count = 0
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts'):
                filepath = os.path.join(root, file)
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    new_content = content.replace("from 'motion/react'", "from 'framer-motion'")
                    new_content = new_content.replace('from "motion/react"', 'from "framer-motion"')
                    
                    if new_content != content:
                        with open(filepath, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                        print(f"Fixed: {filepath}")
                        count += 1
                except Exception as e:
                    print(f"Error reading {filepath}: {e}")
    print(f"Total files fixed: {count}")

if __name__ == "__main__":
    fix_imports("./src")
