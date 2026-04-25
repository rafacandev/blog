A static blog webiste where users write full Markdown files that get exported into plain HTML and CSS. Hosted with Github Pages.

## Architecture

Input Layer (`website/`) => Building Pipeline (`nodejs + npm + typescript`) => Oputput Layer (`docs/`)

### Input Layer

* `website/`: website files
* `website/pages/`: various pages, markdown files `.md` and should be converted intto plain HTML `.html` files
* `website/index-template.html`: template file used when generating the index page
* `website/global-template.html`: template file used when converting all `.md` files into `.html` files
* `website/styles.css`: global CSS referenced by `global-template.html`

#### Example

**Input Layer**
```
website/pages/gitahead/README.md
website/pages/gitahead/screenshot.png
website/index-template.html
website/global-template.html
website/styles.css
```

**Output Layerr** _after runninng the building pipeline_
```
docs/pages/gitahead/README.html : converted to html
docs/pages/gitahead/screenshot.png : not converted but kept for reference because is used in docs/pages/gitahead/README.html
docs/index.html : converted from docs/README.md
docs/styles.css : reference by all generated html files
```

## Building Pipeline

The build process transforms `website/` content into static HTML in `docs/`. It runs via Node.js scripts and processes files in the following order:

### Process Steps

1. **Clean** - Empty `docs/` directory before build
2. **Copy static assets** - Non-.md files (images, etc.) pass through to output as-is
3. **Convert Markdown** - Each `.md` file becomes a directory with `index.html`
4. **Generate Index** - Auto-generate the main index page listing all pages sorted by `order`
5. **Copy CSS** - Pass through `styles.css` to output

### URL Structure

The pipeline flattens directory nesting to produce clean URLs:

| Input | Output |
|-------|--------|
| `website/pages/gitahead/README.md` | `docs/gitahead/index.html` |
| `website/pages/gitahead/screenshot.png` | `docs/gitahead/screenshot.png` |

For each subdirectory in `website/pages/{subdir}/`, the `README.md` becomes `docs/{subdir}/index.html`. This allows clean URLs like `/gitahead/` instead of `/gitahead/README.html`.

### Index Page Generation

Auto-generate index listing from all pages:
- Sort by `order` front matter (if present)
- Fall back to alphabetical
- Show title + description

### Template System

Single template using `{{..}}` placehoders for `index-template.html` and `global-index.html`:

**Example**
```html
<main>
  {{content}}
</main>
```

### Front Matter Extraction

Keep YAML front matter optional. If present, extract:
- `title`: Page title
- `description`: Page title
- `order`: Order in the index page

## Scripts

- `npm run build` - runs the build pipeline (unchanged)
- `npm run dev` - runs Vite dev server:
  - Builds first
  - Watches website/** for changes
  - Auto-rebuilds and reloads on changes
  - Opens at http://localhost:3000