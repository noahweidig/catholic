const romcal = require('romcal');
const fs = require('fs');
const path = require('path');

async function generateICS() {
    try {
        const today = new Date();
        const currentYear = today.getFullYear();
        // Generate for current year and next year
        const years = [currentYear, currentYear + 1];
        let allEvents = [];

        console.log(`Generating calendar for years: ${years.join(', ')}`);

        for (const year of years) {
            const calendar = await romcal.calendarFor({
                year: year,
                country: 'unitedStates',
                locale: 'en'
            });
            allEvents = allEvents.concat(calendar);
        }

        // Sort events by date just in case
        allEvents.sort((a, b) => new Date(a.moment) - new Date(b.moment));

        let icsContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Catholic Faith//Catholic Liturgical Calendar//EN',
            'X-WR-CALNAME:Catholic Liturgical Calendar',
            'CALSCALE:GREGORIAN',
            'METHOD:PUBLISH'
        ];

        // Track processed dates to avoid duplicates if any (though romcal usually handles this)
        // Actually, romcal returns one event per day usually. But we are concatenating years so we might have overlap if we ran for overlapping ranges, but here we run for distinct years.
        // However, let's be safe.
        const processedDates = new Set();

        for (const event of allEvents) {
            const dateStr = event.moment.split('T')[0]; // YYYY-MM-DD
            if (processedDates.has(dateStr)) continue;
            processedDates.add(dateStr);

            const dtStart = dateStr.replace(/-/g, ''); // YYYYMMDD

            // Format name
            let summary = event.name;
            summary = summary.replace(/Saint /g, 'St. ');
            summary = summary.replace(/Saints /g, 'Sts. ');
            summary = summary.replace(/Blessed /g, 'Bl. ');

            // Check for description
            let description = '';
            // If there are titles in meta, add them?
            if (event.data && event.data.meta && event.data.meta.titles && event.data.meta.titles.length > 0) {
                 // Usually titles are like PATRON_OF_EUROPE, etc. Maybe not useful for user notes.
                 // The user asked for "memorial or alternative saint".
                 // Since romcal v1.3 doesn't easily expose alternatives, we'll leave description empty
                 // unless we find something relevant.
            }

            // Create VEVENT
            icsContent.push('BEGIN:VEVENT');
            icsContent.push(`UID:${dtStart}-${event.key}@noahweidig.com`);
            icsContent.push(`DTSTART;VALUE=DATE:${dtStart}`);
            icsContent.push(`SUMMARY:${summary}`);
            if (description) {
                icsContent.push(`DESCRIPTION:${description}`);
            }
            icsContent.push('END:VEVENT');
        }

        icsContent.push('END:VCALENDAR');

        const outputPath = path.join(__dirname, '..', 'cal.ics');
        fs.writeFileSync(outputPath, icsContent.join('\r\n'));
        console.log(`Calendar generated at ${outputPath}`);

    } catch (error) {
        console.error('Error generating calendar:', error);
        process.exit(1);
    }
}

generateICS();
