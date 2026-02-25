import glob
import re
import pytest

def test_referrer_policy_meta_tag():
    """
    Verify that all HTML files have the correct Referrer-Policy meta tag.
    This ensures we don't leak full paths to external sites.
    """
    files = glob.glob('*.html')

    # Check that we found some files
    assert len(files) > 0, "No HTML files found to check."

    meta_pattern = re.compile(r'<meta\s+name=["\']referrer["\']\s+content=["\']strict-origin-when-cross-origin["\']\s*/?>')

    for file_path in files:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        match = meta_pattern.search(content)

        if not match:
            pytest.fail(f"Missing Referrer-Policy meta tag in {file_path}.\nExpected: <meta name=\"referrer\" content=\"strict-origin-when-cross-origin\">")

if __name__ == "__main__":
    pytest.main([__file__])
