from playwright.sync_api import sync_playwright

def verify_readonly_select():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to resources page
        page.goto("file:///app/resources.html")

        # Focus/click the first readonly input
        input_locator = page.locator("#calendar-url")
        input_locator.click()

        # Wait a tiny bit for the select to happen
        page.wait_for_timeout(500)

        # Take a screenshot
        page.screenshot(path="verification/verify_readonly_select.png")

        # Evaluate if text is selected
        is_selected = page.evaluate("""() => {
            const input = document.getElementById('calendar-url');
            return input.selectionStart === 0 && input.selectionEnd === input.value.length && input.value.length > 0;
        }""")

        print(f"Text is selected: {is_selected}")

        browser.close()

if __name__ == "__main__":
    verify_readonly_select()
