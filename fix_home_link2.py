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
            # Instead of `./#` we want EXACTLY `index.html`
            if depth == 0:
                home_link = 'index.html'
            else:
                home_link = '../' * depth + 'index.html'
                
            with open(filepath, 'r', encoding='utf-8') as file:
                content = file.read()
            
            new_content = content
            
            # We fix the YIGE WANG link exactly by finding its specific class or preceding html to be safe.
            # It looks like: href="../../#"
            # Or in depth=0: href="./#"
            
            # Just directly target the style + YIGE WANG
            # Before: <a class="bigtitle" style="..." href="../../#">YIGE WANG</a>
            # After: <a class="bigtitle" style="..." href="../../index.html">YIGE WANG</a>
            
            pattern = r'(href=")(\.\./)*(\.\/)?(#)?(">[^Y]*YIGE WANG</a>)'
            repl = fr'\g<1>{home_link}\g<5>'
            
            new_content = re.sub(pattern, repl, new_content)

            # Also fix the actual logo image link
            # Before: <a itemprop="url" href="../../" style="height: 38px;">
            pattern_logo = r'(href=")(\.\./)*(\.\/)?(#)?("\s*style="height: 38px(;)?"?>\s*<img itemprop="image")'
            repl_logo = fr'\g<1>{home_link}\g<5>'
            new_content = re.sub(pattern_logo, repl_logo, new_content)

            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as file:
                    file.write(new_content)
                print(f"Updated index links: {filepath}")

print("Done fixing index links.")
