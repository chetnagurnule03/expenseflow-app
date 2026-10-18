import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'app',
    emptyOutDir: false,
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'app.html')
      }
    }
  },
  server: {
    port: 5173,
    open: false
  }
})
