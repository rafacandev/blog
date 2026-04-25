import { defineConfig, Plugin } from 'vite';
import { spawn } from 'child_process';
import * as path from 'path';
import chokidar from 'chokidar';

const WEBSITE_DIR = 'website';
const OUTPUT_DIR = 'docs';

function build() {
  return new Promise<void>((resolve) => {
    const child = spawn('npx', ['tsx', 'build.ts'], {
      shell: true,
      stdio: 'inherit',
    });
    child.on('close', () => resolve());
  });
}

function watchPlugin(): Plugin {
  return {
    name: 'watch-plugin',
    apply: 'serve',
    async configureServer(server) {
      console.log('Initial build...');
      await build();

      const watcher = chokidar.watch(WEBSITE_DIR, {
        ignored: /(^|[\/\\])\../,
        ignoreInitial: true,
        persistent: true,
        awaitWriteFinish: {
          stabilityThreshold: 200,
          pollInterval: 100,
        },
      });

      watcher.on('ready', () => {
        console.log('Watching for changes...');
      });

      watcher.on('all', async (event, file) => {
        console.log(`[DEBUG] Change detected: ${event} - ${path.relative('.', file)}`);
        await build();
        console.log('[DEBUG] Build complete, sending reload');
        server.ws.send({ type: 'full-reload', payload: { path: '*' } });
        console.log('[DEBUG] Reload sent');
      });
    },
  };
}

export default defineConfig({
  root: OUTPUT_DIR,
  plugins: [watchPlugin()],
  server: {
    port: 3000,
    open: true,
  },
});