#!/usr/bin/env node
/* Image optimization pipeline
 - Scans src/assets/images/covers and src/assets/images/pins
 - Generates AVIF, WebP, and JPEG resized variants for a set of widths
 - Writes files to src/assets/images/generated/
 - Produces src/_data/image-manifest.json mapping original paths to srcset strings

Usage: node scripts/optimize-images.js
*/

const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');

const INPUT_DIRS = [
  path.join(__dirname, '..', 'src', 'assets', 'images', 'covers'),
  path.join(__dirname, '..', 'src', 'assets', 'images', 'pins')
];
const OUTPUT_DIR = path.join(__dirname, '..', 'src', 'assets', 'images', 'generated');
const MANIFEST_PATH = path.join(__dirname, '..', 'src', '_data', 'image-manifest.json');
const WIDTHS = [320, 480, 720, 1024, 1400];

async function ensureDir(dir){
  await fs.mkdir(dir, { recursive: true });
}

function isRaster(filename){
  const ext = path.extname(filename).toLowerCase();
  return ['.jpg','.jpeg','.png','.webp','.tif','.tiff'].includes(ext);
}

async function processFile(inputPath, relWebPath){
  const name = path.basename(inputPath, path.extname(inputPath));
  const outBase = path.join(OUTPUT_DIR, path.dirname(relWebPath));
  await ensureDir(outBase);

  const entry = { avif: [], webp: [], jpg: [], fallback: relWebPath };

  for(const w of WIDTHS){
    try{
      const outAvif = path.join(outBase, `${name}-${w}.avif`);
      const outWebp = path.join(outBase, `${name}-${w}.webp`);
      const outJpg = path.join(outBase, `${name}-${w}.jpg`);

      await sharp(inputPath).resize({ width: w }).avif({ quality: 60 }).toFile(outAvif);
      await sharp(inputPath).resize({ width: w }).webp({ quality: 75 }).toFile(outWebp);
      await sharp(inputPath).resize({ width: w }).jpeg({ quality: 80 }).toFile(outJpg);

      // Record web paths (relative to site root)
      const webAvif = path.posix.join('/assets/images/generated', path.dirname(relWebPath), `${name}-${w}.avif`);
      const webWebp = path.posix.join('/assets/images/generated', path.dirname(relWebPath), `${name}-${w}.webp`);
      const webJpg = path.posix.join('/assets/images/generated', path.dirname(relWebPath), `${name}-${w}.jpg`);

      entry.avif.push(`${webAvif} ${w}w`);
      entry.webp.push(`${webWebp} ${w}w`);
      entry.jpg.push(`${webJpg} ${w}w`);

      // Set fallback to the smallest generated jpg as a sensible default
      if(!entry.fallback || entry.fallback === relWebPath) entry.fallback = webJpg;

      console.log(`Generated: ${outWebp}`);
    }catch(err){
      console.error('Error processing', inputPath, err.message);
    }
  }

  // Build srcset strings
  return {
    avif_srcset: entry.avif.join(', '),
    webp_srcset: entry.webp.join(', '),
    jpg_srcset: entry.jpg.join(', '),
    fallback: entry.fallback
  };
}

async function buildManifest(){
  await ensureDir(OUTPUT_DIR);
  const manifest = {};

  for(const dir of INPUT_DIRS){
    try{
      const items = await fs.readdir(dir, { withFileTypes: true });
      for(const it of items){
        if(it.isFile() && isRaster(it.name)){
          const inputPath = path.join(dir, it.name);
          // relative web path like assets/images/covers/filename.ext
          const relWebPath = path.posix.join('assets','images', path.basename(dir), it.name);
          const result = await processFile(inputPath, relWebPath);
          // key should match the cover_image path used in books.json (which starts with /assets/...)
          manifest['/' + relWebPath] = result;
        }
      }
    }catch(err){
      // ignore missing dirs
    }
  }

  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf8');
  console.log('Wrote manifest:', MANIFEST_PATH);
}

buildManifest().catch(err => { console.error(err); process.exit(1); });
