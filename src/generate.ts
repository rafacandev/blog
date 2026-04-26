import * as fs from 'fs';
import * as path from 'path';
import MarkdownIt from 'markdown-it';
import { getHighlighter } from 'shiki';

const ROOT_DIR = process.cwd();
const WEBSITE_DIR = path.join(ROOT_DIR, 'website');
const PAGES_DIR = path.join(WEBSITE_DIR, 'pages');
const OUTPUT_DIR = path.join(ROOT_DIR, 'docs');

let highlighter: any;
let md: MarkdownIt;

function highlightCode(code: string, lang: string): string {
  if (!highlighter || !lang) {
    return code;
  }
  try {
    return highlighter.codeToHtml(code, { lang, theme: 'min-dark' });
  } catch {
    return code;
  }
}

interface FrontMatter {
  title?: string;
  description?: string;
  order?: number;
}

function parseFrontMatter(content: string): { frontMatter: FrontMatter; content: string } {
  const frontMatterRegex = /^---\n([\s\S]*?)\n---\n/;
  const match = content.match(frontMatterRegex);

  if (!match) {
    return { frontMatter: {}, content };
  }

  const frontMatter: FrontMatter = {};
  const lines = match[1].split('\n');

  for (const line of lines) {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length > 0) {
      const value = valueParts.join(':').trim();
      if (key.trim() === 'order') {
        frontMatter.order = parseInt(value, 10);
      } else {
        (frontMatter as Record<string, string>)[key.trim()] = value.replace(/^["']|["']$/g, '');
      }
    }
  }

  return {
    frontMatter,
    content: content.slice(match[0].length)
  };
}

function extractTitle(mdContent: string): string {
  const lines = mdContent.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(/^#\s+(.+)/);
    if (match) {
      return match[1].trim();
    }
    const nextLine = lines[i + 1];
    if (line && nextLine && nextLine.match(/^-+$/)) {
      return line.trim();
    }
  }
  return '';
}

function applyTemplate(template: string, data: { title: string; description: string; content: string }): string {
  return template
    .replace(/{{title}}/g, data.title)
    .replace(/{{description}}/g, data.description)
    .replace(/{{content}}/g, data.content);
}

function getFiles(dir: string, relativePath = ''): string[] {
  const files: string[] = [];

  if (!fs.existsSync(dir)) {
    return files;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.join(relativePath, entry.name);

    if (entry.isDirectory()) {
      files.push(...getFiles(fullPath, relPath));
    } else {
      files.push(relPath);
    }
  }

  return files;
}

function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function processPages(): FrontMatter[] {
  const pages: FrontMatter[] = [];
  const files = getFiles(PAGES_DIR);

  for (const file of files) {
    if (!file.endsWith('.md')) {
      const dirPath = path.dirname(file);
      const outDir = path.join(OUTPUT_DIR, dirPath);
      ensureDir(outDir);
      const outPath = path.join(OUTPUT_DIR, file);
      fs.copyFileSync(path.join(PAGES_DIR, file), outPath);
      continue;
    }

    if (path.basename(file) !== 'README.md' && path.basename(file) !== 'index.md' && path.basename(file) !== '_index.md') {
      continue;
    }

    const content = fs.readFileSync(path.join(PAGES_DIR, file), 'utf-8');
    const { frontMatter, content: mdContent } = parseFrontMatter(content);
    const htmlContent = md.render(mdContent);

    let outDir: string;
    let outFile: string;

    const dirPath = path.dirname(file);
    if (dirPath === '.') {
      outDir = OUTPUT_DIR;
      outFile = path.join(OUTPUT_DIR, 'index.html');
    } else {
      outDir = path.join(OUTPUT_DIR, dirPath);
      outFile = path.join(outDir, 'index.html');
    }

    ensureDir(outDir);

    const template = fs.readFileSync(path.join(WEBSITE_DIR, 'global-template.html'), 'utf-8');
    const extractedTitle = extractTitle(mdContent);
    const title = frontMatter.title || extractedTitle || path.basename(dirPath, '.') || 'Untitled';
    const description = frontMatter.description || title;
    const slug = dirPath === '.' ? '' : dirPath;

    const pageInfo: FrontMatter & { _slug?: string } = { ...frontMatter, title, description, _slug: slug };
    if (frontMatter.order === undefined) {
      pageInfo.order = Number.MAX_SAFE_INTEGER;
    }

    const html = applyTemplate(template, {
      title,
      description,
      content: htmlContent
    });

    fs.writeFileSync(outFile, html);

    pages.push(pageInfo);
  }

  return pages;
}

function generateIndex(pages: { title?: string; description?: string; order?: number; _slug?: string }[]): void {
  const sortedPages = pages.sort((a, b) => {
    const orderA = a.order ?? Number.MAX_SAFE_INTEGER;
    const orderB = b.order ?? Number.MAX_SAFE_INTEGER;
    if (orderA !== orderB) {
      return orderA - orderB;
    }
    return 0;
  });

  const content = sortedPages.map(page => {
    const href = page._slug || '/';
    return `<li><a href="${href}/">${page.title || 'Untitled'}</a>${page.description ? `<p>${page.description}</p>` : ''}</li>`;
  }).join('\n');

  const template = fs.readFileSync(path.join(WEBSITE_DIR, 'index-template.html'), 'utf-8');
  const html = applyTemplate(template, {
    title: 'Rafael Santos Blog',
    description: 'Rafael Santos Blog',
    content: `<ul>${content}</ul>`
  });

  fs.writeFileSync(path.join(OUTPUT_DIR, 'index.html'), html);
}

function copyStyles(): void {
  const copy = (filename: string) => {
    const src = path.join(WEBSITE_DIR, filename);
    const dest = path.join(OUTPUT_DIR, filename);
    fs.copyFileSync(src, dest);
  }
  copy('styles.css')
  copy('pico.classless.orange.min.css')
}

function clean(): void {
  if (fs.existsSync(OUTPUT_DIR)) {
    fs.rmSync(OUTPUT_DIR, { recursive: true });
  }
  ensureDir(OUTPUT_DIR);
}

function build(): Promise<void> {
  console.log('Initializing syntax highlighter...');

return (async () => {
    highlighter = await getHighlighter({
      themes: ['min-dark'],
      langs: ['shellscript', 'typescript', 'javascript', 'java', 'python', 'markdown']
    });

    md = new MarkdownIt({
      highlight: (code: string, lang: string) => highlightCode(code, lang)
    });

    console.log('Cleaning output directory...');
    clean();

    console.log('Processing pages...');
    const pages = processPages();

    console.log('Generating index...');
    generateIndex(pages);

    console.log('Copying styles...');
    copyStyles();

    console.log('Build complete!');
  })();
}

build();