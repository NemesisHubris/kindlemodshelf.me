<!-- Thank you for contributing to Kindle Mod Shelf! Please complete this checklist before submitting your PR. -->

## Description

Describe your changes. What does this PR add or update? Is it a new page, a fix, or an improvement?

<!-- Example: This PR adds a new guide for KOReader custom screensavers. -->

## Contributor Checklist

Please confirm each item before submitting:

- [ ] **File Naming:** All new pages use lowercase, no hyphens or spaces, and `.html` (e.g. `modexample.html`).
- [ ] **Template:** You started from `template.html` and removed any unused sections.
- [ ] **Navigation:** You updated the navigation in `index.html` to include your new page(s). Links should be placed under the correct section, with a clear label and short summary.
- [ ] **CSS:** Any style changes are only in `style.css` (not inside page files). If you changed or added CSS, check that all other pages still display and function correctly. Do **not** make page-specific CSS in new page files—keep all styling global and consistent. (In other words, don't make a page look completely different from the rest of the website)
- [ ] **Sitemap:** You updated `sitemap.xml`
- [ ] **Image Manifest:** If you added new images to the gallery, you updated `images.json` with their details.
- [ ] **Validation:** You validated your HTML and CSS for **all** affected pages (not just the new/changed ones).
- [ ] **No Extra Sections:** You removed any unused template blocks unless your page needs them (e.g. FAQ, emulator-header, etc.).