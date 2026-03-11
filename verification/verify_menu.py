from playwright.sync_api import sync_playwright

def verify_menu_focus(page):
    # Navigate to local file
    page.goto("file:///app/index.html")

    # 1. Open the "Faith" menu by clicking it
    faith_menu_trigger = page.locator("button.menu-trigger").filter(has_text="Faith")
    faith_menu_trigger.click()

    # Verify it's open
    assert faith_menu_trigger.evaluate("el => el.getAttribute('aria-expanded')") == "true"

    # 2. Focus an element outside the menu to trigger the focusin event
    # We'll focus the "Home" link which is outside the dropdown
    home_link = page.locator("a.active").filter(has_text="Home").first
    home_link.focus()

    # Verify it closed
    assert faith_menu_trigger.evaluate("el => el.getAttribute('aria-expanded')") == "false"

    # Take a screenshot to show it's closed
    page.screenshot(path="/app/verification/menu_closed_on_focusout.png")
    print("Verification successful!")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_menu_focus(page)
        finally:
            browser.close()
