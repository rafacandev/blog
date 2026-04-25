"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const markdown_it_1 = __importDefault(require("markdown-it"));
const slugify_1 = __importDefault(require("slugify"));
const md = new markdown_it_1.default();
const slugify = slugify_1.default;
const WEBSITE_DIR = path.join(__dirname, 'website');
const PAGES_DIR = path.join(WEBSITE_DIR, 'pages');
const OUTPUT_DIR = path.join(__dirname, 'docs');
function removeExt(filename) {
    return filename.replace(/\.[^.]+$/, '');
}
function getSlug(filename) {
    return slugify(removeExt(filename), { lower: true, strict: true });
}
function parseFrontMatter(content) {
    const frontMatterRegex = /^---\n([\s\S]*?)\n---\n/;
    const match = content.match(frontMatterRegex);
    if (!match) {
        return { frontMatter: {}, content };
    }
    const frontMatter = {};
    const lines = match[1].split('\n');
    for (const line of lines) {
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length > 0) {
            const value = valueParts.join(':').trim();
            if (key.trim() === 'order') {
                frontMatter.order = parseInt(value, 10);
            }
            else {
                frontMatter[key.trim()] = value.replace(/^["']|["']$/g, '');
            }
        }
    }
    return {
        frontMatter,
        content: content.slice(match[0].length)
    };
}
function applyTemplate(template, data) {
    return template
        .replace('{{title}}', data.title)
        .replace('{{description}}', data.description)
        .replace('{{content}}', data.content);
}
function getFiles(dir, relativePath = '') {
    const files = [];
    if (!fs.existsSync(dir)) {
        return files;
    }
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relPath = path.join(relativePath, entry.name);
        if (entry.isDirectory()) {
            files.push(...getFiles(fullPath, relPath));
        }
        else {
            files.push(relPath);
        }
    }
    return files;
}
function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}
function processPages() {
    const pages = [];
    const files = getFiles(PAGES_DIR);
    for (const file of files) {
        if (!file.endsWith('.md')) {
            const ext = path.extname(file);
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
        let outDir;
        let outFile;
        const dirPath = path.dirname(file);
        if (dirPath === '.') {
            outDir = OUTPUT_DIR;
            outFile = path.join(OUTPUT_DIR, 'index.html');
        }
        else {
            outDir = path.join(OUTPUT_DIR, dirPath);
            outFile = path.join(outDir, 'index.html');
        }
        ensureDir(outDir);
        const template = fs.readFileSync(path.join(WEBSITE_DIR, 'global-template.html'), 'utf-8');
        const title = frontMatter.title || path.basename(dirPath, '.') || 'Untitled';
        const description = frontMatter.description || title;
        const html = applyTemplate(template, {
            title,
            description,
            content: htmlContent
        });
        fs.writeFileSync(outFile, html);
        pages.push(frontMatter);
    }
    return pages;
}
function generateIndex(pages) {
    const sortedPages = pages.sort((a, b) => {
        if (a.order !== undefined && b.order !== undefined) {
            return a.order - b.order;
        }
        if (a.order !== undefined)
            return -1;
        if (b.order !== undefined)
            return 1;
        return 0;
    });
    const content = sortedPages.map(page => {
        const slug = slugify(page.title || 'untitled', { lower: true, strict: true });
        return `<li><a href="/${slug}/">${page.title || 'Untitled'}</a>${page.description ? `<p>${page.description}</p>` : ''}</li>`;
    }).join('\n');
    const template = fs.readFileSync(path.join(WEBSITE_DIR, 'index-template.html'), 'utf-8');
    const html = applyTemplate(template, {
        title: 'Home',
        description: 'Rafael Santos Blog',
        content: `<ul>${content}</ul>`
    });
    fs.writeFileSync(path.join(OUTPUT_DIR, 'index.html'), html);
}
function copyStyles() {
    const src = path.join(WEBSITE_DIR, 'styles.css');
    const dest = path.join(OUTPUT_DIR, 'styles.css');
    fs.copyFileSync(src, dest);
}
function clean() {
    if (fs.existsSync(OUTPUT_DIR)) {
        fs.rmSync(OUTPUT_DIR, { recursive: true });
    }
    ensureDir(OUTPUT_DIR);
}
function build() {
    console.log('Cleaning output directory...');
    clean();
    console.log('Processing pages...');
    const pages = processPages();
    console.log('Generating index...');
    generateIndex(pages);
    console.log('Copying styles...');
    copyStyles();
    console.log('Build complete!');
}
build();
