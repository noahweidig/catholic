// Silence i18next support notice
const originalInfo = console.info;
console.info = () => {};

const { Romcal } = require('romcal');
const { UnitedStates_En } = require('@romcal/calendar.united-states');
const fs = require('fs');
const path = require('path');
const { getFastAbstinenceDescription } = require('./liturgical_utils');

// Helper to determine rank value (same as generate_calendar.js)
function getRankValue(rank) {
    switch (rank) {
        case 'SOLEMNITY': return 5;
        case 'FEAST': return 4;
        case 'MEMORIAL': return 3;
        case 'OPTIONAL_MEMORIAL': return 2;
        default: return 1; // WEEKDAY, FERIA, etc.
    }
}

// Helper for Title Case (same as generate_calendar.js)
function toTitleCase(str) {
    const smallWords = /^(a|an|the|and|but|or|for|nor|on|at|to|from|by|in|of)$/i;
    const romanNumerals = /^(I|II|III|IV|V|VI|VII|VIII|IX|X|XI|XII|XIII|XIV|XV|XVI|XVII|XVIII|XIX|XX|XXI|XXII|XXIII|XXIV|XXV|XXVI|XXVII|XXVIII|XXIX|XXX|XXXI|XXXII|XXXIII|XXXIV|XXXV|XXXVI|XXXVII|XXXVIII|XXXIX)$/i;

    return str.replace(/\w\S*/g, (txt, offset) => {
        if (romanNumerals.test(txt)) {
            return txt.toUpperCase();
        }
        if (offset !== 0 && smallWords.test(txt)) {
            return txt.toLowerCase();
        }
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

function formatSummary(summary) {
    if (summary.includes(',')) {
        summary = summary.split(',')[0];
    }
    summary = summary.replace(/Saint /g, 'St. ');
    summary = summary.replace(/Saints /g, 'Sts. ');
    summary = summary.replace(/Blessed /g, 'Bl. ');
    summary = summary.replace(/ and /g, ' & ');
    return toTitleCase(summary);
}

async function generateMajorFeasts() {
    try {
        const today = new Date();
        const startYear = today.getFullYear();
        const endYear = 2100;

        const romcal = new Romcal({
            localizedCalendar: UnitedStates_En
        });

        console.log(`Generating Major Feasts calendar from ${startYear} to ${endYear}...`);

        let icsContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Catholic Faith//Major Feasts//EN',
            'X-WR-CALNAME:Major Feasts & Fast Days',
            'CALSCALE:GREGORIAN',
            'METHOD:PUBLISH'
        ];

        for (let year = startYear; year <= endYear; year++) {
            const romcalEvents = await romcal.generateCalendar(year);
            const yearEvents = [];

            for (const [dateStr, events] of Object.entries(romcalEvents)) {
                if (!events || events.length === 0) continue;

                // Sort by rank descending
                const sortedEvents = [...events].sort((a, b) => getRankValue(b.rank) - getRankValue(a.rank));
                const selectedEvent = sortedEvents[0];

                let include = false;

                // 1. Check Solemnity
                if (selectedEvent.rank === 'SOLEMNITY') {
                    include = true;
                }

                // 2. Check Sunday
                const d = new Date(dateStr);
                // getUTCDay: 0=Sun
                if (d.getUTCDay() === 0) {
                    include = true;
                }

                // 3. Check Fast & Abstinence
                // We calculate description regardless, but if it exists, we force include.
                const fastDesc = getFastAbstinenceDescription(dateStr, selectedEvent.rank);
                if (fastDesc) {
                    include = true;
                }

                if (include) {
                    const summary = formatSummary(selectedEvent.name);

                    yearEvents.push({
                        date: dateStr,
                        summary: summary,
                        description: fastDesc // might be null
                    });
                }
            }

            // Sort by date (Object.entries order is not guaranteed)
            yearEvents.sort((a, b) => a.date.localeCompare(b.date));

            for (const event of yearEvents) {
                const dtStart = event.date.replace(/-/g, '');
                const uid = `${dtStart}-majorfeasts-calendar@noahweidig.com`;

                icsContent.push('BEGIN:VEVENT');
                icsContent.push(`UID:${uid}`);
                icsContent.push(`DTSTART;VALUE=DATE:${dtStart}`);
                icsContent.push(`SUMMARY:${event.summary}`);

                if (event.description) {
                    icsContent.push(`DESCRIPTION:${event.description}`);
                }

                icsContent.push('END:VEVENT');
            }
        }

        icsContent.push('END:VCALENDAR');

        const outputPath = path.join(__dirname, '..', 'majorfeasts.ics');
        fs.writeFileSync(outputPath, icsContent.join('\r\n'));
        console.log(`Major Feasts calendar generated at ${outputPath}`);

    } catch (error) {
        console.error('Error generating Major Feasts calendar:', error);
        process.exit(1);
    }
}

generateMajorFeasts();
