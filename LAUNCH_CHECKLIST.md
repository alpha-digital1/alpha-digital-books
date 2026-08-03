# Launch Checklist

This checklist covers performance, SEO, accessibility, structured data, forms, and deployment checks to run before launching the site.

1. Performance
- Run Lighthouse (mobile & desktop) and confirm Performance >= 90.
- Confirm LCP image is preloaded and served in AVIF/WebP for most browsers.
- Confirm generated images are in src/assets/images/generated/ and served with long cache TTLs.
- Ensure CSS is critical/inlined for hero and header; non-critical CSS deferred.
- Ensure scripts are deferred or lazy-loaded (search is lazy-loaded).

2. SEO
- Every page has a unique <title> and meta description.
- Canonical tags present and correct.
- Sitemap is generated at /sitemap.xml and referenced in robots.txt.
- RSS feed available at /rss.xml.
- Structured data (JSON-LD) present for Books and Articles.

3. Accessibility
- Run axe or Lighthouse accessibility checks and resolve critical issues.
- Keyboard navigation works (skip link, search overlay, focus states).
- Images have alt text, form fields have labels, semantic headings used.

4. Functionality
- Search overlay works and results return expected items.
- Newsletter form endpoint configured and test submission works (Formspree or your provider).
- Buy on Amazon links open in a new tab and affiliate tag (when set) appends correctly.

5. Deployment
- Netlify build command: npm run build
- Publish directory: dist/
- Add environment variables / secrets (if any).
- Verify _headers and _redirects on Netlify.

6. Final QA
- Spot-check sample pages on mobile and desktop.
- Run full site crawl (Screaming Frog or similar) for broken links, orphan pages, and duplicated metadata.
- Validate JSON-LD with Google's Rich Results Test.

7. Post-launch
- Monitor Core Web Vitals via CrUX and Google Search Console.
- Monitor errors and 404s in Netlify logs.
