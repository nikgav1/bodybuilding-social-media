import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/pages/main/index.html'),
        about: resolve(__dirname, 'src/pages/about/index.html'),
        login: resolve(__dirname, 'src/pages/login/index.html'),
        register: resolve(__dirname, 'src/pages/register/index.html'),
        spa: resolve(__dirname, 'src/spa/index.html')
      },
      output: {
        entryFileNames: (chunkInfo) => {
          return `${chunkInfo.name === 'spa' ? 'spa' : 'pages/' + chunkInfo.name}/[name].[hash].js`;
        },
        chunkFileNames: (chunkInfo) => {
          return `assets/js/[name].[hash].js`;
        },
        assetFileNames: (chunkInfo) => {
          return `assets/[ext]/[name].[hash].[ext]`;
        }
      }
    }
  }
})