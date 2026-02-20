// Silence i18next support notice
const originalInfo = console.info;
console.info = () => {};

const { Romcal } = require('romcal');
const { UnitedStates_En } = require('@romcal/calendar.united-states');
const fs = require('fs');
const path = require('path');
const { getAshWednesdayDate, getGoodFridayDate, toTitleCase } = require('./liturgical_utils');

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

async function generateFastAbstain() {
    try {
        const today = new Date();
        const startYear = today.getFullYear();
        const endYear = 2100;

        // Initialize Romcal with US Calendar
        const romcal = new Romcal({
            localizedCalendar: UnitedStates_En
        });

        console.log(`Generating Fast & Abstinence calendar from ${startYear} to ${endYear}...`);

        let icsContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Catholic Faith//Fast & Abstinence//EN',
            'X-WR-CALNAME:Days of Fast & Abstinence (US)',
            'CALSCALE:GREGORIAN',
            'METHOD:PUBLISH'
        ];

        for (let year = startYear; year <= endYear; year++) {
            const ashWed = getAshWednesdayDate(year);
            const goodFri = getGoodFridayDate(year);
            const romcalEvents = await romcal.generateCalendar(year);
            const yearEvents = [];

            // 1. Ash Wednesday
            const ashEvents = romcalEvents[ashWed] || [];
            let ashName = 'Ash Wednesday';
            if (ashEvents.length > 0) {
                 ashName = formatSummary(ashEvents[0].name);
            }
            yearEvents.push({
                date: ashWed,
                summary: ashName,
                description: 'Obligatory Day of Fast & Abstinence'
            });

            // 2. Good Friday
            const goodEvents = romcalEvents[goodFri] || [];
            let goodName = 'Good Friday';
            if (goodEvents.length > 0) {
                goodName = formatSummary(goodEvents[0].name);
            }
            yearEvents.push({
                date: goodFri,
                summary: goodName,
                description: 'Obligatory Day of Fast & Abstinence'
            });

            // 3. Fridays in Lent
            for (const [dateStr, events] of Object.entries(romcalEvents)) {
                // Check if date is strictly between Ash Wed and Good Fri
                if (dateStr > ashWed && dateStr < goodFri) {
                     // Check Friday (5)
                     if (events[0].calendar.dayOfWeek === 5) {
                         // Check Solemnity
                         const isSolemnity = events.some(e => e.rank === 'SOLEMNITY');

                         if (!isSolemnity) {
                              // Get best event name
                              let summary = 'Friday of Lent';
                              if (events.length > 0) {
                                  const sorted = [...events].sort((a, b) => getRankValue(b.rank) - getRankValue(a.rank));
                                  summary = formatSummary(sorted[0].name);
                              }

                              yearEvents.push({
                                  date: dateStr,
                                  summary: summary,
                                  description: 'Obligatory Day of Abstinence'
                              });
                         }
                     }
                }
            }

            // Sort events by date
            yearEvents.sort((a, b) => a.date.localeCompare(b.date));

            // Generate ICS lines
            for (const event of yearEvents) {
                const dtStart = event.date.replace(/-/g, '');
                // Unique UID
                const uid = `${dtStart}-fastabstain-calendar@noahweidig.com`;

                icsContent.push('BEGIN:VEVENT');
                icsContent.push(`UID:${uid}`);
                icsContent.push(`DTSTART;VALUE=DATE:${dtStart}`);
                icsContent.push(`SUMMARY:${event.summary}`);
                icsContent.push(`DESCRIPTION:${event.description}`);
                icsContent.push('END:VEVENT');
            }
        }

        icsContent.push('END:VCALENDAR');

        const outputPath = path.join(__dirname, '..', 'fastabstain.ics');
        fs.writeFileSync(outputPath, icsContent.join('\r\n'));
        console.log(`Fast & Abstinence calendar generated at ${outputPath}`);

    } catch (error) {
        console.error('Error generating Fast & Abstinence calendar:', error);
        process.exit(1);
    }
}

generateFastAbstain();
