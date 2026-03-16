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

## 2026-03-06 - Readonly Input Selection
**Learning:** Users often click on `readonly` inputs (like copyable URLs) expecting the text to be selected, but they must manually drag to select the text. Auto-selecting the text on click significantly reduces friction for this common interaction pattern.
**Action:** When creating `readonly` inputs that hold copyable text, add a click event listener that calls `.select()` on the target.

## 2026-03-06 - Redundant Image Alt Text
**Learning:** When an image is inside a link alongside text (like a brand logo next to the brand name), giving the image descriptive `alt` text causes screen readers to read the link text twice (e.g., "Catholic logo Catholic").
**Action:** For decorative or redundant images inside links, set `alt=""` and `aria-hidden="true"` on the image to hide it from screen readers, and place any necessary `aria-label` on the interactive `a` element itself, not on non-interactive wrappers.

## 2026-03-06 - Aria-Modal Dialogs
**Learning:** Providing `role="dialog"` to a custom modal is not enough; without `aria-modal="true"`, screen reader users can inadvertently navigate out of the modal using virtual cursors and interact with the blurred background content, causing confusion and a broken experience.
**Action:** Always include `aria-modal="true"` alongside `role="dialog"` for custom modal overlays.

## 2026-03-08 - OS-Aware Keyboard Shortcut Hints
**Learning:** Hardcoding a Mac-specific keyboard shortcut hint (like "⌘K") in a tooltip alienates Windows and Linux users, who rely on "Ctrl" instead of "Cmd". A good UX must accurately reflect the user's operating system to prevent confusion and frustration.
**Action:** When displaying keyboard shortcuts in tooltips or UI elements, always use JavaScript to detect the user's OS (`navigator.platform` or `navigator.userAgent`) and display the appropriate modifier key (`⌘` for Mac, `Ctrl` for others).

## 2026-03-09 - Summary Elements Focus Visibility
**Learning:** Native `<summary>` elements act as interactive toggles for `<details>` sections and receive keyboard focus, but they are not always included in global `:focus-visible` resets alongside buttons and links. Without explicit CSS for `summary:focus-visible`, keyboard users cannot see when these elements are focused, severely harming accessibility.
**Action:** Always include `summary:focus-visible` in the global focus outline definitions when using native `<details>`/`<summary>` elements for expand/collapse functionality.

## 2024-05-14 - Actionable Search Empty States
**Learning:** Displaying a generic "No results found" message creates a dead-end for users. Empty states should guide the user by explaining why there are no results (e.g., injecting the query string "No results found for 'xyz'") and providing alternative actions or suggestions (e.g., "Try searching for 'Mass', 'Sacraments', or 'Rosary'"). This improves both UX (reduces frustration, keeps users engaged) and accessibility (clear context). Additionally, updating the `aria-live` region with the specific query ensures screen reader users are explicitly informed of what was not found.
**Action:** When designing or modifying search functionality or filtering systems, always implement an empty state that explicitly references the user's input safely to prevent XSS and provides actionable suggestions to help the user recover.

## 2026-03-09 - Search Input Clear Button
**Learning:** For search inputs, especially inside modal dialogs, users often type long queries and need a quick way to clear them without holding backspace. A dedicated "Clear Search" button improves efficiency and recovery from dead-end searches.
**Action:** Always include a conditionally visible "Clear" button (like an 'X' icon) within search input wrappers that clears the value and restores focus to the input.

## 2026-03-11 - Focus Out Accessibility for Custom Menus
**Learning:** For custom dropdown menus and off-canvas navigation that toggle via `aria-expanded` and rely on "click outside" listeners to close, keyboard users can become trapped visually. If a user tabs out of the menu, the menu remains visually open and obscures content, despite the keyboard focus being elsewhere. This severely breaks navigation flow for screen reader and keyboard-only users.
**Action:** Always bind a global `focusin` event listener alongside `click` listeners to ensure that custom dropdowns and mobile menus automatically close when focus moves outside of them.

