import { createServer, ServerResponse } from 'http';
import { watch, statSync, createReadStream } from 'fs';
import { extname, join } from 'path';
import { spawn } from 'child_process';

const PORT = 3000;
const BASE_PATH = '/blog'; // The subpath we want to host on
const MIME: Record<string, string> = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
};

const clients = new Set<ServerResponse>();
let timer: ReturnType<typeof setTimeout> | null = null;
let currentBuild: any = null;

function notifyClients() {
  for (const res of clients) {
    res.write(`data: reload\n\n`); // Clean string for easier client-side matching
  }
}

function regenerate() {
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    if (currentBuild) currentBuild.kill();

    console.log('Regenerating...');
    currentBuild = spawn('npx', ['tsx', 'src/generate.ts'], {
      shell: true,
      stdio: 'inherit',
    });

    currentBuild.on('close', (code: number) => {
      currentBuild = null;
      if (code === 0) {
        console.log('Build successful.');
        notifyClients();
      }
    });
  }, 150);
}

const server = createServer((req, res) => {
  const url = new URL(req.url || '/', `http://localhost:${PORT}`);
  const pathname = decodeURIComponent(url.pathname);

  // 1. Live Reload Endpoint
  if (pathname === '/events') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    });
    clients.add(res);
    req.on('close', () => clients.delete(res));
    return;
  }

  // 2. Handle the missing trailing slash for the base path
  // Redirects /blog -> /blog/ so relative assets load correctly
  if (pathname === BASE_PATH) {
    res.writeHead(301, { Location: BASE_PATH + '/' });
    res.end();
    return;
  }

  // 3. Route everything else starting with /blog
  if (pathname.startsWith(BASE_PATH)) {
    // Strip the "/blog" prefix to get the internal path
    const internalPath = pathname.slice(BASE_PATH.length) || '/';
    
    let filePath: string;
    if (internalPath === '/') {
      filePath = join('docs', 'index.html');
    } else if (!extname(internalPath)) {
      filePath = join('docs', internalPath, 'index.html');
    } else {
      filePath = join('docs', internalPath);
    }

    try {
      const stats = statSync(filePath, { throwIfNoEntry: false });
      if (stats && stats.isFile()) {
        const ext = extname(filePath);
        res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
        createReadStream(filePath).pipe(res);
        return;
      }
    } catch (e) {
      // Fall through to 404
    }
  }

  res.writeHead(404);
  res.end('Not found');
});

watch('website/pages', { recursive: true }, (eventType, filename) => {
  if (filename?.endsWith('.md')) {
    console.log(`Changed: ${filename}`);
    regenerate();
  }
});

server.listen(PORT, () => {
  console.log(`Dev server running at http://localhost:${PORT}${BASE_PATH}/`);
});