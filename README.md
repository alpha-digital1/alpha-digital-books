# Alpha Digital — Eleventy site (site/v2)

This branch contains a new Eleventy-based site skeleton and data-driven architecture to power a scalable Amazon KDP marketing website.

Quick start (local):

1. Install dependencies

   npm install

2. Run dev server

   npm run dev

Build for production:

   npm run build

Project structure (src):

- src/_data/books.json  — central books data (single source of truth)
- src/_includes/        — partials and layouts
- src/index.njk         — homepage
- src/privacy.njk, src/terms.njk, src/disclosure.njk, src/404.njk

Next steps: add assets (CSS, JS, images), implement book templates, search index, and image optimization pipeline. I will push incremental commits to this branch as I complete each feature so you can review progress and provide feedback.
