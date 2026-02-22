import os
import time
from playwright.sync_api import sync_playwright

def verify_scroll():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={'width': 1280, 'height': 800})

        filepath = os.path.abspath("index.html")
        page.goto(f"file://{filepath}")

        # Check initial state
        header = page.locator("header")
        print("Initial classes:", header.get_attribute("class"))

        # Scroll down
        print("Scrolling down to 200px...")
        page.evaluate("window.scrollTo(0, 200)")

        # Wait for smooth scroll to finish (approx 500ms?)
        page.wait_for_timeout(600)

        # Check if scrolled class added
        classes_scrolled = header.get_attribute("class")
        print("Classes after scroll down:", classes_scrolled)

        if "scrolled" not in (classes_scrolled or ""):
            print("Error: Header did not get .scrolled class!")
        else:
            print("Success: Header got .scrolled class.")

        page.screenshot(path="verification/scrolled_down.png")

        # Scroll up immediately
        print("Scrolling up to 0px...")
        page.evaluate("window.scrollTo(0, 0)")

        # Wait for smooth scroll to finish
        page.wait_for_timeout(600)

        # Check if scrolled class removed
        classes_top = header.get_attribute("class")
        print("Classes after scroll up:", classes_top)

        if "scrolled" in (classes_top or ""):
            print("Error: Header still has .scrolled class!")
        else:
            print("Success: Header removed .scrolled class immediately.")

        page.screenshot(path="verification/scrolled_up.png")

        browser.close()

if __name__ == "__main__":
    verify_scroll()
