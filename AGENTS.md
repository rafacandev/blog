A static blog webiste where users write full Markdown files that get exported into plain HTML and CSS. Hosted with Github Pages.

## Architecture

Input Layer (`website/`) => Building Pipeline (`src/generate.ts`) => Output Layer (`public/`)

### Input Layer

* `website/`: website files
* `website/pages/`: various pages, markdown files `.md` and should be converted intto plain HTML `.html` files
* `website/index-template.html`: template file used when generating the index page
* `website/global-template.html`: template file used when converting all `.md` files into `.html` files
* `website/styles.css`: global CSS referenced by `global-template.html`

#### Example

**Input Layer**
```
website/index-template.html
website/pages/gitahead/README.md
website/pages/gitahead/screenshot.png
website/global-template.html
website/styles.css
```

**Output Layer** _after running the building pipeline_
```
index.html : index page generated from all pages
public/gitahead/index.html : converted from website/pages/gitahead/README.md
public/gitahead/screenshot.png : not converted but kept for reference because is used in public/gitahead/index.html
public/styles.css : reference by all generated html files
```

## Building Pipeline

The build process transforms `website/` content into static HTML in `public/` and root `index.html`. It runs via Node.js scripts and processes files in the following order:

### Process Steps

1. **Clean** - Empty `public/` directory before build
2. **Copy static assets** - Non-.md files (images, etc.) pass through to output as-is
3. **Convert Markdown** - Each `.md` file (README.md, index.md, or _index.md) becomes a directory with `index.html`
4. **Generate Index** - Auto-generate the main index page listing all pages sorted by `order`
5. **Copy CSS** - Pass through `styles.css` to output

### URL Structure

The pipeline flattens directory nesting to produce clean URLs:

| Input | Output |
|-------|--------|
| `website/pages/README.md` | `public/index.html` |
| `website/pages/gitahead/README.md` | `public/gitahead/index.html` |
| `website/pages/gitahead/screenshot.png` | `public/gitahead/screenshot.png` |

For each subdirectory in `website/pages/{subdir}/`, the `README.md` becomes `public/{subdir}/index.html`. This allows clean URLs like `/gitahead/` instead of `/gitahead/README.html`.

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
- `npm run dev` - runs dev server:
  - Opens at http://localhost:3000

## Run and Kill

Use timeout if you want to run a command for a short period of time and kill it imediately after. Useful when trying to `npm run dev` for a quick test.

```bash
# Run 'npm run dev' for 10 seconds and force kill after subsenquent 5 seconds
timeout -k 5s 10s npm run dev
```