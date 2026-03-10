from playwright.sync_api import sync_playwright

def verify_beliefs_order(page):
    # Navigate to the local beliefs.html file
    page.goto(f"file:///app/beliefs.html")

    # Wait for the main content to be visible
    page.wait_for_selector("#main-content")

    # Scroll down to ensure both Original Sin and Jesus Christ sections are visible
    # We evaluate script to scroll to the Original Sin section
    page.evaluate("() => { const el = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('Original Sin')); if(el) el.scrollIntoView({block: 'center'}); }")

    # Give it a moment to render
    page.wait_for_timeout(1000)

    # Take a screenshot
    page.screenshot(path="verification/beliefs_order.png", full_page=True)

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_beliefs_order(page)
        finally:
            browser.close()
