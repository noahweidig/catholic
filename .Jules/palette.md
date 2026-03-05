## 2026-02-18 - Dynamic Feedback Accessibility
**Learning:** For dynamic success messages (like 'Link copied!'), visual visibility is not enough. Screen readers ignore them unless they have `role="alert"` or `aria-live`. This is a critical pattern for any copy-to-clipboard interaction.
**Action:** Always add `role="alert"` to success toast messages or notification elements.

## 2026-02-20 - Back to Top Button
**Learning:** For long scrolling pages, a "Back to Top" button is a critical navigation aid. Implementing it with `pointer-events: none` when hidden ensures it doesn't block clicks on underlying content, which is a better pattern than `display: none` for smooth transitions.
**Action:** Use `pointer-events: none` + `opacity` for show/hide transitions instead of `display` or `visibility` when possible.

## 2026-02-21 - Print Accessibility for Liturgical Content
**Learning:** Users often need physical copies of liturgical readings for offline use (e.g., in church). Default browser printing includes distracting UI elements (nav, footer) and wastes ink. A clean print layout is a critical accessibility feature for this domain.
**Action:** Always implement a dedicated `@media print` stylesheet that hides navigation/interactive elements and resets the main content container for maximum readability and ink efficiency.

## 2026-02-28 - Focus Visibility
**Learning:** Relying solely on default browser outlines or using `outline: none` (like in the search input) severely impairs keyboard navigation. Using `:focus-visible` globally for interactive elements ensures keyboard accessibility without affecting mouse users. For complex inputs (like search bars with icons), `:focus-within` on the wrapper provides a clean, accessible focus state.
**Action:** Always verify that interactive elements (`a`, `button`, `input`) have distinct `:focus-visible` states defined in the design system. Use `:focus-within` for input wrappers when the input itself has its outline removed.

## 2026-03-01 - Dynamic Client-Side Search Accessibility
**Learning:** For dynamic client-side search interfaces (like a search dialog that filters results as you type), screen readers are blind to the visual updates happening in the results list. It is critical to inject an `aria-live="polite"` region (e.g., `<div class="sr-only" aria-live="polite"></div>`) and update its text content (e.g., "5 results found") to audibly announce the state changes. Additionally, when opening modal dialogs via keyboard shortcuts or buttons, saving `document.activeElement` and restoring focus to it upon closing the dialog is essential for keyboard navigation continuity.
**Action:** Always implement an `aria-live` announcer for dynamic, as-you-type search inputs, and ensure modal dialogs trap/restore focus properly.

## 2026-03-02 - Custom Menu Escape Key Accessibility
**Learning:** Custom dropdown menus and mobile off-canvas navs built with basic DOM manipulation often handle mouse/touch (click outside) but forget keyboard users who need the `Escape` key to dismiss the menu and return focus to the trigger. This is a critical WCAG requirement (WCAG 2.1.1, 1.4.13).
**Action:** Always bind a global or scoped `keydown` listener for `Escape` whenever implementing `aria-expanded` toggle patterns to ensure proper keyboard accessibility and focus management.

## 2026-03-02 - Custom Menu Escape Key Accessibility
**Learning:** Custom dropdown menus and mobile off-canvas navs built with basic DOM manipulation often handle mouse/touch (click outside) but forget keyboard users who need the `Escape` key to dismiss the menu and return focus to the trigger. This is a critical WCAG requirement (WCAG 2.1.1, 1.4.13).
**Action:** Always bind a global or scoped `keydown` listener for `Escape` whenever implementing `aria-expanded` toggle patterns to ensure proper keyboard accessibility and focus management.

## 2026-03-03 - Focusability of visually hidden elements
**Learning:** Relying purely on CSS like `opacity: 0` or `pointer-events: none` hides elements from view and prevents mouse interaction, but leaves them present in the DOM accessibility/focus tree. A keyboard user navigating with `Tab` will unexpectedly focus these "invisible" items, leading to confusion and broken navigation flow.
**Action:** When a focusable element (like a button) is hidden with opacity or transforms, ensure you dynamically apply `tabindex="-1"` and `aria-hidden="true"` via JavaScript to fully remove it from keyboard navigation and screen reader visibility until it is revealed again.

## 2026-03-05 - Modal Background Scrolling
**Learning:** When opening full-screen modal overlays (like a search dialog), users can easily lose their position on the underlying page if they accidentally scroll. This leads to disorientation when closing the modal.
**Action:** When opening a full-screen modal, dynamically set `document.body.style.overflow = 'hidden'` to lock the background content in place, and restore it to `''` when the modal is closed.

## 2026-03-05 - Icon-Only Tooltips
**Learning:** While `aria-label` ensures screen readers can understand icon-only buttons, sighted users who may not instantly recognize an icon's meaning are left guessing unless there is a visible tooltip.
**Action:** For icon-only buttons (like a theme toggle or back-to-top button), always mirror the `aria-label` text to a `title` attribute so sighted mouse users get helpful context on hover.
