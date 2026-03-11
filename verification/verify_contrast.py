from playwright.sync_api import sync_playwright, expect
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        context = browser.new_context(viewport={"width": 1280, "height": 800})
        page = context.new_page()

        # Navigate to the local file
        filepath = f"file://{os.path.abspath('index.html')}"
        page.goto(filepath)

        # Open search modal by clicking the icon
        page.locator('.nav-search').click()

        # Wait for modal to be visible
        modal = page.locator('.search-overlay')
        expect(modal).to_be_visible()

        # Type gibberish to trigger empty state
        input_field = page.locator('.search-input')
        input_field.fill("xxxxyz")

        # Wait for empty state
        empty_state = page.locator('.search-empty')
        expect(empty_state).to_be_visible()

        # Take a screenshot showing the enhanced contrast
        page.screenshot(path="verification/contrast_verification.png")

        browser.close()

if __name__ == "__main__":
    run()
