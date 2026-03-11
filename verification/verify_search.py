import os
from playwright.sync_api import sync_playwright

def verify_clear_search():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Use mobile viewport since hamburger is mobile-only, or just desktop for search shortcut
        page = browser.new_page()

        # Navigate to index.html using file:// URI
        filepath = os.path.abspath("index.html")
        page.goto(f"file://{filepath}")

        # Open search modal (Cmd/Ctrl+K or click button)
        search_btn = page.locator('.nav-search')
        search_btn.click()

        # Wait for modal to be visible
        page.wait_for_selector('.search-overlay.open', state='visible')

        # Type into search input
        search_input = page.locator('.search-input')
        search_input.fill('Mass')

        # Ensure we trigger the input event properly for vanilla JS listeners
        search_input.press('Space')

        # Wait a tiny bit for transition/render
        page.wait_for_timeout(200)

        # Find the clear button by its aria-label
        clear_btn = page.locator('button[aria-label="Clear search"]')

        # Take screenshot of the modal with text and clear button visible
        page.screenshot(path="/app/verification/search-with-clear.png")

        # Click clear button
        clear_btn.click()

        # Take screenshot of cleared state
        page.screenshot(path="/app/verification/search-cleared.png")

        browser.close()

if __name__ == "__main__":
    verify_clear_search()
