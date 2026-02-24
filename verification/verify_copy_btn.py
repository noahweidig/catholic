import os
from playwright.sync_api import sync_playwright

def verify_copy_btn():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Get absolute path to resources.html
        cwd = os.getcwd()
        url = f"file://{cwd}/resources.html"

        print(f"Loading {url}")
        page.goto(url)

        # Locate the first copy button
        # It's inside .calendar-subscription
        btn = page.locator(".calendar-subscription .copy-btn").first

        # Screenshot before click
        print("Taking screenshot before click...")
        btn.scroll_into_view_if_needed()
        page.screenshot(path="verification/1_before_click.png")

        # Click the button
        print("Clicking button...")
        btn.click()

        # Wait a bit for the animation/transition (e.g. 200ms)
        page.wait_for_timeout(200)

        # Screenshot after click (expect "Copied!" and green)
        print("Taking screenshot after click...")
        page.screenshot(path="verification/2_after_click.png")

        # Wait for 2.2 seconds (timeout is 2000ms)
        print("Waiting for revert...")
        page.wait_for_timeout(2200)

        # Screenshot after revert
        print("Taking screenshot after revert...")
        page.screenshot(path="verification/3_after_revert.png")

        browser.close()

if __name__ == "__main__":
    verify_copy_btn()
