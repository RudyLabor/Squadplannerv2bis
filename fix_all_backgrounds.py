#!/usr/bin/env python3
import os
import re

# Dossier des screens
screens_dir = '/src/app/screens'

# Pattern à remplacer
pattern = r' bg-\[var\(--bg-base\)\]'
replacement = ''

# Compteurs
files_modified = 0
total_replacements = 0

# Parcourir tous les fichiers .tsx
for filename in os.listdir(screens_dir):
    if filename.endswith('.tsx'):
        filepath = os.path.join(screens_dir, filename)
        
        # Lire le fichier
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Compter les occurrences
        count = len(re.findall(pattern, content))
        
        if count > 0:
            # Remplacer
            new_content = re.sub(pattern, replacement, content)
            
            # Écrire le fichier modifié
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            
            files_modified += 1
            total_replacements += count
            print(f'✓ {filename}: {count} occurrences')

print(f'\n✅ {files_modified} fichiers modifiés')
print(f'✅ {total_replacements} remplacements effectués')
