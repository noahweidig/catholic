## 2024-05-24 - [Avoid Library Overhead for Simple Dates]
**Learning:** `romcal.generateCalendar(year)` generates the full year's liturgical calendar (365+ events), which is extremely expensive when you only need a single movable feast date like Ascension Thursday.
**Action:** For specific movable feasts, implement the standard algorithm (e.g., Meeus/Jones/Butcher for Easter) instead of generating the entire calendar.

## 2024-05-24 - [Avoid setTimeout for Scroll Events]
**Learning:** Using `setTimeout` to throttle scroll events (e.g., waiting 450ms) for sticky header transitions makes the UI feel unresponsive and "laggy".
**Action:** Replace `setTimeout` throttling with `requestAnimationFrame` and a hysteresis threshold (e.g., >80px on scroll down, <15px on scroll up) to decouple UI updates from scroll frequency without introducing noticeable delays.

## 2024-05-24 - [Regex vs Set Lookup Overhead]
**Learning:** Replacing a long Regex alternation (O(m)) with a `Set` lookup (O(1)) for case-insensitive keyword matching in Node.js v22 yielded negligible performance gains (~1.01x) due to the highly optimized nature of the V8 Regex engine and the overhead of string allocations (`toUpperCase`/`toLowerCase`) required for Set lookups.
**Action:** While `Set` improves readability over long Regex strings, do not assume it is always faster for small datasets. Always benchmark specific versions of the runtime. However, favor `Set` for maintainability when performance is equivalent.
