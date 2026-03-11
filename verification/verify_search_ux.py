from playwright.sync_api import sync_playwright, expect
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        # Test desktop resolution first to ensure the ESC button appears cleanly
        context = browser.new_context(viewport={"width": 1280, "height": 800})
        page = context.new_page()

        # Navigate to the local file
        filepath = f"file://{os.path.abspath('index.html')}"
        page.goto(filepath)

        # Open search modal by clicking the icon (more reliable in headless than keyboard shortcut)
        page.locator('.nav-search').click()

        # Wait for modal to be visible
        modal = page.locator('.search-overlay')
        expect(modal).to_be_visible()

        # Type something to show the clear button
        input_field = page.locator('.search-input')
        input_field.fill("Mary")

        # Wait for the clear button to be visible
        clear_btn = page.locator('.search-input-wrap .icon-btn')
        expect(clear_btn).to_be_visible()

        # Hover over the new ESC button to show the hover state
        esc_btn = page.locator('.search-kbd')
        esc_btn.hover()

        # Take a screenshot showing the interactive ESC button and the clear button
        page.screenshot(path="verification/search_modal_ux.png")

        browser.close()

if __name__ == "__main__":
    run()
