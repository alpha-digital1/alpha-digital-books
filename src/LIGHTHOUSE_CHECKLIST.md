# Lighthouse & Core Web Vitals checklist

This checklist documents the key optimizations applied and the remaining items to reach a Lighthouse score >= 90 for both mobile and desktop.

Completed
- Inlined critical CSS for header & hero to reduce render-blocking CSS.
- Preloaded hero image and preconnected to Google Fonts.
- Deferred main stylesheet using rel=preload with onload swap and noscript fallback.
- Search JS is lazy-loaded (Fuse.js loads only on first use).
- All book and hero images include width/height and loading="lazy" attributes where applicable.

To do (next commits)
- Generate responsive images (AVIF/WebP/JPEG) and commit generated images (optimize-images script added).
- Preload the largest hero/featured images where appropriate using rel=preload as="image".
- Inline critical CSS per key pages (e.g., book pages hero) if needed to improve LCP.
- Ensure fonts are loaded efficiently; consider self-hosting critical variable fonts for best performance.
- Run Lighthouse and iterate on FCP/LCP/CLS/INP specific issues.

How to measure
- Run Lighthouse in Chrome DevTools (or use the lighthouse CI). Aim for 90+ on Performance and Accessibility.
