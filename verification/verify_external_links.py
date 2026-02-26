from playwright.sync_api import sync_playwright, expect
import os

def verify_external_links():
    cwd = os.getcwd()
    beliefs_path = f"file://{cwd}/beliefs.html"
    resources_path = f"file://{cwd}/resources.html"

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        # Test 1: Beliefs Page (Should have new icons and text)
        page = browser.new_page()
        page.goto(beliefs_path)

        # Wait for script to run
        page.wait_for_timeout(500)

        links = page.locator('a[target="_blank"]')
        count = links.count()
        print(f"Found {count} external links on beliefs.html")

        if count == 0:
            print("WARNING: No external links found on beliefs.html to verify.")

        for i in range(count):
            link = links.nth(i)
            # Check for icon
            icon = link.locator('.fa-arrow-up-right-from-square')
            expect(icon).to_be_visible()
            # Check for aria-hidden on icon
            aria_hidden = icon.get_attribute('aria-hidden')
            assert aria_hidden == 'true', f"Icon {i} missing aria-hidden=true"

            # Check for sr-only text
            sr_text = link.locator('.sr-only')
            # Use inner_text or text_content
            # text_content includes hidden text
            text = sr_text.text_content() or ""
            assert "(opens in a new tab)" in text, f"Link {i} missing sr-only text. Found: '{text}'"

        # Screenshot
        page.screenshot(path="verification/beliefs_links.png")
        print("Verified beliefs.html and took screenshot.")

        # Test 2: Resources Page (Should verify existing icons and add text)
        page = browser.new_page()
        page.goto(resources_path)
        page.wait_for_timeout(500)

        links = page.locator('a[target="_blank"]')
        count = links.count()
        print(f"Found {count} external links on resources.html")

        for i in range(count):
            link = links.nth(i)
            # Check for icon (should be only one)
            icons = link.locator('.fa-arrow-up-right-from-square')
            if icons.count() > 1:
                print(f"ERROR: Link {i} has duplicate icons!")
            assert icons.count() == 1, f"Link {i} should have exactly 1 icon, found {icons.count()}"

            # Check for aria-hidden on icon
            icon = icons.first
            aria_hidden = icon.get_attribute('aria-hidden')
            assert aria_hidden == 'true', f"Icon {i} missing aria-hidden=true"

            # Check for sr-only text
            sr_text = link.locator('.sr-only')
            text = sr_text.text_content() or ""
            assert "(opens in a new tab)" in text, f"Link {i} missing sr-only text. Found: '{text}'"

        print("Verified resources.html.")
        browser.close()

if __name__ == "__main__":
    verify_external_links()
