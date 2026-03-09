import os
from playwright.sync_api import sync_playwright

def test_hamburger_title(page):
    # Get absolute path to index.html
    current_dir = os.path.abspath(os.path.dirname(__file__))
    project_root = os.path.dirname(current_dir)
    file_url = f"file://{project_root}/index.html"

    # Use a mobile viewport to make the hamburger menu visible
    page.set_viewport_size({"width": 375, "height": 812})
    page.goto(file_url)

    # Check for title attribute
    hamburger = page.locator(".hamburger")
    title_attr = hamburger.get_attribute("title")
    print(f"Title attribute on hamburger: {title_attr}")

    # Hover over the hamburger to trigger the tooltip (title)
    hamburger.hover()

    # Take screenshot for visual verification
    page.screenshot(path=f"{current_dir}/hamburger_verification_mobile.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_hamburger_title(page)
        finally:
            browser.close()
