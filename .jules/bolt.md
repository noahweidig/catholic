## 2024-05-24 - [Avoid Library Overhead for Simple Dates]
**Learning:** `romcal.generateCalendar(year)` generates the full year's liturgical calendar (365+ events), which is extremely expensive when you only need a single movable feast date like Ascension Thursday.
**Action:** For specific movable feasts, implement the standard algorithm (e.g., Meeus/Jones/Butcher for Easter) instead of generating the entire calendar.

## 2024-05-24 - [Avoid setTimeout for Scroll Events]
**Learning:** Using `setTimeout` to throttle scroll events (e.g., waiting 450ms) for sticky header transitions makes the UI feel unresponsive and "laggy".
**Action:** Replace `setTimeout` throttling with `requestAnimationFrame` and a hysteresis threshold (e.g., >80px on scroll down, <15px on scroll up) to decouple UI updates from scroll frequency without introducing noticeable delays.
