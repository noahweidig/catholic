const fs = require('fs');
const path = require('path');
const { getAscensionDate } = require('./liturgical_utils');

function generateHolydays() {
    try {
        const today = new Date();
        const startYear = today.getFullYear();
        const endYear = 2100;

        let icsContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Catholic Faith//Holy Days//EN',
            'X-WR-CALNAME:Holy Days of Obligation (US) + Ascension',
            'CALSCALE:GREGORIAN',
            'METHOD:PUBLISH'
        ];

        console.log(`Generating Holy Days from ${startYear} to ${endYear}...`);

        for (let year = startYear; year <= endYear; year++) {
            const yearEvents = [];

            // 1. Ascension Thursday (Variable)
            const ascensionDate = getAscensionDate(year);
            yearEvents.push({
                date: ascensionDate,
                title: 'Ascension Thursday'
            });

            // 2. Fixed Holy Days
            const fixedEvents = [
                { date: `${year}-01-01`, title: 'Mary, Mother of God' },
                { date: `${year}-08-15`, title: 'Assumption of the Blessed Virgin Mary' },
                { date: `${year}-11-01`, title: 'All Saints' },
                { date: `${year}-12-08`, title: 'Immaculate Conception' },
                { date: `${year}-12-25`, title: 'Nativity of Our Lord' }
            ];

            yearEvents.push(...fixedEvents);

            // Sort by date
            yearEvents.sort((a, b) => a.date.localeCompare(b.date));

            // Generate ICS entries
            for (const event of yearEvents) {
                const dtStart = event.date.replace(/-/g, '');
                // Simple UID
                const uid = `${dtStart}-${event.title.replace(/\s+/g, '-').toLowerCase()}@noahweidig.com`;

                icsContent.push('BEGIN:VEVENT');
                icsContent.push(`UID:${uid}`);
                icsContent.push(`DTSTART;VALUE=DATE:${dtStart}`);
                icsContent.push(`SUMMARY:${event.title}`);
                icsContent.push('END:VEVENT');
            }
        }

        icsContent.push('END:VCALENDAR');

        const outputPath = path.join(__dirname, '..', 'holydays.ics');
        fs.writeFileSync(outputPath, icsContent.join('\r\n'));
        console.log(`Holy Days calendar generated at ${outputPath}`);

    } catch (error) {
        console.error('Error generating Holy Days calendar:', error);
        process.exit(1);
    }
}

generateHolydays();
