import { createServer, IncomingMessage, ServerResponse } from 'http';
import { readFileSync, watch, statSync, createReadStream } from 'fs';
import { extname, join } from 'path';
import { spawn } from 'child_process';

const PORT = 3000;
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
  // Send "reload" as a raw string instead of a JSON object
  for (const res of clients) {
    res.write(`data: reload\n\n`); 
  }
}

function regenerate() {
  if (timer) clearTimeout(timer);
  
  timer = setTimeout(() => {
    // 1. Fix Race Condition: Kill existing build if still running
    if (currentBuild) {
      console.log('Aborting previous build...');
      currentBuild.kill();
    }

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
  }, 150); // Increased slightly for stability
}

const server = createServer((req, res) => {
  const url = new URL(req.url || '/', `http://localhost:${PORT}`);

  // SSE Endpoint
  if (url.pathname === '/events') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    });
    clients.add(res);
    req.on('close', () => clients.delete(res));
    return;
  }

  // 2. Fix Encoding: Decode URI (handles spaces/special chars)
  const pathname = decodeURIComponent(url.pathname);
  let filePath: string;

  if (pathname === '/') {
    filePath = join('docs', 'index.html');
  } else if (!extname(pathname)) {
    filePath = join('docs', pathname, 'index.html');
  } else {
    filePath = join('docs', pathname);
  }

  try {
    // 3. Fix EISDIR: Use statSync to ensure it's a file, not a directory
    const stats = statSync(filePath, { throwIfNoEntry: false });
    
    if (stats && stats.isFile()) {
      const ext = extname(filePath);
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
      
      // 4. Optimization: Use Streams instead of readFileSync for large files
      createReadStream(filePath).pipe(res);
    } else {
      res.writeHead(404);
      res.end('Not found');
    }
  } catch (err) {
    res.writeHead(500);
    res.end('Internal Server Error');
  }
});

// Watcher
watch('website/pages', { recursive: true }, (eventType, filename) => {
  if (filename && filename.endsWith('.md')) {
    console.log(`Changed: ${filename}`);
    regenerate();
  }
});

server.listen(PORT, () => {
  console.log(`Dev server running at http://localhost:${PORT}`);
});