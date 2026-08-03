/* Ensure all templates include alt attributes and aria where appropriate. This file documents the accessibility fixes applied. */
Applied accessibility improvements:
- Added visible focus styles and :focus-visible handling (src/assets/css/a11y.css)
- Added skip link in base layout to jump to main content
- Ensured newsletter forms have visible labels and aria-labels
- Mobile navigation toggle implements aria-expanded and aria-hidden attributes
- Book cover images and author avatars include alt text and width/height
- Included pa11y-ci configuration for automated accessibility testing
