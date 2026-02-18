import asyncio
import json
import subprocess
import re
from datetime import datetime
from catholic_mass_readings import USCCB

# Compiled Regex Patterns
HEADER_REGEX = re.compile(r'(<header[^>]*class=["\'])(.*?)(["\'][^>]*>)')
DAY_REGEX = re.compile(r'(<div id="liturgical-day">)(.*?)(</div>)')
MAIN_REGEX = re.compile(r'(<main id="readings-content">)(.*?)(</main>)', re.DOTALL)

async def get_liturgical_info():
    try:
        process = subprocess.run(
            ['node', 'scripts/get_liturgical_info.js'],
            capture_output=True,
            text=True,
            check=True
        )
        return json.loads(process.stdout)
    except subprocess.CalledProcessError as e:
        print(f"Error running node script: {e}")
        print(e.stderr)
        return None

async def get_readings():
    try:
        return await USCCB().get_today_mass()
    except Exception as e:
        print(f"Error fetching readings: {e}")
        return None

def format_readings_html(mass_object):
    if not mass_object:
        return "<p>Unable to load readings.</p>"

    html_parts = ['<div class="readings-container">']

    # Title/Feast Name
    if hasattr(mass_object, 'title') and mass_object.title:
         html_parts.append(f'<h2 style="text-align: center; justify-content: center; margin-bottom: 2rem;">{mass_object.title}</h2>')

    data = mass_object.to_dict()
    sections = data.get('sections', [])

    for section in sections:
        html_parts.append('<div class="reading-section">')
        header = section.get('header', '')
        if header:
            html_parts.append(f'    <h3 class="reading-header">{header}</h3>')

        readings = section.get('readings', [])
        for reading in readings:
            # Verses citation
            verses_list = reading.get('verses', [])
            citation = ""
            if verses_list:
                citation = ", ".join([v.get('text', '') for v in verses_list])

            if citation:
                html_parts.append(f'    <span class="reading-citation">{citation}</span>')

            text = reading.get('text', '')

            # Simple formatting for responses
            if text.strip().startswith('R.'):
                text = text.replace('R.', '<span class="response-text">R.</span>', 1)

            html_parts.append(f'    <p class="reading-text">{text}</p>')

        html_parts.append('</div>')

    html_parts.append('</div>')
    return "\n".join(html_parts)

def update_file_header(filepath, color, feast_name, is_index=False):
    """Updates only the header and liturgical day in a file (e.g., index.html)."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # Update header class
        def header_class_replacement(match):
            prefix = match.group(1)
            existing_classes = match.group(2).split()
            suffix = match.group(3)

            new_classes = [c for c in existing_classes if not c.startswith('liturgical-')]
            new_classes.append(f'liturgical-{color}')

            return f'{prefix}{" ".join(new_classes)}{suffix}'

        content = HEADER_REGEX.sub(header_class_replacement, content)

        # Update #liturgical-day content
        date_str = datetime.now().strftime("%B %d, %Y")

        if is_index:
            new_content = f'<a href="today.html">{feast_name}</a>'
        else:
            new_content = date_str

        def day_replacement(match):
            return f'{match.group(1)}{new_content}{match.group(3)}'

        content = DAY_REGEX.sub(day_replacement, content)

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

        print(f"Updated header in {filepath}")
    except Exception as e:
        print(f"Error updating header in {filepath}: {e}")

def update_today_file(filepath, color, html_content):
    """Updates today.html efficiently in one pass."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # Update header class
        def header_class_replacement(match):
            prefix = match.group(1)
            existing_classes = match.group(2).split()
            suffix = match.group(3)

            new_classes = [c for c in existing_classes if not c.startswith('liturgical-')]
            new_classes.append(f'liturgical-{color}')

            return f'{prefix}{" ".join(new_classes)}{suffix}'

        content = HEADER_REGEX.sub(header_class_replacement, content)

        # Update #liturgical-day content (Just the date for today.html)
        date_str = datetime.now().strftime("%B %d, %Y")

        def day_replacement(match):
            return f'{match.group(1)}{date_str}{match.group(3)}'

        content = DAY_REGEX.sub(day_replacement, content)

        # Update readings content
        def main_replacement(match):
            return f'{match.group(1)}\n{html_content}\n{match.group(3)}'

        # Use sub to replace the main content
        new_content = MAIN_REGEX.sub(main_replacement, content)

        if new_content == content:
             print(f"Warning: readings placeholder not found or unchanged in {filepath}")
        else:
             content = new_content

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

        print(f"Updated {filepath} (Header + Readings)")
    except Exception as e:
        print(f"Error updating {filepath}: {e}")


async def main():
    print("Fetching liturgical info...")
    liturgical_info = await get_liturgical_info()

    color = 'green'
    romcal_name = ''

    if liturgical_info:
        color = liturgical_info.get('color', 'green')
        romcal_name = liturgical_info.get('name', '')
    else:
        print("Failed to get liturgical info, using defaults.")

    print("Fetching readings...")
    readings = await get_readings()

    readings_html = format_readings_html(readings)

    # Determine the name to display in the header
    if readings and hasattr(readings, 'title') and readings.title:
        display_name = readings.title
    else:
        display_name = romcal_name

    print(f"Updating files... Color: {color}, Name: {display_name}")

    # Update today.html (Single pass efficiency)
    update_today_file('today.html', color, readings_html)

    # Update index.html (Only header needs update)
    update_file_header('index.html', color, display_name, is_index=True)

    print("Done.")

if __name__ == "__main__":
    asyncio.run(main())
