import { defineConfig } from 'vite'
import { env } from 'process'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: env.DEPLOY_PRIME_URL ?? '/',
  build: {
    outDir: 'build',
    sourcemap: Boolean(env.ENABLE_SOURCEMAPS),
    rollupOptions: {
      output: {
        manualChunks: {
          codemirror: ['react-codemirror2', 'codemirror']
        }
      }
    }
  },
  plugins: [
    react(),
  ],
  define: {
    'process.env': {
      NODE_ENV: env.NODE_ENV
    },
    'global.PREVENT_CODEMIRROR_RENDER': false,
  }
})