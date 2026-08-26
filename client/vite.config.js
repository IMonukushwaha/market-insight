import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['recharts'],
  },
  build: {
    chunkSizeWarningLimit: 1000, // just silences the "chunk too large" warning
  },
})