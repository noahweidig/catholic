import os
import re

def get_links(content):
    return (match.group(1) for match in re.finditer(r'href="([^"]+)"', content))

def verify_site():
    files = ['index.html', 'beliefs.html', 'sacraments.html', 'prayer.html', 'resources.html', 'history.html', 'structure.html', 'apologetics.html', 'styles/main.css']

    # Check existence
    for f in files:
        if not os.path.exists(f):
            print(f"MISSING: {f}")
        else:
            print(f"FOUND: {f}")

    html_files = [f for f in files if f.endswith('.html')]

    # Cache for checked links to avoid redundant syscalls
    checked_links = {}

    for f in html_files:
        with open(f, 'r') as file:
            content = file.read()
            links = get_links(content)
            print(f"Checking links in {f}...")
            for link in links:
                if link.startswith('http') or link.startswith('https'):
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
