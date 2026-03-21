## 2026-03-24 - [Optimize Array Sort Comparators]
**Learning:** During array sorting (`Array.prototype.sort()`), the comparison function can be called $O(n \log n)$ times. Performing string manipulations like `.toLowerCase()` inside this callback forces the engine to recalculate and allocate new strings for every single comparison.
**Action:** Always pre-compute and store normalized comparison values (like lowercase strings) directly on the target objects before initiating the sort. This reduces the comparison callback to simple O(1) property lookups, eliminating redundant processing and GC overhead.
## 2026-03-24 - [Avoid Sort for Top N]
**Learning:** During array sorting (`Array.prototype.sort()`), finding the highest ranked element triggers an (n \log n)$ sort plus array cloning (`[...events]`) overhead.
**Action:** When you only need the top element based on a comparative value (like `getRankValue`), use an (N)$ reduction loop instead of sorting the entire array.
