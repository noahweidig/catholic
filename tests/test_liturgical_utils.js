
const assert = require('assert');
const { toTitleCase } = require('../scripts/liturgical_utils');

console.log('Running tests for toTitleCase...');

const testCases = [
    { input: "john paul ii", expected: "John Paul II" },
    { input: "the feast of the immaculate conception", expected: "The Feast of the Immaculate Conception" },
    { input: "sunday of the word of god", expected: "Sunday of the Word of God" },
    { input: "pius x", expected: "Pius X" },
    { input: "benedict xvi", expected: "Benedict XVI" },
    { input: "mass for the dead", expected: "Mass for the Dead" },
    { input: "ordinary time", expected: "Ordinary Time" },
    { input: "third sunday of advent", expected: "Third Sunday of Advent" },
    { input: "saint francis of assisi", expected: "Saint Francis of Assisi" },
    { input: "our lady of guadalupe", expected: "Our Lady of Guadalupe" },
    { input: "I", expected: "I" }, // Roman numeral
    { input: "i", expected: "I" }, // Roman numeral
    { input: "xxxix", expected: "XXXIX" }, // Max roman numeral in list
    { input: "xl", expected: "Xl" }, // Not in list (XL=40), should treat as normal word
    { input: "word.", expected: "Word." }, // Punctuation
    { input: "word, another", expected: "Word, Another" }, // Punctuation
    { input: "in the beginning", expected: "In the Beginning" }, // "in" at start capitalized
    { input: "day of the dead", expected: "Day of the Dead" }, // "of", "the" lowercase inside
    { input: "THE DAY", expected: "The Day" }, // Input uppercase
];

let passed = 0;
let failed = 0;

for (const { input, expected } of testCases) {
    try {
        const result = toTitleCase(input);
        assert.strictEqual(result, expected);
        passed++;
    } catch (e) {
        console.error(`FAILED: "${input}"`);
        console.error(`  Expected: "${expected}"`);
        console.error(`  Actual:   "${toTitleCase(input)}"`);
        failed++;
    }
}

console.log(`\nTests completed: ${passed} passed, ${failed} failed.`);

if (failed > 0) {
    process.exit(1);
}
