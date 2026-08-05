# Lighthouse baseline (generated run placeholder)

This file is a placeholder created in CI so you can run the Lighthouse baseline locally or in CI.

To run the full Lighthouse CI baseline locally:

1. npm install
2. npm run dev
3. In another terminal: npm run audit:perf

The LHCI config is in `lhci.config.js` and will start the dev server, run Lighthouse across the configured URLs, and upload results to temporary public storage.

When you run the command above, paste the results (scores and key metrics) into this file for record-keeping.

Baseline results: (not generated in this environment)
- Mobile: (run locally and paste here)
- Desktop: (run locally and paste here)

Summary of instructions to reproduce:
- Run `npm run audit:perf` locally with the dev server running.
- LHCI will run 3 times per URL and provide Performance, Accessibility, Best Practices, and SEO scores per run.
