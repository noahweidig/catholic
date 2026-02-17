const fs = require('fs');
const path = require('path');
const romcal = require('romcal');

const INDEX_PATH = path.join(__dirname, '../index.html');

async function updateLiturgicalDay() {
    try {
        console.log('Generating liturgical calendar...');
        const date = new Date();
        const year = date.getFullYear();

        // Use 'unitedStates' or 'general'
        // Using 'unitedStates' for English naming conventions
        const calendar = await romcal.calendarFor({
            year: year,
            country: 'unitedStates',
            locale: 'en'
        });

        const todayString = date.toISOString().split('T')[0];
        console.log(`Looking for date: ${todayString}`);

        // Find today's entry
        const todayEntries = calendar.filter(d => d.moment.startsWith(todayString));

        if (todayEntries.length === 0) {
            console.error('No liturgical entry found for today.');
            return;
        }

        const todayEntry = todayEntries[0];
        const dayName = todayEntry.name;

        // Safely access color key
        let colorKey = 'green';
        if (todayEntry.data && todayEntry.data.meta && todayEntry.data.meta.liturgicalColor) {
            colorKey = todayEntry.data.meta.liturgicalColor.key.toLowerCase();
        }

        console.log(`Today is: ${dayName} (${colorKey})`);

        // Read index.html
        let html = fs.readFileSync(INDEX_PATH, 'utf8');

        // Update #liturgical-day content
        // This regex looks for the div and replaces its content
        // We use a non-greedy match for content
        const dayDivRegex = /<div id="liturgical-day">.*?<\/div>/s;

        if (dayDivRegex.test(html)) {
            html = html.replace(dayDivRegex, `<div id="liturgical-day">${dayName}</div>`);
        } else {
            console.warn('Warning: <div id="liturgical-day"> not found in index.html');
            // Try to insert it if missing (fallback)
            const headerStartRegex = /<header([^>]*)>/;
            if (headerStartRegex.test(html)) {
                html = html.replace(headerStartRegex, (match) => `${match}\n    <div id="liturgical-day">${dayName}</div>`);
            }
        }

        // Update header class
        // Find <header ... > tag
        const headerTagRegex = /<header([^>]*)>/;

        html = html.replace(headerTagRegex, (match, attrs) => {
            const newClass = `liturgical-${colorKey}`;

            // Check if class attribute exists
            if (/class=["']/.test(attrs)) {
                // Replace content of class attribute
                return match.replace(/class=(["'])(.*?)\1/, (m, quote, classContent) => {
                    let classes = classContent.split(/\s+/).filter(c => c.length > 0);
                    // Remove existing liturgical classes
                    classes = classes.filter(c => !c.startsWith('liturgical-'));
                    // Add new class
                    classes.push(newClass);
                    return `class=${quote}${classes.join(' ')}${quote}`;
                });
            } else {
                // Add class attribute
                // Ensure proper spacing
                const prefix = (attrs.length > 0 && !/\s$/.test(attrs)) ? ' ' : '';
                return `<header${attrs}${prefix} class="${newClass}">`;
            }
        });

        // Write back
        fs.writeFileSync(INDEX_PATH, html, 'utf8');
        console.log('Successfully updated index.html');

    } catch (error) {
        console.error('Error in updateLiturgicalDay:', error);
        process.exit(1);
    }
}

updateLiturgicalDay();
