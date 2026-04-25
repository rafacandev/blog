k# New Website System Design

## Overview

A static blog system where users write full Markdown files that get exported into plain HTML and CSS. This document outlines the tech stack and architecture for building and migrating the current Jekyll-based blog to a custom static site generator.

## Problem Statement

Current system uses Jekyll with GitHub Pages Midnight theme. Issues:
- Jekyll dependency required for local preview
- Theme is tightly coupled to Jekyll infrastructure
- Limited control over styling and rendering
- Build-time dependence on Ruby ecosystem

## Proposed Tech Stack

### Core Technologies

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Markdown Parser | [markdown-it](https://github.com/markdown-it/markdown-it) | Fast, extensible, Node.js native |
| CSS Processor | Plain CSS + CSS Variables | No build complexity needed |
| Build Tool | Node.js scripts or Deno | No heavy framework |

### Why Plain HTML + CSS?

- No runtime dependencies for visitors
- Full control over rendering pipeline
- Easier to debug and customize
- Faster page loads

## Target Architecture

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

## Key Design Decisions

### Front Matter Extraction

Keep YAML front matter optional. If present, extract:
- `title`: Page title
- `description`: Page title
- `order`: Order in the index page

### Index Page Generation

Auto-generate index listing from all pages:
- Sort by `order` front matter (if present)
- Fall back to alphabetical
- Show title + description

### Template System

Single template using `{{..}}` placehoders for `index-template.html` and `global-index.html`:

**Example**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{title}}</title>
  <meta name="description" content="{{description}}">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header>
    <nav>
      <a href="/">Home</a>
    </nav>
  </header>
  <main>
    {{content}}
  </main>
    <p>2026 Rafael Santos</p>
  </footer>
</body>
</html>
```
