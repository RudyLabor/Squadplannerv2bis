#!/bin/bash

# Script pour retirer bg-[var(--bg-base)] de tous les screens

cd /src/app/screens

for file in *.tsx; do
  if [ -f "$file" ]; then
    # Remplacer bg-[var(--bg-base)] par rien (avec espace avant)
    sed -i 's/ bg-\[var(--bg-base)\]//g' "$file"
    echo "✓ Fixed: $file"
  fi
done

echo "✅ Tous les backgrounds ont été retirés !"
