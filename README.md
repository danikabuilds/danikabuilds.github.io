# danikasingh.github.io

Personal portfolio of Danika Singh, Business Intelligence & Data Analyst (Cape Town).

Plain HTML, CSS and JavaScript with no build step and no dependencies, served by GitHub Pages.

## Files

```text
index.html        page content
style.css         all styling (colours are CSS variables at the top)
script.js         skills chart data, tabs, count-up tiles, hero sparkles, tooltips
images/hero.webp  hero artwork
resume.pdf        CV linked from the "View CV" button
certs/            certificate PDFs
```

## Editing content

- **Skills chart:** edit the `SKILLS` list at the top of `script.js`.
- **Impact tiles:** change `data-to="..."` on each `.count` in `index.html`.
- **Experience, case files and projects:** edit the matching section in `index.html`.

## Run locally

Use the Live Server extension in VS Code (right-click `index.html` and choose **Open with Live Server**), or run:

```bash
python -m http.server 5500
```

## Publish

```bash
git add .
git commit -m "Update portfolio"
git push
```

GitHub Pages on a free account only serves **public** repositories.
