import sys
from unittest.mock import MagicMock
import pytest

# Mock the missing dependency before importing the script under test
sys.modules['catholic_mass_readings'] = MagicMock()

from scripts.update_today import format_readings_html

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
