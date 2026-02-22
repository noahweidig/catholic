import sys
from unittest.mock import MagicMock, patch, mock_open
import pytest

# Mock dependencies
sys.modules['catholic_mass_readings'] = MagicMock()
from scripts.update_today import update_file_header, update_today_file

# Sample HTML content
SAMPLE_HTML = """
<!DOCTYPE html>
<html lang="en">
<head>
</head>
<body>
<header class="liturgical-green">
    <div id="liturgical-day">Monday</div>
</header>
<main id="readings-content">
    Old Content
</main>
</body>
</html>
"""

@patch("builtins.open", new_callable=mock_open, read_data=SAMPLE_HTML)
def test_update_file_header_xss_prevention(mock_file):
    """Test that malicious color injection is prevented in update_file_header."""
    malicious_color = 'green"><script>alert(1)</script><div class="'

    update_file_header('index.html', malicious_color, 'Feast Name')

    # Verify file was written
    handle = mock_file()
    handle.write.assert_called()

    # Get the written content
    args, _ = handle.write.call_args
    written_content = args[0]

    # Assert that the malicious payload is NOT present as class
    assert 'liturgical-green"><script>' not in written_content
    # Assert that it fell back to green
    assert 'liturgical-green' in written_content
    # Assert structure integrity
    assert '<header class="liturgical-green">' in written_content

@patch("builtins.open", new_callable=mock_open, read_data=SAMPLE_HTML)
def test_update_today_file_xss_prevention(mock_file):
    """Test that malicious color injection is prevented in update_today_file."""
    malicious_color = 'red" onmouseover="alert(1)'

    update_today_file('today.html', malicious_color, '<p>New Readings</p>')

    handle = mock_file()
    handle.write.assert_called()

    args, _ = handle.write.call_args
    written_content = args[0]

    # Assert fallback to green
    assert 'liturgical-green' in written_content
    assert 'liturgical-red' not in written_content
    assert 'onmouseover' not in written_content

@patch("builtins.open", new_callable=mock_open, read_data=SAMPLE_HTML)
def test_valid_color(mock_file):
    """Test that a valid color is accepted."""
    valid_color = 'dark-violet'

    update_file_header('index.html', valid_color, 'Feast Name')

    handle = mock_file()
    args, _ = handle.write.call_args
    written_content = args[0]

    assert 'liturgical-dark-violet' in written_content
