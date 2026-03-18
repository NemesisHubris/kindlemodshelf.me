# Community Images & Content

Last Updated: January 14, 2026

---

## About KindleModShelf.me

The goal of KindleModShelf is to highlight the great work done by the community that for over a decade has been jailbreaking Kindles, and make this material easy to access on one site instead of needing to find it all yourself - accessible to everyone!

---

## About These Images

All images in the gallery were collected from the Kindle Modding Discord (a public Discord server available to everyone), with a few exceptions that were directly submitted by users.

We do NOT own this content and CANNOT give you permission to use it.

We credit creators by including usernames/handles when known.

---

## Adding Your Own Images Through GitHub

If you want to add your own gallery images yourself, use a GitHub pull request.

### How the Gallery Works

The gallery is built from two things:

- image files stored in `public/images/<author-name>/`
- the index file `public/images.json`

`public/images.html` loads `public/images.json`, and `public/images-gallery.js` turns that into the gallery view.

The JSON format is simple:

```json
{
  "author-name": [
    "image1.png",
    "image2.jpg"
  ]
}
```

Each top-level key is an author name, and each value is a list of filenames inside that author's folder.

### What to Add

To add your own images:

1. Create a folder in `public/images/` using the name you want credited under
2. Put your image files in that folder
3. Add or update that author entry in `public/images.json`
4. Open a pull request

Example:

- folder: `public/images/yourname/`
- files:
  - `public/images/yourname/example-1.png`
  - `public/images/yourname/example-2.jpg`
- JSON entry:

```json
"yourname": [
  "example-1.png",
  "example-2.jpg"
]
```


### Important Rules

- only add images you made yourself, or have permission to share
- keep images inside a single author folder
- make sure filenames in `public/images.json` exactly match the real files
- do not add nested folders inside an author folder if you want them to appear in the gallery

### If You Do Not Want To Use GitHub

You can still send images directly:

- Email: `admin@kindlemodshelf.me`
- Discord: `@kindlemodshelfguy`

Include your credited name and images.

---

## Why We Host Them

10+ years of Kindle modding knowledge is disappearing:
- Discord deletes old messages
- Forums shut down
- Image hosts expire
- Creators go inactive

We're preserving this before it's lost forever.

---

## Legal Status

We don't have explicit permission from every creator.

We host this because:
- It was posted publicly in the Kindle Modding Discord (a public server)
- It has educational and historical value
- No commercial market is being harmed
- We credit creators where known
- We remove content on request

This is archival preservation, not commercial exploitation.

---

## If You're a Creator

Want your content removed?

Email: admin@kindlemodshelf.me
Subject: "Image Removal Request"

Provide the name you're credited under. We'll remove your content and add your name to our list of creators whose work should not be scraped in the future.

This is a community-led project. Response times vary, but we'll try to get back to you within 30 days.

---

Want to update your credited name or provide better versions? Email us.

---

## Contact

admin@kindlemodshelf.me
Discord: @kindlemodshelfguy
https://kindlemodshelf.me

This is a community-led project. Response times vary, but we'll try to get back to you within 30 days.
