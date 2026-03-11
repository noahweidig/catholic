from playwright.sync_api import sync_playwright

def verify_beliefs_order(page):
    # Navigate to the local beliefs.html file
    page.goto("file:///app/beliefs.html")

    # Scroll down to ensure elements are visible and reveal animations trigger
    page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
    page.wait_for_timeout(1000) # Wait for reveal animations to finish

    # Scroll to The Four Last Things heading
    four_last_things = page.locator("h2:has-text('The Four Last Things')")
    four_last_things.scroll_into_view_if_needed()

    # Wait a moment for any potential sticky headers or scrolling to settle
    page.wait_for_timeout(500)

    # Take a screenshot showing the order
    page.screenshot(path="/app/verification/beliefs_order.png", full_page=True)

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_beliefs_order(page)
        finally:
            browser.close()
