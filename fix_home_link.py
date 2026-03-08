import os
import re

directory = '.'
valid_extensions = ('.html')

for root, _, files in os.walk(directory):
    for filename in files:
        if filename.endswith(valid_extensions):
            filepath = os.path.join(root, filename)
            
            # Calculate depth from root
            rel_path = os.path.relpath(root, directory)
            if rel_path == '.':
                depth = 0
            else:
                depth = len(rel_path.split(os.sep))
            
            # Construct the relative prefix for this specific file
            if depth == 0:
                relative_prefix = './'
            else:
                relative_prefix = '../' * depth
                
            with open(filepath, 'r', encoding='utf-8') as file:
                content = file.read()
            
            new_content = content
            
            # Find the specific `href="/#"` and replace with `href="./#"` or `href="../../#"`
            pattern = r'href="/#"'
            repl = f'href="{relative_prefix}#"'

            # Note: There might be a variant `href="/portfolio-website-2019/#"`, let's handle that too just in case
            pattern2 = r'href="/portfolio-website-2019/#"'
            
            new_content = re.sub(pattern, repl, new_content)
            new_content = re.sub(pattern2, repl, new_content)

            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as file:
                    file.write(new_content)
                print(f"Updated: {filepath}")

print("Done fixing home links.")
