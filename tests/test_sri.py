import glob
import re
import pytest

def test_font_awesome_sri():
    """
    Verify that all Font Awesome CDN links have the correct SRI integrity attribute.
    """
    files = glob.glob('*.html')

    # Check that we found some files
    assert len(files) > 0, "No HTML files found to check."

    fa_pattern = re.compile(r'<link[^>]*href="[^"]*font-awesome[^"]*"[^>]*>')

    # Expected SRI hash
    expected_integrity = 'integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="'

    for file_path in files:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        matches = fa_pattern.findall(content)

        for match in matches:
            if expected_integrity not in match:
                pytest.fail(f"Missing or incorrect SRI integrity in {file_path}.\nFound: {match}\nExpected to contain: {expected_integrity}")

if __name__ == "__main__":
    pytest.main([__file__])
