# Alpha Digital Books — Static Site

This repository now contains a lightweight, mobile-first static website optimized for SEO and driving traffic to Amazon KDP book pages.

What I added (initial):

- index.html — Home (hero, featured books, newsletter signup placeholder)
- books.html — Books listing
- books/book-1.html, book-2.html, book-3.html — Individual book pages (placeholders)
- blog/index.html and blog/post-example.html — Blog index + example post
- about.html, contact.html — About and contact pages (Formspree placeholders)
- assets/css/style.css — Mobile-first, minimal stylesheet
- assets/js/main.js — Small JS for nav toggle and footer year
- assets/images/* — simple SVG placeholder logo and book cover SVGs
- sitemap.xml, robots.txt, rss.xml

Instructions & next steps

1. Replace placeholder images
   - Put real book covers in assets/images and update the image paths in books pages.

2. Replace Formspree endpoints
   - Update form action attributes in index.html and contact.html with your Formspree URL or your email provider endpoint.

3. Update book pages
   - Edit files in /books/ to add correct title, author, description, and Amazon buy links (replace "#" with your affiliate/ASIN URL).
   - For structured data, update the JSON-LD block in each book page with accurate metadata (ISBN/ASIN, dates).

4. Add blog posts
   - Add new files under /blog/ (e.g., post-title.html). Use H1 and meta description for SEO. Consider using a simple templating workflow if you plan many posts.

5. Deploy
   - GitHub Pages: enable Pages in repo settings (serve from main branch / root). Your site will be at https://alpha-digital1.github.io/alpha-digital-books/
   - Netlify: drag & drop the repo or connect via Git; set build settings (none required for static files).

6. SEO & analytics
   - Add Google Analytics / Plausible snippets to assets/js/main.js or directly in templates.
   - Consider adding canonical tags and optimizing meta descriptions per page.

If you want, I can:
- Add more book pages from a list (if you provide titles/ASINs/covers).
- Convert the blog to a Markdown-based workflow (Jekyll/Hugo) so you can write posts as .md files.
- Create a deploy workflow or PR for changes.

