## 2024-05-24 - [Avoid Library Overhead for Simple Dates]
**Learning:** `romcal.generateCalendar(year)` generates the full year's liturgical calendar (365+ events), which is extremely expensive when you only need a single movable feast date like Ascension Thursday.
**Action:** For specific movable feasts, implement the standard algorithm (e.g., Meeus/Jones/Butcher for Easter) instead of generating the entire calendar.

## 2024-05-24 - [Avoid setTimeout for Scroll Events]
**Learning:** Using `setTimeout` to throttle scroll events (e.g., waiting 450ms) for sticky header transitions makes the UI feel unresponsive and "laggy".
**Action:** Replace `setTimeout` throttling with `requestAnimationFrame` and a hysteresis threshold (e.g., >80px on scroll down, <15px on scroll up) to decouple UI updates from scroll frequency without introducing noticeable delays.

## 2024-05-24 - [Regex vs Set Lookup Overhead]
**Learning:** Replacing a long Regex alternation (O(m)) with a `Set` lookup (O(1)) for case-insensitive keyword matching in Node.js v22 yielded negligible performance gains (~1.01x) due to the highly optimized nature of the V8 Regex engine and the overhead of string allocations (`toUpperCase`/`toLowerCase`) required for Set lookups.
**Action:** While `Set` improves readability over long Regex strings, do not assume it is always faster for small datasets. Always benchmark specific versions of the runtime. However, favor `Set` for maintainability when performance is equivalent.

## 2024-06-03 - [Optimize String Truncation and Multiple Regex Replaces]
**Learning:** For simple string truncation before a character (like `,`), `indexOf` + `substring` is significantly faster than `.includes()` + `.split()[0]`. Additionally, chaining multiple `.replace(/regex/g)` on a string is slower than combining them into a single regex (e.g., `/regex1|regex2/g`) with a replacer function, saving string allocations and multiple passes over the text.
**Action:** Use `indexOf` and `substring` when discarding parts of a string. When formatting text with multiple find-and-replaces, merge them into a single regex and process matches in one pass via a callback.

## 2024-06-03 - [Optimize Date String Formatting]
**Learning:** `Date.toISOString().split('T')[0]` is highly inefficient for generating simple `YYYY-MM-DD` strings. Creating a helper function that uses UTC getters (`getUTCFullYear`, `getUTCMonth`, `getUTCDate`) and simple string concatenation (with inline padding) is ~80% faster in Node.js.
**Action:** Always favor specific date component getters and string concatenation for simple date formats rather than creating, slicing, and allocating multiple arrays and strings via `toISOString` and `split`.
