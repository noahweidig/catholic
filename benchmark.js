const { toTitleCase } = require('./scripts/liturgical_utils.js');

const start = performance.now();
for (let i = 0; i < 500000; i++) {
    toTitleCase("Second Sunday of Easter or Sunday of Divine Mercy");
    toTitleCase("The Commemoration of All the Faithful Departed");
    toTitleCase("Saint John Paul II, Pope");
    toTitleCase("Monday of the thirty-fourth week in Ordinary Time");
}
console.log(`Original: ${performance.now() - start} ms`);