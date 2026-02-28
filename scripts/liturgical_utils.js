// Helper functions for liturgical calculations

// Caches for expensive calculations to avoid re-computation
// We store timestamps for Easter to avoid Date object mutation issues
const easterCache = new Map();
const ashWedCache = new Map();
const goodFriCache = new Map();
const ascensionCache = new Map();

/**
 * Calculates the date of Easter Sunday for a given year using the Meeus/Jones/Butcher algorithm.
 * @param {number} year
 * @returns {Date} Easter Sunday date (UTC midnight)
 */
function getEasterDate(year) {
    if (easterCache.has(year)) {
        return new Date(easterCache.get(year));
    }

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
    const date = new Date(Date.UTC(year, month - 1, day));

    easterCache.set(year, date.getTime());
    return date;
}

// Helper to format a Date as YYYY-MM-DD significantly faster than toISOString().split('T')[0]
function formatToYMD(date) {
    const y = date.getUTCFullYear();
    const m = date.getUTCMonth() + 1;
    const d = date.getUTCDate();
    return y + '-' + (m < 10 ? '0' : '') + m + '-' + (d < 10 ? '0' : '') + d;
}

/**
 * Calculates the date of Ash Wednesday (46 days before Easter Sunday).
 * @param {number} year
 * @returns {string} Date string in YYYY-MM-DD format
 */
function getAshWednesdayDate(year) {
    if (ashWedCache.has(year)) {
        return ashWedCache.get(year);
    }

    const easter = getEasterDate(year);
    const ashWed = new Date(easter.getTime() - 46 * 24 * 60 * 60 * 1000);
    const dateStr = formatToYMD(ashWed);

    ashWedCache.set(year, dateStr);
    return dateStr;
}

/**
 * Calculates the date of Good Friday (2 days before Easter Sunday).
 * @param {number} year
 * @returns {string} Date string in YYYY-MM-DD format
 */
function getGoodFridayDate(year) {
    if (goodFriCache.has(year)) {
        return goodFriCache.get(year);
    }

    const easter = getEasterDate(year);
    const goodFri = new Date(easter.getTime() - 2 * 24 * 60 * 60 * 1000);
    const dateStr = formatToYMD(goodFri);

    goodFriCache.set(year, dateStr);
    return dateStr;
}

/**
 * Calculates the date of Ascension Thursday (39 days after Easter Sunday).
 * @param {number} year
 * @returns {string} Date string in YYYY-MM-DD format
 */
function getAscensionDate(year) {
    if (ascensionCache.has(year)) {
        return ascensionCache.get(year);
    }

    const easter = getEasterDate(year);
    // Add 39 days in milliseconds
    const ascension = new Date(easter.getTime() + 39 * 24 * 60 * 60 * 1000);
    const dateStr = formatToYMD(ascension);

    ascensionCache.set(year, dateStr);
    return dateStr;
}

/**
 * Determines if a date is a Fast or Abstinence day and returns the description.
 * @param {string} dateStr YYYY-MM-DD
 * @param {string} [rank] Romcal rank ('SOLEMNITY', etc.)
 * @param {number} [dayOfWeek] 0-6
 * @param {number} [yearArg] Optional year to avoid parsing
 * @returns {string|null} Description or null
 */
function getFastAbstinenceDescription(dateStr, rank, dayOfWeek, yearArg) {
    // Optimization: Use passed year if available, otherwise parse using substring (faster than split)
    const year = yearArg || parseInt(dateStr.substring(0, 4), 10);
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
        let isFriday = false;

        if (dayOfWeek !== undefined) {
            isFriday = (dayOfWeek === 5);
        } else {
            const d = new Date(dateStr);
            // getUTCDay: 0=Sun, 5=Fri
            isFriday = (d.getUTCDay() === 5);
        }

        if (isFriday) {
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

// Optimization: Pre-compile Sets for faster lookup
const smallWordsSet = new Set(['a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'from', 'by', 'in', 'of']);
const romanNumeralsSet = new Set([
    'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X',
    'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX',
    'XXI', 'XXII', 'XXIII', 'XXIV', 'XXV', 'XXVI', 'XXVII', 'XXVIII', 'XXIX', 'XXX',
    'XXXI', 'XXXII', 'XXXIII', 'XXXIV', 'XXXV', 'XXXVI', 'XXXVII', 'XXXVIII', 'XXXIX'
]);

// Optimization: Pre-compile Regex for faster replace
const WORD_REGEX = /\w\S*/g;
const FORMAT_SUMMARY_REGEX = /Saints? |Blessed | and /g;

/**
 * Converts a string to Title Case.
 * @param {string} str
 * @returns {string}
 */
function toTitleCase(str) {
    return str.replace(WORD_REGEX, (txt, offset) => {
        const upper = txt.toUpperCase();
        // Check for Roman Numerals first
        if (romanNumeralsSet.has(upper)) {
            return upper;
        }

        const lower = txt.toLowerCase();
        if (offset !== 0 && smallWordsSet.has(lower)) {
            return lower;
        }

        return upper.charAt(0) + lower.slice(1);
    });
}

/**
 * Formats the event summary (title) by shortening common words and applying Title Case.
 * @param {string} summary
 * @returns {string}
 */
function formatSummary(summary) {
    const commaIndex = summary.indexOf(',');
    if (commaIndex !== -1) {
        summary = summary.substring(0, commaIndex);
    }

    summary = summary.replace(FORMAT_SUMMARY_REGEX, (match) => {
        if (match === 'Saint ') return 'St. ';
        if (match === 'Saints ') return 'Sts. ';
        if (match === 'Blessed ') return 'Bl. ';
        if (match === ' and ') return ' & ';
        return match;
    });

    return toTitleCase(summary);
}

module.exports = {
    getEasterDate,
    getAscensionDate,
    getAshWednesdayDate,
    getGoodFridayDate,
    getFastAbstinenceDescription,
    toTitleCase,
    formatSummary
};
