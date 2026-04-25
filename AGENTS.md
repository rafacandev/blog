# AGENTS.md

## Repo type

Jekyll static site using GitHub Pages (midnight theme). No Node.js tooling.

## Structure

- `pages/` — Markdown articles (subdirectories allowed)
- `assets/` — Static assets (images, SVGs)
- `_layouts/` — Jekyll layouts
- `_config.yml` — Site config

## Adding content

Create `.md` files in `pages/` with YAML front matter (`title`, etc.). Jekyll auto-generates pages from Markdown.

## Local preview

```bash
jekyll serve
# or
bundle exec jekyll serve
```

If bundle fails, install Jekyll: `gem install jekyll`