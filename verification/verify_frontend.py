from playwright.sync_api import sync_playwright
import os

def verify_frontend_changes():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Load beliefs.html
        filepath = os.path.abspath("beliefs.html")
        page.goto(f"file://{filepath}")

        # Wait for reading time to appear (animation takes ~1s)
        page.wait_for_selector(".reading-time", state="visible")
        page.wait_for_timeout(1000) # Wait for fade-in animation

        # Take screenshot of the banner area
        banner = page.locator(".page-banner")
        banner.screenshot(path="verification/beliefs_banner.png")

        print("Screenshot saved to verification/beliefs_banner.png")
        browser.close()

if __name__ == "__main__":
    verify_frontend_changes()
