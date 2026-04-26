import { defineConfig } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'


const __dirname = path.dirname(fileURLToPath(import.meta.url))

function trailingSlashPlugin() {
  return {
    name: 'trailing-slash',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url || ''
        if (url.endsWith('/')) {
          const filePath = path.join(__dirname, 'public', url, 'index.html')
          const fs = await import('fs')
          if (fs.existsSync(filePath)) {
            req.url = url + 'index.html'
          }
        }
        next()
      })
    },
  }
}

export default defineConfig({
  plugins: [trailingSlashPlugin()],
  server: {
    port: 3000,
  },
  preview: {
    port: 4000,
  },
})