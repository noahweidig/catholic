## 2026-02-18 - Dynamic Feedback Accessibility
**Learning:** For dynamic success messages (like 'Link copied!'), visual visibility is not enough. Screen readers ignore them unless they have `role="alert"` or `aria-live`. This is a critical pattern for any copy-to-clipboard interaction.
**Action:** Always add `role="alert"` to success toast messages or notification elements.
