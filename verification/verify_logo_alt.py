from playwright.sync_api import sync_playwright

def verify_logo_alt():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to home page
        page.goto("file:///app/index.html")

        # Wait for the brand logo to be in the DOM
        page.wait_for_selector(".brand-logo")

        # Check attributes
        alt_text = page.evaluate("""() => document.querySelector('.brand-logo').getAttribute('alt')""")
        aria_hidden = page.evaluate("""() => document.querySelector('.brand-logo').getAttribute('aria-hidden')""")
        link_aria_label = page.evaluate("""() => document.querySelector('.brand-link').getAttribute('aria-label')""")

        print(f"Alt text: '{alt_text}'")
        print(f"Aria-hidden: {aria_hidden}")
        print(f"Link aria-label: '{link_aria_label}'")

        # Take a screenshot
        page.screenshot(path="verification/verify_logo_alt.png")

        browser.close()

if __name__ == "__main__":
    verify_logo_alt()
