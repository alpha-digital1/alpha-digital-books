### Image optimization & responsive images

This project includes a simple image optimization pipeline that generates AVIF, WebP, and JPEG responsive variants for cover and pin images.

How it works

- The script `scripts/optimize-images.js` scans `src/assets/images/covers/` and `src/assets/images/pins/` for raster images.
- It generates resized images at widths: 320, 480, 720, 1024, 1400 in AVIF, WebP, and JPEG formats.
- Generated images are written to `src/assets/images/generated/...`.
- The script produces `src/_data/image-manifest.json` which maps original image paths (e.g. `/assets/images/covers/cover.jpg`) to `srcset` strings used in templates.

Usage

1. Install dependencies:
   npm install

2. Generate optimized images:
   npm run optimize-images

3. Build the site (the build command runs the optimizer first):
   npm run build

Notes

- The script uses `sharp` for image processing. If you deploy on Netlify, ensure the build environment supports the `sharp` binary (Netlify supports native libs in their builders).
- For a large catalog, you may want to pre-generate images locally and commit `src/assets/images/generated/` to the repository, or run the optimizer in CI as part of your build pipeline.
