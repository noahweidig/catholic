const romcal = require('romcal');

async function getLiturgicalInfo() {
    try {
        const date = new Date();
        const year = date.getFullYear();

        const calendar = await romcal.calendarFor({
            year: year,
            country: 'unitedStates',
            locale: 'en'
        });

        const todayString = date.toISOString().split('T')[0];
        const todayEntries = calendar.filter(d => d.moment.startsWith(todayString));

        if (todayEntries.length === 0) {
            // Fallback or just error out? romcal should have entries for every day.
            // But sometimes it might be missing specialized feasts if not configured correctly.
            // However, usually there is a Feria or Sunday.
            console.error('No liturgical entry found for today.');
            process.exit(1);
        }

        // Use the first entry (highest rank usually)
        const todayEntry = todayEntries[0];
        const dayName = todayEntry.name;
        let colorKey = 'green';
        if (todayEntry.data && todayEntry.data.meta && todayEntry.data.meta.liturgicalColor) {
            colorKey = todayEntry.data.meta.liturgicalColor.key.toLowerCase();
        }

        const result = {
            name: dayName,
            color: colorKey
        };

        console.log(JSON.stringify(result));

    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

getLiturgicalInfo();
