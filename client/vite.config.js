import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    // Forces Vite to pre-bundle recharts as a single unit during dev,
    // matching how it'll be treated in production — avoids the
    // "ResponsiveContainer is not defined" bug some Vite + recharts
    // combos hit when the prod build's tree-shaking splits recharts'
    // internals across chunks.
    include: ['recharts'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Keep the whole recharts library in one chunk instead of
          // letting Rollup split it — the split is what triggers the
          // dangling reference in minified prod builds.
          recharts: ['recharts'],
        },
      },
    },
  },
})