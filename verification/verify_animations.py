from playwright.sync_api import sync_playwright

def test_cta_animations():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Test default context (animations enabled)
        context_default = browser.new_context()
        page_default = context_default.new_page()
        page_default.goto("file:///app/index.html")
        page_default.wait_for_timeout(2000) # Wait for initial animations to finish

        # Take a screenshot
        page_default.screenshot(path="/app/verification/hero_cta_default.png")

        # Test reduced motion context
        context_reduced = browser.new_context(reduced_motion='reduce')
        page_reduced = context_reduced.new_page()
        page_reduced.goto("file:///app/index.html")
        page_reduced.wait_for_timeout(2000)

        # Take a screenshot
        page_reduced.screenshot(path="/app/verification/hero_cta_reduced.png")

        browser.close()

if __name__ == "__main__":
    test_cta_animations()
