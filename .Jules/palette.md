## 2026-02-18 - Dynamic Feedback Accessibility
**Learning:** For dynamic success messages (like 'Link copied!'), visual visibility is not enough. Screen readers ignore them unless they have `role="alert"` or `aria-live`. This is a critical pattern for any copy-to-clipboard interaction.
**Action:** Always add `role="alert"` to success toast messages or notification elements.

## 2026-02-20 - Back to Top Button
**Learning:** For long scrolling pages, a "Back to Top" button is a critical navigation aid. Implementing it with `pointer-events: none` when hidden ensures it doesn't block clicks on underlying content, which is a better pattern than `display: none` for smooth transitions.
**Action:** Use `pointer-events: none` + `opacity` for show/hide transitions instead of `display` or `visibility` when possible.

## 2026-02-21 - Print Accessibility for Liturgical Content
**Learning:** Users often need physical copies of liturgical readings for offline use (e.g., in church). Default browser printing includes distracting UI elements (nav, footer) and wastes ink. A clean print layout is a critical accessibility feature for this domain.
**Action:** Always implement a dedicated `@media print` stylesheet that hides navigation/interactive elements and resets the main content container for maximum readability and ink efficiency.
