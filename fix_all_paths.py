import os
import re

directory = '.'

# We are searching for ANY absolute path to these core folders
# This includes occurrences in src="", href="", srcset="... /wp-content", url("/wp-content"), content="/wp-content", etc.
search_folders = [
    'wp-content',
    'wp-includes',
    'portfolio-item',
    'portfolio-category',
    'portfolio-tag'
]

# Supported file types
valid_extensions = ('.html', '.css', '.js')

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
            
            # Replace absolute paths to the core folders anywhere they appear
            for folder in search_folders:
                # We want to match `"/folder/` and `'folder/` and `(/folder/` and `, /folder/`
                # Basically any boundary character followed by `/folder/`
                
                # We can use a regex that looks for:
                # (['"(\s,]|url\()   <- the preceding boundary (quote, parens, space, comma, or `url(`)
                # (/portfolio-website-2019/|/) <- the absolute slash, or the old portfolio prefix if it got stuck somewhere
                # (folder/)          <- the folder name
                
                # Group 1: The preceding character
                # Group 2: The absolute slash stuff
                # Group 3: The folder and everything after it
                
                pattern = r'([\'"(\s,]|^)(/portfolio-website-2019/|/)(' + folder + r'/)'
                
                # Replace with Group 1 + relative_prefix + Group 3
                # e.g. `"/wp-content/` -> `"` + `../../` + `wp-content/`
                repl = fr'\g<1>{relative_prefix}\g<3>'
                
                new_content = re.sub(pattern, repl, new_content)

            # Special cases: absolute links to root `/` -> relative path to root (`./` or `../../`)
            # E.g. href="/" or href="/portfolio-website-2019/"
            pattern_root = r'(href=[\'"])(/portfolio-website-2019/|/)([\'"])'
            repl_root = fr'\g<1>{relative_prefix}\g<3>'
            new_content = re.sub(pattern_root, repl_root, new_content)
            
            # Query param links to root e.g. href="/?p=123"
            pattern_query = r'(href=[\'"])(/portfolio-website-2019/|/)(\?p=[^"\'\s]*)([\'"])'
            repl_query = fr'\g<1>{relative_prefix}\g<3>\g<4>'
            new_content = re.sub(pattern_query, repl_query, new_content)
            
            # CSS filter URLs e.g. url("/wp-content/plugins/eltd-core/assets/css/img/desaturate.svg#grayscale")
            pattern_css_url = r'(url\([\'"]?)(/portfolio-website-2019/|/)(' + '|'.join(search_folders) + r'/)'
            repl_css_url = fr'\g<1>{relative_prefix}\g<3>'
            new_content = re.sub(pattern_css_url, repl_css_url, new_content)

            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as file:
                    file.write(new_content)
                print(f"Updated: {filepath}")

print("Done computing deep relative paths for srcset, css urls, etc.")
