# Mahesh Reddy Remala — portfolio

The site at **docs/** is the whole website: plain HTML, CSS and JavaScript, no
build step needed to host it. Point any static host at `docs/` and it works.

## Hosting (GitHub Pages)

Settings -> Pages -> Source: **Deploy from a branch**, branch `main`, folder `/docs`.
No build step, no Actions. `.nojekyll` keeps Pages from reprocessing the files.
- No environment variables, no install step.

`docs/404.html` is picked up automatically as the not-found page.

## What is in here

```
docs/          the built website — this is what gets published
  index.html   home
  work.html    work, with the four case studies under work/
  about.html   about
  thoughts.html
  playground.html
  404.html
  assets/      every image, plus the grain texture and the scroll library
  vendor/      React and the design runtime the pages are built on

src/           the source the pages are generated from
  parts/       the pieces each page is assembled out of
  project/     the assembled pages (.dc.html), the input to the export
  build.js     parts/  -> project/
  export.js    project/ -> docs/
  assets/      original image files
```

## Changing the site

Content and layout live in `src/parts/`. After an edit:

```bash
cd src
node build.js     # rebuild the pages
node export.js    # rebuild docs/
```

Then commit and push — the host republishes on its own.

To preview `docs/` locally before pushing:

```bash
npx serve dist
```

## Notes

- Pages carry their own runtime in `docs/vendor/`, so nothing is fetched from a
  third party at view time and the site keeps working offline.
- The light/dark choice is remembered in the browser and shared between open
  pages; it is never sent anywhere.
- The contact links are `mailto:` — there is no form and no server.
