import os
import re

LINK_RE = re.compile(r'href="([^"]+)"')

def get_links(content):
    return (match.group(1) for match in LINK_RE.finditer(content))

def verify_site():
    files = ['index.html', 'today.html', 'beliefs.html', 'sacraments.html', 'prayer.html', 'resources.html', 'history.html', 'structure.html', 'apologetics.html', 'styles/main.css']

    # Check existence
    html_files = []
    for f in files:
        if not os.path.exists(f):
            print(f"MISSING: {f}")
        else:
            print(f"FOUND: {f}")
            if f.endswith('.html'):
                html_files.append(f)

    # Cache for checked links to avoid redundant syscalls
    checked_links = {}

    for f in html_files:
        with open(f, 'r') as file:
            content = file.read()
            links = get_links(content)
            print(f"Checking links in {f}...")
            for link in links:
                if link.startswith('http') or link.startswith('https') or link.startswith('#'):
                    continue

                if link in checked_links:
                    exists = checked_links[link]
                else:
                    exists = os.path.exists(link)
                    checked_links[link] = exists

                if not exists:
                    print(f"  BROKEN LINK: {link}")

    print("Verification complete.")

if __name__ == "__main__":
    verify_site()
