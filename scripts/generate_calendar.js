// Silence i18next support notice
const originalInfo = console.info;
console.info = () => {};

const { Romcal } = require('romcal');
const { UnitedStates_En } = require('@romcal/calendar.united-states');
const fs = require('fs');
const path = require('path');

async function generateICS() {
    try {
        const today = new Date();
        const currentYear = today.getFullYear();
        // Generate for current year and next year
        const years = [currentYear, currentYear + 1];
        let allEvents = {};

        const romcal = new Romcal({
            localizedCalendar: UnitedStates_En
        });

        console.log(`Generating calendar for years: ${years.join(', ')}`);

        for (const year of years) {
            const calendar = await romcal.generateCalendar(year);
            // Merge into allEvents
            // calendar is { dateStr: [events] }
            Object.assign(allEvents, calendar);
        }

        // Get all dates and sort them
        const dates = Object.keys(allEvents).sort();

        let icsContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Catholic Faith//Catholic Liturgical Calendar//EN',
            'X-WR-CALNAME:Catholic Liturgical Calendar',
            'CALSCALE:GREGORIAN',
            'METHOD:PUBLISH'
        ];

        for (const dateStr of dates) {
            const events = allEvents[dateStr];

            for (const event of events) {
                const dtStart = dateStr.replace(/-/g, ''); // YYYYMMDD

                // Format name
                let summary = event.name;
                summary = summary.replace(/Saint /g, 'St. ');
                summary = summary.replace(/Saints /g, 'Sts. ');
                summary = summary.replace(/Blessed /g, 'Bl. ');

                let descriptionParts = [];
                if (event.rank) {
                    // Convert rank to readable format if needed, or keep as is.
                    // usually generic ranks like SOLEMNITY are uppercase.
                    // But in v3 rank might be readable string?
                    // README says `rank: 'SOLEMNITY'` and `rankName: 'Solemnity'` (localized?)
                    // Let's use rankName if available, else rank.
                    descriptionParts.push(`Rank: ${event.rankName || event.rank}`);
                }
                if (event.colors && event.colors.length > 0) {
                     // Colors are usually uppercase strings in v3 (e.g. WHITE)
                     // Map to Title Case?
                     const formattedColors = event.colors.map(c => c.charAt(0) + c.slice(1).toLowerCase()).join(', ');
                     descriptionParts.push(`Color: ${formattedColors}`);
                }

                const description = descriptionParts.join('\\n');

                // Create VEVENT
                icsContent.push('BEGIN:VEVENT');
                icsContent.push(`UID:${dtStart}-${event.id}@noahweidig.com`);
                icsContent.push(`DTSTART;VALUE=DATE:${dtStart}`);
                icsContent.push(`SUMMARY:${summary}`);
                if (description) {
                    icsContent.push(`DESCRIPTION:${description}`);
                }
                icsContent.push('END:VEVENT');
            }
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
