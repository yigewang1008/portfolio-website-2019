import os
import re

directory = '.'

updates = [
    (r'(?<=href=")/(wp-content/[^"]*)', r'/portfolio-website-2019/\1'),
    (r'(?<=src=")/(wp-content/[^"]*)', r'/portfolio-website-2019/\1'),
    (r'(?<=href=")/(wp-includes/[^"]*)', r'/portfolio-website-2019/\1'),
    (r'(?<=src=")/(wp-includes/[^"]*)', r'/portfolio-website-2019/\1'),
    (r'(?<=href=")/(portfolio-item/[^"]*)', r'/portfolio-website-2019/\1'),
    (r'(?<=href=")/(portfolio-category/[^"]*)', r'/portfolio-website-2019/\1'),
    (r'(?<=href=")/(portfolio-tag/[^"]*)', r'/portfolio-website-2019/\1'),
    (r'href="/"', r'href="/portfolio-website-2019/"'),
    (r'(?<=href=")/(\?p=[^"]*)', r'/portfolio-website-2019/\1')
]

for root, _, files in os.walk(directory):
    for filename in files:
        if filename.endswith('.html'):
            filepath = os.path.join(root, filename)
            with open(filepath, 'r', encoding='utf-8') as file:
                content = file.read()
            
            new_content = content
            for pattern, repl in updates:
                new_content = re.sub(pattern, repl, new_content)
                
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as file:
                    file.write(new_content)
                print(f"Updated: {filepath}")

print("Done.")