## 2025-03-11 - Search Modal Close UX Pattern
**Learning:** Sighted and touch users may struggle to intuit how to close modal dialogs if an explicit "Close" button is missing. Using static keyboard hints (like an "ESC" badge) is unhelpful for mobile users.
**Action:** When designing modals with keyboard shortcut hints, convert the hint badge itself into an interactive, dual-purpose `<button>`. Style it with hover states using inline JS (or CSS) to provide tactile feedback without needing new design patterns, and ensure it has an `aria-label` and `title` for screen readers and tooltips. Also, ensure global keyboard event listeners exist to handle `Escape` so focus doesn't become trapped.
## 2024-05-24 - Enhance contrast for search modal text and badges
**Learning:** Text placeholders, keyboard shortcuts, and empty-state texts often use low opacity values (`0.4` or `0.5`) to appear secondary, which fails WCAG AA contrast ratios (4.5:1) against light backgrounds.
**Action:** When designing secondary or hint text, increase opacity to at least `0.8` or `0.85` to ensure adequate contrast while still differentiating it from primary text, or use explicitly defined contrast-compliant text colors.

## 2026-03-12 - Actionable Search Empty States
**Learning:** Users encountering an empty search state experience higher friction when given only static text suggestions. Converting static suggestions into interactive chip-like buttons that automatically populate the search input and focus it provides a much smoother recovery path.
**Action:** When designing empty states for search or filters, provide actionable alternatives (like clickable suggestions or a "clear filters" button) rather than just static text, and ensure the action restores keyboard focus to the input.

## 2026-03-12 - [Focus Cue for Hero Call-to-Action]
**Learning:** [When guiding user attention to a key Call to Action using subtle animations like a pulsing `box-shadow`, it's critical to ensure the animation pauses on user interaction (hover and focus) to avoid conflicting with existing interaction styles, and respects the `prefers-reduced-motion` media query to remain accessible.]
**Action:** [When implementing UI animations for attention guidance, use the Web Animations API conditionally based on `prefers-reduced-motion` and bind `mouseenter`/`mouseleave` and `focus`/`blur` event listeners to control the animation playback state (`play()` / `pause()`).]

## 2026-03-12 - Back to Top Focus Management
**Learning:** Using `window.scrollTo` for a "Back to Top" button visually moves the user to the top of the page, but it does not move the keyboard focus. If a keyboard user presses Tab after clicking "Back to Top", their focus will jump right back to where the button was (or the next element in the DOM), completely breaking their navigation flow.
**Action:** When implementing a "Back to Top" feature, explicitly move focus to the top of the document (e.g., `document.body.setAttribute('tabindex', '-1'); document.body.focus({ preventScroll: true });`) and clean up the `tabindex` on blur to ensure keyboard focus continuity matches the visual state.

## 2026-03-12 - Ensure Contextual Priority in Contrast Enhancements
**Learning:** When attempting to improve contrast, targeting obscure, secondary, or hidden UI elements (like a search result description or a superscript footnote) fails the requirement to pick an "immediately noticeable" target if there are glaring readability issues elsewhere on the main page.
**Action:** Always prioritize elements in the primary viewing area when making contrast enhancements. Do not target obscure, non-existent, or visually hidden CSS classes if there are obvious WCAG violations in the main UI.

## 2026-03-12 - Skip Link Focus Management
**Learning:** When a keyboard user activates a 'Skip to main content' link, visually scrolling to the target element is insufficient. If the target element is not natively focusable (like a `<main>` tag), the keyboard focus remains at the top of the document. When the user presses Tab again, focus continues from the original position, completely negating the skip link's purpose.
**Action:** When implementing skip links, always bind a click event listener that dynamically applies `tabindex="-1"` to the target element, removes any default outline, and explicitly calls `.focus()` on it to properly advance the keyboard focus tree.

## 2026-03-12 - Skip Link Tabindex Cleanup
**Learning:** While applying `tabindex="-1"` to a skip link target allows it to receive programmatic focus, leaving the `tabindex` on the element after it loses focus can cause it to inadvertently trap or receive focus again later through JavaScript interactions or stray mouse clicks, creating an inconsistent keyboard navigation experience.
**Action:** When setting `tabindex="-1"` on an element for temporary focus management (like skip links), always bind a one-time `blur` event listener that immediately calls `removeAttribute('tabindex')` once the user tabs away.
