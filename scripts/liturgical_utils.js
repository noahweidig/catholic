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
 * Calculates the date of Ash Wednesday (46 days before Easter Sunday).
 * @param {number} year
 * @returns {string} Date string in YYYY-MM-DD format
 */
function getAshWednesdayDate(year) {
    const easter = getEasterDate(year);
    const ashWed = new Date(easter.getTime() - 46 * 24 * 60 * 60 * 1000);
    return ashWed.toISOString().split('T')[0];
}

/**
 * Calculates the date of Good Friday (2 days before Easter Sunday).
 * @param {number} year
 * @returns {string} Date string in YYYY-MM-DD format
 */
function getGoodFridayDate(year) {
    const easter = getEasterDate(year);
    const goodFri = new Date(easter.getTime() - 2 * 24 * 60 * 60 * 1000);
    return goodFri.toISOString().split('T')[0];
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

/**
 * Determines if a date is a Fast or Abstinence day and returns the description.
 * @param {string} dateStr YYYY-MM-DD
 * @param {string} [rank] Romcal rank ('SOLEMNITY', etc.)
 * @returns {string|null} Description or null
 */
function getFastAbstinenceDescription(dateStr, rank) {
    const year = parseInt(dateStr.split('-')[0], 10);
    const ashWed = getAshWednesdayDate(year);
    const goodFri = getGoodFridayDate(year);

    if (dateStr === ashWed) {
        return 'Obligatory Day of Fast & Abstinence';
    }

    if (dateStr === goodFri) {
        return 'Obligatory Day of Fast & Abstinence';
    }

    // Check if Friday in Lent
    // Lent starts Ash Wed. Ends Holy Thursday (exclusive of Mass of Lord's Supper, usually evening).
    // Basically dates between Ash Wed and Good Fri (exclusive).
    // Good Fri is already handled.
    // Holy Thursday is not a day of abstinence (unless it's Good Fri, which it isn't).
    // So strictly between AshWed and GoodFri.
    if (dateStr > ashWed && dateStr < goodFri) {
        const d = new Date(dateStr);
        // getUTCDay: 0=Sun, 5=Fri
        if (d.getUTCDay() === 5) {
            // It is a Friday in Lent.
            // Check rank. If Solemnity, no abstinence.
            if (rank === 'SOLEMNITY') {
                return null;
            }
            return 'Obligatory Day of Abstinence';
        }
    }

    return null;
}

module.exports = {
    getEasterDate,
    getAscensionDate,
    getAshWednesdayDate,
    getGoodFridayDate,
    getFastAbstinenceDescription
};
