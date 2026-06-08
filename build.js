#!/usr/bin/env node
'use strict';

const fs   = require('fs');
const path = require('path');

const redesignDir  = path.join(__dirname, 'public', 'redesign');
const contentDir   = path.join(redesignDir, 'content');
const pageImagesDir = path.join(__dirname, 'public', 'page_images');
const templatePath = path.join(redesignDir, 'page.html');
const template     = fs.readFileSync(templatePath, 'utf8');

const IMAGE_EXTS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp']);
const SKIP_DIRS  = new Set(['organized', 'moved', 'duplicates', '_discord_review_trash', '_unmatched']);

// Never auto-delete these
const PROTECTED = new Set(['index.html', 'page.html', '404.html', 'imageeditor.html', 'images.html', 'pagebuilder.html']);

// Collect slugs from every .md in content/
const mdSlugs = new Set(
  fs.readdirSync(contentDir)
    .filter(f => f.endsWith('.md'))
    .map(f => path.basename(f, '.md'))
);

// Build image manifest: slug → ["/page_images/<cat>/<slug>/file", ...]
const imageManifest = {};
for (const cat of fs.readdirSync(pageImagesDir)) {
  if (SKIP_DIRS.has(cat)) continue;
  const catPath = path.join(pageImagesDir, cat);
  if (!fs.statSync(catPath).isDirectory()) continue;
  for (const entry of fs.readdirSync(catPath)) {
    const entryPath = path.join(catPath, entry);
    if (!fs.statSync(entryPath).isDirectory()) continue;
    // entry is a page slug subfolder
    const slug = entry;
    const files = fs.readdirSync(entryPath)
      .filter(f => IMAGE_EXTS.has(path.extname(f).toLowerCase()))
      .sort()
      .map(f => `/page_images/${cat}/${slug}/${f}`);
    if (files.length > 0) {
      imageManifest[slug] = (imageManifest[slug] || []).concat(files);
    }
  }
}

// Write per-page image manifests to content/<slug>.images.json
let manifests = 0;
for (const [slug, images] of Object.entries(imageManifest)) {
  const dest = path.join(contentDir, `${slug}.images.json`);
  fs.writeFileSync(dest, JSON.stringify(images));
  manifests++;
}
// Remove stale manifests for pages that no longer have images
for (const file of fs.readdirSync(contentDir)) {
  if (!file.endsWith('.images.json')) continue;
  const slug = file.replace('.images.json', '');
  if (!imageManifest[slug]) {
    fs.unlinkSync(path.join(contentDir, file));
  }
}

let created = 0;
let removed = 0;

// Write a shell for every content page (always in sync with page.html template)
for (const slug of mdSlugs) {
  const dest = path.join(redesignDir, `${slug}.html`);
  fs.writeFileSync(dest, template);
  console.log(`  + ${slug}.html`);
  created++;
}

// Remove shells whose .md was deleted
for (const file of fs.readdirSync(redesignDir)) {
  if (!file.endsWith('.html')) continue;
  const slug = path.basename(file, '.html');
  if (!PROTECTED.has(file) && !mdSlugs.has(slug)) {
    fs.unlinkSync(path.join(redesignDir, file));
    console.log(`  - removed orphaned ${file}`);
    removed++;
  }
}

// Write pages manifest for the page builder's "Browse" feature
const pagesJson = JSON.stringify([...mdSlugs].sort());
fs.writeFileSync(path.join(contentDir, 'pages.json'), pagesJson);

console.log(`\nBuild done: ${created} page(s) written, ${removed} removed. Image manifests: ${manifests}.`);
