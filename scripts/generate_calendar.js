// Silence i18next support notice
const originalInfo = console.info;
console.info = () => {};

const { Romcal } = require('romcal');
const { UnitedStates_En } = require('@romcal/calendar.united-states');
const fs = require('fs');
const path = require('path');
const { getFastAbstinenceDescription, toTitleCase } = require('./liturgical_utils');

// Helper to determine rank value
function getRankValue(rank) {
    switch (rank) {
        case 'SOLEMNITY': return 5;
        case 'FEAST': return 4;
        case 'MEMORIAL': return 3;
        case 'OPTIONAL_MEMORIAL': return 2;
        default: return 1; // WEEKDAY, FERIA, etc.
    }
}

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
            if (!events || events.length === 0) continue;

            // Prioritize events: Highest rank first.
            const sortedEvents = [...events].sort((a, b) => {
                const rankA = getRankValue(a.rank);
                const rankB = getRankValue(b.rank);
                return rankB - rankA; // Descending
            });

            const selectedEvent = sortedEvents[0];
            const dtStart = dateStr.replace(/-/g, ''); // YYYYMMDD

            // Format name
            let summary = selectedEvent.name;

            // Remove titles: split by comma and take first part
            if (summary.includes(',')) {
                summary = summary.split(',')[0];
            }

            // Replace "Saint "/"Saints "/"Blessed " with "St. "/"Sts. "/"Bl. "
            summary = summary.replace(/Saint /g, 'St. ');
            summary = summary.replace(/Saints /g, 'Sts. ');
            summary = summary.replace(/Blessed /g, 'Bl. ');

            // Replace " and " with " & "
            summary = summary.replace(/ and /g, ' & ');

            // Apply Title Case
            summary = toTitleCase(summary);

            // Create VEVENT
            icsContent.push('BEGIN:VEVENT');
            // Use date as UID part to ensure uniqueness per day in this generated calendar
            icsContent.push(`UID:${dtStart}-catholic-calendar@noahweidig.com`);
            icsContent.push(`DTSTART;VALUE=DATE:${dtStart}`);
            icsContent.push(`SUMMARY:${summary}`);

            const description = getFastAbstinenceDescription(dateStr, selectedEvent.rank, selectedEvent.calendar.dayOfWeek);
            if (description) {
                icsContent.push(`DESCRIPTION:${description}`);
            }

            icsContent.push('END:VEVENT');
        }

        icsContent.push('END:VCALENDAR');

        const outputPath = path.join(__dirname, '..', 'litcal.ics');
        fs.writeFileSync(outputPath, icsContent.join('\r\n'));
        console.log(`Calendar generated at ${outputPath}`);

    } catch (error) {
        console.error('Error generating calendar:', error);
        process.exit(1);
    }
}

generateICS();
