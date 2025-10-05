# Kindle Mod Shelf

A community resource for Kindle mods, guides, games, utilities, and customizations.  
Find jailbreak instructions, e-ink apps, and advanced Kindle tweaks—all in one place.

**Visit the site:** [kindlemodshelf.me](https://kindlemodshelf.me)

---

## 📚 What is this?

**Kindle Mod Shelf** is a static website that organizes Kindle homebrew projects, guides, and resources.
You’ll find pages for games, apps, mod tools, image galleries, install guides, and more—all curated and community-friendly.

---

## 🏗️ Adding or Updating Pages

Want to contribute a new mod, guide, or resource page?
**Follow these steps for a clean, consistent addition:**

1. **Copy [`template.html`](template.html)**
   - Use the provided template for all new pages.
   - Fill in sections as needed. Remove unused blocks.
2. **Name your file**
   - Use lowercase, **no hyphens or spaces**, and `.html` (e.g. `modexample.html`).
3. **Update navigation**
   - Add your page link in [`index.html`](index.html) under the correct section.
   - Use a clear label and short summary.
4. **Style changes**
   - Edit only [`style.css`](style.css). **Do not** add page-specific CSS.
   - Check that all other pages still display correctly after changes.
5. **Sitemap**
   - Update [`sitemap.xml`](sitemap.xml) manually if you add or remove pages.
6. **Image manifest**
   - If you add images to the gallery, update [`images.json`](images.json).
7. **Validate**
   - **Check your HTML and CSS yourself** for all affected pages.
8. **Accessibility**
   - Use semantic headings, alt text for images, and clear link labels.

**When you’re ready, open a Pull Request.
You’ll see a checklist—please confirm each item before submitting!**

---

## 📝 Proposing Pages & Reporting Issues

**Do not use GitHub issues.**  
To suggest a new page or report a problem, ping @kindlemodshelfguy (or any maintainer) on the [Kindle Modding Discord](https://dsc.gg/kindle-modding).

---

## 💡 Project Structure

- `index.html` – Homepage and navigation
- `template.html` – Starter file for new pages
- `style.css` – Shared global styles
- `sitemap.xml` – Sitemap for search engines
- `images.json` – Image gallery manifest
- `/downloads/` – Downloadable assets and scripts
- `/images/` – Community screensaver images
- `.github/` – PR template, workflows

---

## 🤝 Community & Conduct

- Be kind, constructive, and respectful.
- For questions, support, or reporting issues, join the [Kindle Modding Discord](https://dsc.gg/kindle-modding) and ping @kindlemodshelfguy.
- See [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md) for details.

---

## ❗ Security and Trust

- **Malicious, spam, or unsafe contributions are absolutely forbidden.**
- All submitted pages and code are subject to review. If anything harmful is found, it will be removed and the contributor may be banned and reported.
- Only contribute original, safe, and helpful content for the Kindle community.

---

## 🙏 Credits

This project is maintained by the Kindle modding community.
Special thanks to all contributors and open-source Kindle tool authors.

---

**Want to suggest a change or add a new project? Ping @kindlemodshelfguy on Discord or start a PR—everyone’s welcome!**