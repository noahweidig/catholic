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

## 2026-03-01 - [Optimize Simple YYYY-MM-DD Date Formatting]
**Learning:** Using `.toISOString().split('T')[0]` to format dates into YYYY-MM-DD allocates multiple temporary strings (the full ISO string, the array, and its isolated elements). In loops, such as when parsing or generating multiple calendar events, this causes measurable GC overhead and slows down execution.
**Action:** To maximize performance when formatting dates as YYYY-MM-DD in JavaScript, use standard UTC getters (`getUTCFullYear`, `getUTCMonth`, `getUTCDate`) combined with simple string concatenation.

## 2026-03-02 - [Optimize Large String Word Counting]
**Learning:** For large blocks of text (like entire webpage main contents), using `.trim().split(/\s+/).length` to count words forces the engine to allocate an array of thousands of individual word strings, causing massive GC overhead and slow execution times.
**Action:** Always count words in large text by iterating characters and toggling a boolean `inWord` flag (checking for space, tab, newline, return character codes). This achieves the same count in O(n) time with zero allocations.

## 2026-03-03 - [Optimize File Reading Memory Overhead]
**Learning:** Using `f.readlines()` in Python reads the entire file content into a massive array of strings in memory. For large text files (like generated `.ics` liturgical calendars), this causes significant memory allocation overhead and Garbage Collection spikes.
**Action:** Always iterate directly over the file object (`for line in f:`) when reading files line-by-line. This approaches the task efficiently in an iterative O(1) memory footprint without loading the entire contents at once.

## 2026-03-04 - [Batch DOM Insertions with DocumentFragment]
**Learning:** Appending elements directly to a live DOM node inside a loop (like rendering search results on every keystroke) causes layout thrashing and unnecessary repaints, degrading performance.
**Action:** Always batch DOM insertions by creating a `DocumentFragment`, appending elements to the fragment within the loop, and appending the fragment to the live DOM once.

## 2026-03-05 - [Optimize Rigid Format String Manipulation]
**Learning:** For rigid strings like dates formatted as YYYY-MM-DD, using `substring` to selectively copy parts of the string (e.g. `str.substring(0, 4) + str.substring(5, 7) + str.substring(8, 10)`) is roughly 100x faster than `.replace(/-/g, '')`. Regex replacement introduces engine overhead and creates intermediate string allocations.
**Action:** When removing characters at known indices from strings with guaranteed, rigid formats, strictly use `substring` concatenation over `.replace()`.

## 2026-03-06 - [Batch DOM Reads and Writes in Scroll Handlers]
**Learning:** Having multiple `window.addEventListener('scroll')` handlers, each with its own `requestAnimationFrame`, causes DOM reads (like `window.scrollY`) and DOM writes (like `.classList.add()`) to interleave. This "layout thrashing" forces the browser to synchronously recalculate layout multiple times per frame, drastically degrading scroll performance and increasing memory overhead.
**Action:** Always combine scroll-dependent UI updates into a single unified `requestAnimationFrame` loop. Structure the loop to explicitly batch all DOM reads first, followed by all DOM writes, ensuring layout is only calculated once per frame.
