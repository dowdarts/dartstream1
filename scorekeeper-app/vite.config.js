import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/dartstream1/',
  resolve: {
    alias: {
      'tslib': 'tslib/tslib.es6.js'
    }
  },
  optimizeDeps: {
    include: ['@supabase/supabase-js', 'tslib']
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    }
  }
})
