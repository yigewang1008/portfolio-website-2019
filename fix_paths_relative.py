import os
import re

directory = '.'

# Base paths we want to make relative (which I recently prefixed with /portfolio-website-2019/)
search_prefixes = [
    r'/portfolio-website-2019/wp-content/',
    r'/portfolio-website-2019/wp-includes/',
    r'/portfolio-website-2019/portfolio-item/',
    r'/portfolio-website-2019/portfolio-category/',
    r'/portfolio-website-2019/portfolio-tag/'
]

# We need a different prefix string depending on if it's href or src
# Examples of what we're looking for: href="/portfolio-website-2019/wp-content/..."
# We also have some raw paths like href="/portfolio-website-2019/" representing Home.

for root, _, files in os.walk(directory):
    for filename in files:
        if filename.endswith('.html'):
            filepath = os.path.join(root, filename)
            
            # Calculate depth from root. 
            # If root is '.', depth is 0
            # If root is './portfolio-item/91days', depth is 2
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
            
            # 1. Replace all matched asset prefixes
            for prefix in search_prefixes:
                # Need to capture the trailing part of the path
                # e.g. prefix = /portfolio-website-2019/wp-content/
                # pattern looks for href="/portfolio-website-2019/wp-content/(whatever)"
                
                # Strip the leading slash from the prefix so we can construct the relative path properly
                # For example, if we match href="/portfolio-website-2019/wp-content/(.*)"
                # We want to replace it with href="{relative_prefix}wp-content/\1"
                
                # Isolate the core folder name we want to keep (e.g., wp-content)
                target_folder = prefix.replace('/portfolio-website-2019/', '')
                
                pattern_href = fr'href="{prefix}([^"]*)""'
                # Actually, capturing regex is cleaner:
                pattern_href2 = r'href="' + prefix + r'([^"]*)"'
                repl_href = f'href="{relative_prefix}{target_folder}\\1"'
                new_content = re.sub(pattern_href2, repl_href, new_content)
                
                pattern_src = r'src="' + prefix + r'([^"]*)"'
                repl_src = f'src="{relative_prefix}{target_folder}\\1"'
                new_content = re.sub(pattern_src, repl_src, new_content)

            # 2. Replace the home page link href="/portfolio-website-2019/" -> href="./" or href="../../"
            pattern_home_href = r'href="/portfolio-website-2019/"'
            repl_home_href = f'href="{relative_prefix}"'
            new_content = re.sub(pattern_home_href, repl_home_href, new_content)
            
            # 3. Handle query params like href="/portfolio-website-2019/?p=2951" -> href="./?p=2951"
            pattern_query = r'href="/portfolio-website-2019/(\?p=[^"]*)"'
            repl_query = f'href="{relative_prefix}\\1"'
            new_content = re.sub(pattern_query, repl_query, new_content)
            
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as file:
                    file.write(new_content)
                print(f"Updated: {filepath}")

print("Done computing relative paths.")
