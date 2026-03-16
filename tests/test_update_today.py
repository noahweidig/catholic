import sys
from unittest.mock import MagicMock, patch, mock_open
import pytest
from datetime import datetime

# Mock the missing dependency before importing the script under test
sys.modules['catholic_mass_readings'] = MagicMock()

from scripts.update_today import format_readings_html, update_today_file

class MockMassObject:
    def __init__(self, title, sections):
        if title is not None:
            self.title = title
        self.sections = sections

    def to_dict(self):
        return {'sections': self.sections}

def test_format_readings_html_none():
    """Test with None input."""
    result = format_readings_html(None)
    assert result == "<p>Unable to load readings.</p>"

def test_format_readings_html_empty_mass():
    """Test with an object that has no title and no sections."""
    mass = MockMassObject(None, [])
    result = format_readings_html(mass)
    assert '<div class="readings-container">' in result
    assert '</div>' in result
    assert '<h2' not in result

def test_format_readings_html_with_title_only():
    """Test with a title but no sections."""
    mass = MockMassObject("Test Title", [])
    result = format_readings_html(mass)
    assert '<h2 class="reading-feast-title">Test Title</h2>' in result

def test_format_readings_html_full_mass():
    """Test with multiple sections, citations, and responses."""
    sections = [
        {
            'header': 'First Reading',
            'readings': [
                {
                    'verses': [{'text': 'Gen 1:1-5'}],
                    'text': 'In the beginning...'
                }
            ]
        },
        {
            'header': 'Responsorial Psalm',
            'readings': [
                {
                    'verses': [{'text': 'Ps 23:1-3'}, {'text': '4'}],
                    'text': 'R. The Lord is my shepherd.'
                },
                {
                    'verses': [],
                    'text': 'He guides me.'
                }
            ]
        },
        {
            'header': '', # Empty header
            'readings': [
                {
                    'text': 'No citation here.'
                }
            ]
        }
    ]
    mass = MockMassObject("Full Mass", sections)
    result = format_readings_html(mass)

    # Check Title
    assert '<h2 class="reading-feast-title">Full Mass</h2>' in result

    # Check Section 1
    assert '<h3 class="reading-header">First Reading</h3>' in result
    assert '<span class="reading-citation">Gen 1:1-5</span>' in result
    assert '<p class="reading-text">In the beginning...</p>' in result

    # Check Section 2 (Psalm)
    assert '<h3 class="reading-header">Responsorial Psalm</h3>' in result
    assert '<span class="reading-citation">Ps 23:1-3, 4</span>' in result
    assert '<span class="response-text">R.</span> The Lord is my shepherd.' in result
    assert 'He guides me.' in result

    # Check Section 3 (Empty header and no citation)
    assert '<h3 class="reading-header"></h3>' not in result # Header should not be present if empty
    assert 'No citation here.' in result

def test_format_readings_html_response_formatting():
    """Test that 'R.' is correctly formatted only at the beginning."""
    sections = [
        {
            'readings': [
                {
                    'text': 'R. This should be formatted. But R. here should not.'
                }
            ]
        }
    ]
    mass = MockMassObject(None, sections)
    result = format_readings_html(mass)
    assert '<span class="response-text">R.</span> This should be formatted. But R. here should not.' in result

def test_format_readings_html_multiple_verses():
    """Test that multiple verses are joined by commas."""
    sections = [
        {
            'readings': [
                {
                    'verses': [{'text': 'John 3:16'}, {'text': '17'}, {'text': '18'}],
                    'text': 'For God so loved the world...'
                }
            ]
        }
    ]
    mass = MockMassObject(None, sections)
    result = format_readings_html(mass)
    assert '<span class="reading-citation">John 3:16, 17, 18</span>' in result


# --- Tests for update_today_file ---

SAMPLE_TODAY_HTML = """
<!DOCTYPE html>
<html>
<head><title>Today</title></head>
<body>
<header class="liturgical-green">
    <div id="liturgical-day">Some Date</div>
</header>
<main id="readings-content">
    Old Content
</main>
</body>
</html>
"""

@patch("scripts.update_today.datetime")
@patch("builtins.open", new_callable=mock_open, read_data=SAMPLE_TODAY_HTML)
def test_update_today_file_success(mock_file, mock_datetime):
    """Test successful update of today.html."""
    mock_datetime.now.return_value = datetime(2026, 3, 10)
    new_html = "<p>New Readings Content</p>"
    update_today_file('today.html', 'purple', new_html)

    handle = mock_file()
    handle.write.assert_called()
    written_content = handle.write.call_args[0][0]

    assert 'class="liturgical-purple"' in written_content
    assert '<main id="readings-content">\n<p>New Readings Content</p>\n</main>' in written_content

    assert '<div id="liturgical-day">March 10, 2026</div>' in written_content

@patch("builtins.open", new_callable=mock_open, read_data="<html><body>No placeholders here</body></html>")
def test_update_today_file_missing_placeholders(mock_file, capsys):
    """Test behavior when placeholders are missing."""
    update_today_file('today.html', 'red', "<p>Content</p>")

    captured = capsys.readouterr()
    assert "Warning: readings placeholder not found or unchanged" in captured.out

    # Should still write what it could (nothing changed in this case)
    handle = mock_file()
    handle.write.assert_called()
    written_content = handle.write.call_args[0][0]
    assert written_content == "<html><body>No placeholders here</body></html>"

@patch("builtins.open", side_effect=IOError("Failed to read file"))
def test_update_today_file_read_error(mock_file, capsys):
    """Test behavior when file reading fails."""
    update_today_file('today.html', 'green', "<p>Content</p>")

    captured = capsys.readouterr()
    assert "Error updating today.html: An unexpected error occurred" in captured.out

@patch("builtins.open", new_callable=mock_open, read_data='<header class="some-class"></header>')
def test_update_today_file_partial_placeholders(mock_file):
    """Test behavior when only some placeholders are present."""
    update_today_file('today.html', 'gold', "<p>Content</p>")

    handle = mock_file()
    written_content = handle.write.call_args[0][0]

    assert 'class="some-class liturgical-gold"' in written_content
    # readings-content and liturgical-day were not present, so they shouldn't be in written_content
    assert '<main id="readings-content">' not in written_content

@patch("builtins.open", new_callable=mock_open, read_data=SAMPLE_TODAY_HTML)
def test_update_today_file_invalid_color(mock_file, capsys):
    """Test that invalid color resets to green in update_today_file."""
    invalid_color = "red; background: url(x);"
    update_today_file('today.html', invalid_color, "<p>Content</p>")

    captured = capsys.readouterr()
    assert f"Warning: Invalid color '{invalid_color}' detected" in captured.out

    handle = mock_file()
    written_content = handle.write.call_args[0][0]
    assert 'class="liturgical-green"' in written_content
