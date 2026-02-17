## 2024-05-24 - [Avoid Library Overhead for Simple Dates]
**Learning:** `romcal.generateCalendar(year)` generates the full year's liturgical calendar (365+ events), which is extremely expensive when you only need a single movable feast date like Ascension Thursday.
**Action:** For specific movable feasts, implement the standard algorithm (e.g., Meeus/Jones/Butcher for Easter) instead of generating the entire calendar.
