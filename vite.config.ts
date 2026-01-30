import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { sentryVitePlugin } from '@sentry/vite-plugin'

export default defineConfig({
  // Supprimer console.log en production
  esbuild: {
    drop: ['console', 'debugger'],
  },
  plugins: [
    react(),
    tailwindcss(),
    // Sentry source maps upload (production only)
    process.env.SENTRY_AUTH_TOKEN && sentryVitePlugin({
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
      sourcemaps: {
        filesToDeleteAfterUpload: ['**/*.map'],
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    headers: {
      'Cache-Control': 'no-store',
    },
    hmr: {
      overlay: true,
    },
  },
  optimizeDeps: {
    force: true,
  },
  build: {
    sourcemap: true,
    // Réduire la taille des chunks
    chunkSizeWarningLimit: 300,
    minify: 'esbuild',
    target: 'es2020',
    rollupOptions: {
      output: {
        // Optimisation des chunks pour réduire la taille
        manualChunks(id) {
          // Vendor - React core
          if (id.includes('node_modules/react/') ||
              id.includes('node_modules/react-dom/') ||
              id.includes('node_modules/scheduler/')) {
            return 'vendor-react';
          }
          // Router séparé
          if (id.includes('node_modules/react-router')) {
            return 'vendor-router';
          }
          // Framer Motion (gros bundle)
          if (id.includes('node_modules/framer-motion')) {
            return 'vendor-framer';
          }
          // Lucide icons
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-icons';
          }
          // Supabase
          if (id.includes('node_modules/@supabase')) {
            return 'vendor-supabase';
          }
          // Radix UI (composants)
          if (id.includes('node_modules/@radix-ui')) {
            return 'vendor-radix';
          }
          // Sentry
          if (id.includes('node_modules/@sentry')) {
            return 'vendor-sentry';
          }
          // Stripe
          if (id.includes('node_modules/@stripe')) {
            return 'vendor-stripe';
          }
          // Date utilities
          if (id.includes('node_modules/date-fns') || id.includes('node_modules/dayjs')) {
            return 'vendor-dates';
          }
          // Autres dépendances node_modules
          if (id.includes('node_modules')) {
            return 'vendor-misc';
          }
        },
      },
    },
  },
})
