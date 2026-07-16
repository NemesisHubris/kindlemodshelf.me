#!/usr/bin/env node
'use strict';

const fs   = require('fs');
const path = require('path');

// The redesign is now the main site: pages live directly in public/.
const redesignDir  = path.join(__dirname, 'public');
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

// Remove shells whose .md was deleted.
// Now that pages live directly in public/ alongside hand-written pages
// (editor.html, history.html, …), only ever delete a file that is byte-for-byte
// identical to the generated template — i.e. a genuine auto-generated shell.
// Hand-written pages never match the template, so they can never be removed.
for (const file of fs.readdirSync(redesignDir)) {
  if (!file.endsWith('.html')) continue;
  const slug = path.basename(file, '.html');
  if (PROTECTED.has(file) || mdSlugs.has(slug)) continue;
  const full = path.join(redesignDir, file);
  if (fs.readFileSync(full, 'utf8') !== template) continue; // not a generated shell — leave it
  fs.unlinkSync(full);
  console.log(`  - removed orphaned ${file}`);
  removed++;
}

// Write pages manifest for the page builder's "Browse" feature
const pagesJson = JSON.stringify([...mdSlugs].sort());
fs.writeFileSync(path.join(contentDir, 'pages.json'), pagesJson);

// Generate rss.xml from content/announcements.md
const SITE_URL = 'https://kindlemodshelf.me';
const announcementsPath = path.join(contentDir, 'announcements.md');
let rssItems = 0;
if (fs.existsSync(announcementsPath)) {
  rssItems = generateRss(announcementsPath, path.join(redesignDir, 'rss.xml'));
}

console.log(`\nBuild done: ${created} page(s) written, ${removed} removed. Image manifests: ${manifests}. RSS items: ${rssItems}.`);

// ── RSS feed generation ─────────────────────────────────────────────────
// announcements.md has no consistent per-entry format (dates show up as
// MM/DD/YYYY, "Month YYYY", a "(posts on YYYY-MM-DD)" aside, or not at all),
// so entries are parsed permissively and undated ones get a synthetic date
// interpolated from the nearest dated neighbor above them, decreasing by a
// day per consecutive undated entry, to preserve the file's newest-first order.
function generateRss(mdPath, outPath) {
  const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december'];

  const raw = fs.readFileSync(mdPath, 'utf8');

  const titleMatch = raw.match(/^#\s+(.+)$/m);
  const descMatch  = raw.match(/^>\s*(.+)$/m);
  const feedTitle  = titleMatch ? titleMatch[1].trim() : 'Announcements';
  const feedDesc   = descMatch ? descMatch[1].trim() : '';

  // Drop everything up to (and including) the "## Latest Updates" heading,
  // leaving just the entries, still separated by "---" lines.
  const bodyStart = raw.search(/^##\s+.+$/m);
  const body = bodyStart === -1 ? raw : raw.slice(raw.indexOf('\n', bodyStart) + 1);

  const blocks = body.split(/^---$/m).map(b => b.trim()).filter(Boolean);

  let cursor = new Date();
  const items = [];

  for (const block of blocks) {
    const lines = block.split('\n');
    let title = lines.shift().trim();
    const contentBody = lines.join('\n').trim();

    let date = null;

    // MM/DD/YYYY — Title
    let m = title.match(/^(\d{2})\/(\d{2})\/(\d{4})\s*[—–-]\s*(.+)$/);
    if (m) {
      date = new Date(Date.UTC(+m[3], +m[1] - 1, +m[2], 12));
      title = m[4].trim();
    }

    // Title (posts on YYYY-MM-DD)
    if (!date) {
      m = title.match(/^(.+?)\s*\(posts on (\d{4})-(\d{2})-(\d{2})\)$/);
      if (m) {
        date = new Date(Date.UTC(+m[2], +m[3] - 1, +m[4], 12));
        title = m[1].trim();
      }
    }

    // "Late Month YYYY — Title" / "Month YYYY — Title"
    if (!date) {
      m = title.match(/^(Late\s+)?([A-Za-z]+)\s+(\d{4})\s*[—–-]\s*(.+)$/);
      if (m && MONTHS.includes(m[2].toLowerCase())) {
        const day = m[1] ? 20 : 1;
        date = new Date(Date.UTC(+m[3], MONTHS.indexOf(m[2].toLowerCase()), day, 12));
        title = m[4].trim();
      }
    }

    if (date) {
      cursor = date;
    } else {
      date = new Date(cursor.getTime() - 24 * 60 * 60 * 1000);
      cursor = date;
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    items.push({
      title,
      date,
      guid: `${SITE_URL}/announcements.html#${slug || items.length}`,
      html: mdBlockToHtml(contentBody),
    });
  }

  const now = new Date().toUTCString();
  const itemsXml = items.map(item => `
  <item>
    <title>${xmlEscape(item.title)}</title>
    <link>${SITE_URL}/announcements.html</link>
    <guid isPermaLink="false">${xmlEscape(item.guid)}</guid>
    <pubDate>${item.date.toUTCString()}</pubDate>
    <description><![CDATA[${item.html.replace(/]]>/g, ']]&gt;')}]]></description>
  </item>`).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>${xmlEscape(feedTitle)}</title>
  <link>${SITE_URL}/announcements.html</link>
  <description>${xmlEscape(feedDesc)}</description>
  <language>en-us</language>
  <lastBuildDate>${now}</lastBuildDate>${itemsXml}
</channel>
</rss>
`;

  fs.writeFileSync(outPath, xml);
  return items.length;
}

// Minimal markdown → HTML for RSS item descriptions: paragraphs, bullet
// lists, headings, bold, inline code, links, and bare <url> autolinks.
function mdBlockToHtml(md) {
  const blocks = md.split(/\n\s*\n/).map(b => b.trim()).filter(Boolean);
  return blocks.map(block => {
    const lines = block.split('\n');

    if (lines.every(l => /^\s*-\s+/.test(l))) {
      const items = lines.map(l => `<li>${inline(l.replace(/^\s*-\s+/, ''))}</li>`).join('');
      return `<ul>${items}</ul>`;
    }

    const heading = block.match(/^(#{2,4})\s+(.+)$/);
    if (heading) {
      return `<h4>${inline(heading[2])}</h4>`;
    }

    const autolink = block.match(/^<(https?:\/\/[^\s>]+)>$/);
    if (autolink) {
      return `<p><a href="${autolink[1]}">${autolink[1]}</a></p>`;
    }

    return `<p>${inline(block.replace(/\n/g, ' '))}</p>`;
  }).join('\n');
}

function inline(text) {
  return text
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) => `<a href="${resolveUrl(href)}">${label}</a>`)
    .replace(/<(https?:\/\/[^\s>]+)>/g, '<a href="$1">$1</a>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}

// Entry bodies link with paths relative to announcements.html (e.g.
// "recommendations.html", "../downloads/x.zip"); resolve those to absolute
// URLs since a feed reader has no page context to resolve them against.
function resolveUrl(href) {
  if (/^(https?:|mailto:)/i.test(href)) return href;
  return new URL(href, `${SITE_URL}/announcements.html`).toString();
}

function xmlEscape(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
