// Helper functions for liturgical calculations

/**
 * Calculates the date of Easter Sunday for a given year using the Meeus/Jones/Butcher algorithm.
 * @param {number} year
 * @returns {Date} Easter Sunday date (UTC midnight)
 */
function getEasterDate(year) {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    // Return date in UTC to avoid timezone issues, consistent with Romcal output
    return new Date(Date.UTC(year, month - 1, day));
}

/**
 * Calculates the date of Ascension Thursday (39 days after Easter Sunday).
 * @param {number} year
 * @returns {string} Date string in YYYY-MM-DD format
 */
function getAscensionDate(year) {
    const easter = getEasterDate(year);
    // Add 39 days in milliseconds
    const ascension = new Date(easter.getTime() + 39 * 24 * 60 * 60 * 1000);
    return ascension.toISOString().split('T')[0];
}

module.exports = {
    getEasterDate,
    getAscensionDate
};
