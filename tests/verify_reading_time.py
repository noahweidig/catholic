from playwright.sync_api import sync_playwright
import os
import re

def verify_reading_time():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Load beliefs.html
        filepath = os.path.abspath("beliefs.html")
        page.goto(f"file://{filepath}")

        # Check for reading time element
        try:
            reading_time_element = page.wait_for_selector(".reading-time", timeout=5000)
            if reading_time_element:
                text = reading_time_element.inner_text()
                match = re.search(r"(\d+) min read", text)
                if match:
                    minutes = int(match.group(1))
                    print(f"PASS: Reading time found on beliefs.html: {minutes} min read")
                else:
                    print(f"FAIL: Reading time text format incorrect on beliefs.html: {text}")
            else:
                print("FAIL: Reading time element not found on beliefs.html")
        except Exception as e:
            print(f"FAIL: Error waiting for reading time on beliefs.html: {e}")

        # Load index.html
        filepath = os.path.abspath("index.html")
        page.goto(f"file://{filepath}")

        # Check that reading time element is NOT present
        try:
            reading_time_element = page.query_selector(".reading-time")
            if reading_time_element:
                print("FAIL: Reading time element unexpectedly found on index.html")
            else:
                print("PASS: Reading time element correctly absent on index.html")
        except Exception as e:
            print(f"FAIL: Error checking index.html: {e}")

        browser.close()

if __name__ == "__main__":
    verify_reading_time()
