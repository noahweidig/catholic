import os
import re

files = ['index.html', 'beliefs.html', 'sacraments.html', 'prayer.html', 'resources.html', 'styles/main.css']

# Check existence
for f in files:
    if not os.path.exists(f):
        print(f"MISSING: {f}")
    else:
        print(f"FOUND: {f}")

# Check links
def get_links(content):
    return (match.group(1) for match in re.finditer(r'href="([^"]+)"', content))

html_files = [f for f in files if f.endswith('.html')]

for f in html_files:
    with open(f, 'r') as file:
        content = file.read()
        links = get_links(content)
        print(f"Checking links in {f}...")
        for link in links:
            if link.startswith('http') or link.startswith('https'):
                continue
            if link.startswith('styles/'): # CSS link
                if not os.path.exists(link):
                     print(f"  BROKEN LINK: {link}")
            elif not os.path.exists(link):
                print(f"  BROKEN LINK: {link}")

print("Verification complete.")
