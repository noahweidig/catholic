// Silence i18next support notice
const originalInfo = console.info;
console.info = () => {};

const { Romcal } = require('romcal');
const { UnitedStates_En } = require('@romcal/calendar.united-states');

// Restore console.info (optional, but good practice if used later)
// console.info = originalInfo;
// Actually, let's keep it silenced to avoid any other noise, or restore it inside the function if needed.
// But i18next might print later? No, usually once.
// Let's restore it after require/init?
// But Romcal initialization happens inside getLiturgicalInfo for the localizedCalendar.

async function getLiturgicalInfo() {
    try {
        const today = new Date();
        const year = today.getFullYear();
        const offset = today.getTimezoneOffset() * 60000;
        const localDate = new Date(today.getTime() - offset);
        const todayString = localDate.toISOString().split('T')[0];

        const romcal = new Romcal({
            localizedCalendar: UnitedStates_En
        });

        const calendar = await romcal.generateCalendar(year);

        const events = calendar[todayString];

        if (!events || events.length === 0) {
            console.error('No liturgical entry found for today.');
            process.exit(1);
        }

        // Debug info
        // console.error(`Found ${events.length} events for ${todayString}`);
        // events.forEach(e => console.error(` - ${e.name} (${e.rank})`));

        let selectedEvent = events[0];

        const lowPriorityRanks = ['WEEKDAY', 'FERIA'];

        if (lowPriorityRanks.includes(selectedEvent.rank)) {
             const betterEvent = events.find(e => !lowPriorityRanks.includes(e.rank));
             if (betterEvent) {
                 selectedEvent = betterEvent;
             }
        }

        const name = selectedEvent.name;
        const color = (selectedEvent.colors && selectedEvent.colors.length > 0)
            ? selectedEvent.colors[0].toLowerCase()
            : 'green';

        const result = {
            name: name,
            color: color
        };

        console.log(JSON.stringify(result));

    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

getLiturgicalInfo();
