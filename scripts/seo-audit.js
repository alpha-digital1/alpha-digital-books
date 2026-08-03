#!/usr/bin/env node
// Simple SEO audit: scans dist/ HTML files for common SEO signals and reports missing items.
// Run after building the site (npm run build).

const fs = require('fs');
const path = require('path');

const DIST = path.join(__dirname, '..', 'dist');

function scanFile(file) {
  const content = fs.readFileSync(file, 'utf8');
  const issues = [];
  if(!/\<title\>/i.test(content)) issues.push('Missing <title>');
  if(!/\<meta\s+name=["']description["']/i.test(content)) issues.push('Missing meta description');
  if(!/rel=\"canonical\"/i.test(content) && !/rel=\'canonical\'/i.test(content)) issues.push('Missing canonical link');
  // images without alt
  const imgMatches = content.match(/<img\s+[^>]*src=["'][^"']+["'][^>]*>/gi) || [];
  imgMatches.forEach(img => { if(!/alt=/.test(img)) issues.push('Image missing alt attribute: ' + img.slice(0,60)); });
  return issues;
}

function walk(dir){
  const files = fs.readdirSync(dir);
  const htmlFiles = [];
  files.forEach(f => {
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if(stat.isDirectory()) htmlFiles.push(...walk(full));
    else if(f.endsWith('.html')) htmlFiles.push(full);
  });
  return htmlFiles;
}

const htmlFiles = walk(DIST);
let totalIssues = 0;
htmlFiles.forEach(f => {
  const issues = scanFile(f);
  if(issues.length){
    console.log('\n== ' + path.relative(DIST, f) + ' ==');
    issues.forEach(i => { console.log('- ' + i); totalIssues++; });
  }
});

console.log('\nAudit complete. Total issues: ' + totalIssues);
if(totalIssues > 0) process.exitCode = 2;
