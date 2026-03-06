from playwright.sync_api import sync_playwright

def verify_search_modal():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to home page
        page.goto("file:///app/index.html")

        # Click search button
        search_btn = page.locator(".nav-search")
        search_btn.click()

        # Wait for modal to open
        page.wait_for_selector(".search-overlay.open")

        # Take a screenshot
        page.screenshot(path="verification/verify_search_modal.png")

        # Evaluate attributes
        has_role = page.evaluate("""() => {
            const overlay = document.querySelector('.search-overlay');
            return overlay.getAttribute('role') === 'dialog';
        }""")

        has_aria_modal = page.evaluate("""() => {
            const overlay = document.querySelector('.search-overlay');
            return overlay.getAttribute('aria-modal') === 'true';
        }""")

        print(f"Has role=dialog: {has_role}")
        print(f"Has aria-modal=true: {has_aria_modal}")

        browser.close()

if __name__ == "__main__":
    verify_search_modal()
