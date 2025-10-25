# KindleModShelf Agent Guidelines

- **Honor explicit wording.** If the user supplies phrasing for headings, summaries, or sections, keep it verbatim unless they later request a revision.
- **Always update `sitemap.xml`.** Every new page must receive a `<url>` entry with a reasonable `lastmod` timestamp before handing the task back.
- **Re-use existing styling.** Do not introduce new CSS or inline styles unless the user approves it; lean on the shared `style.css` components (cards, section titles, summaries, etc.).
- **Link accuracy matters.** Confirm page-to-page links, external URLs, and Discord channel labels match the sources the user specifies. If something is uncertain, ask instead of guessing.
- **Use descriptive metadata.** Each page should include a meaningful `<title>`, meta description, OG tags, and a canonical link pointing to its final URL.
- **Keep tone consistent.** Write in the site’s concise, guide-first voice, prioritizing actionable steps over fluff.
- **Respect security notes.** When external sources carry risks, add lightweight cautions (e.g., mention when a site may be less secure) if the user calls it out.
- **Summaries over speculation.** Do not add tips, commentary, or sections unless the user asks—stick to the requested structure.
