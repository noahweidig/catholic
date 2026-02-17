// Silence i18next support notice
const originalInfo = console.info;
console.info = () => {};

const { Romcal } = require('romcal');
const { UnitedStates_En } = require('@romcal/calendar.united-states');
const fs = require('fs');
const path = require('path');

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

// Helper for Title Case
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

async function generateSundaysHolydays() {
    try {
        const today = new Date();
        const startYear = today.getFullYear();
        const endYear = 2100;

        const romcalUS = new Romcal({ localizedCalendar: UnitedStates_En });
        const romcalGeneral = new Romcal(); // For Ascension Thursday date

        let icsContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Catholic Faith//Sundays & Holy Days//EN',
            'X-WR-CALNAME:Sundays & Holy Days',
            'CALSCALE:GREGORIAN',
            'METHOD:PUBLISH'
        ];

        console.log(`Generating Sundays & Holy Days from ${startYear} to ${endYear}...`);

        for (let year = startYear; year <= endYear; year++) {
            const dateMap = new Map(); // Date string -> Event object

            // 1. Get Sundays (US Calendar)
            const usCalendar = await romcalUS.generateCalendar(year);

            // Iterate all dates
            for (const [dateStr, events] of Object.entries(usCalendar)) {
                // Check if it's Sunday
                // new Date(dateStr) is UTC midnight
                if (new Date(dateStr).getUTCDay() === 0) {
                    // It's a Sunday. Pick the best event based on rank.
                    const sortedEvents = [...events].sort((a, b) => {
                        const rankA = getRankValue(a.rank);
                        const rankB = getRankValue(b.rank);
                        return rankB - rankA; // Descending
                    });

                    const selectedEvent = sortedEvents[0];

                    // We only care about Sundays.
                    // Note: romcal might return 'FEAST' or 'SOLEMNITY' on a Sunday (replacing the Sunday rank).
                    // We include it because it IS the liturgical celebration for that Sunday.

                    dateMap.set(dateStr, {
                        date: dateStr,
                        title: formatSummary(selectedEvent.name)
                    });
                }
            }

            // 2. Get Holy Days
            const holyDays = [];

            // Ascension Thursday (General Roman)
            const generalCalendar = await romcalGeneral.generateCalendar(year);
            const genEvents = Object.values(generalCalendar).flat();
            const ascension = genEvents.find(e => e.id === 'ascension_of_the_lord');

            if (ascension) {
                holyDays.push({ date: ascension.date, title: 'Ascension Thursday' });
            }

            // Fixed Holy Days
            holyDays.push(
                { date: `${year}-01-01`, title: 'Mary, Mother of God' },
                { date: `${year}-08-15`, title: 'Assumption of the Blessed Virgin Mary' },
                { date: `${year}-11-01`, title: 'All Saints' },
                { date: `${year}-12-08`, title: 'Immaculate Conception' },
                { date: `${year}-12-25`, title: 'Nativity of Our Lord' }
            );

            // 3. Merge Holy Days (Overwrite Sundays)
            for (const hd of holyDays) {
                // Always set/overwrite.
                dateMap.set(hd.date, {
                    date: hd.date,
                    title: hd.title
                });
            }

            // 4. Convert to array and sort
            const sortedEvents = Array.from(dateMap.values()).sort((a, b) => a.date.localeCompare(b.date));

            // 5. Generate ICS lines
            for (const event of sortedEvents) {
                const dtStart = event.date.replace(/-/g, '');
                // Unique UID per event
                const uid = `${dtStart}-${event.title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}@noahweidig.com`;

                icsContent.push('BEGIN:VEVENT');
                icsContent.push(`UID:${uid}`);
                icsContent.push(`DTSTART;VALUE=DATE:${dtStart}`);
                icsContent.push(`SUMMARY:${event.title}`);
                icsContent.push('END:VEVENT');
            }
        }

        icsContent.push('END:VCALENDAR');

        const outputPath = path.join(__dirname, '..', 'sundaysholydays.ics');
        fs.writeFileSync(outputPath, icsContent.join('\r\n'));
        console.log(`Sundays & Holy Days calendar generated at ${outputPath}`);

    } catch (error) {
        console.error('Error generating Sundays & Holy Days calendar:', error);
        process.exit(1);
    }
}

generateSundaysHolydays();
