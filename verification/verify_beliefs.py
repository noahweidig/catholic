from playwright.sync_api import sync_playwright
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        # To visually verify animations and prefers-reduced-motion media queries using Playwright, create a new browser context with browser.new_context(reduced_motion='reduce') to test accessibility states.
        # However, here we just want to ensure we capture the whole page properly.
        # But wait, memory says: "When visually verifying UI changes using Playwright, note that elements with the CSS .reveal class require the script to scroll down and back up to trigger the animation before taking a screenshot, otherwise the text may be hidden."

        context = browser.new_context(viewport={'width': 1280, 'height': 800})
        page = context.new_page()

        file_path = f"file://{os.path.abspath('beliefs.html')}"
        page.goto(file_path)

        # Scroll down and back up to trigger .reveal elements
        page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        page.wait_for_timeout(500)
        page.evaluate("window.scrollTo(0, 0)")
        page.wait_for_timeout(500)

        page.screenshot(path="verification/beliefs_flow.png", full_page=True)
        browser.close()

if __name__ == "__main__":
    run()
