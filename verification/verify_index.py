from playwright.sync_api import sync_playwright
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        file_path = f"file://{os.path.abspath('index.html')}"
        page.goto(file_path, wait_until="networkidle")

        # Scroll down to trigger reveal animations
        page.evaluate("window.scrollBy(0, document.body.scrollHeight)")
        page.wait_for_timeout(1000)
        page.evaluate("window.scrollTo(0, 0)")
        page.wait_for_timeout(500)

        # Take a screenshot of the hero section
        page.screenshot(path="verification/index_hero_ready.png", full_page=True)

        browser.close()

if __name__ == "__main__":
    run()
