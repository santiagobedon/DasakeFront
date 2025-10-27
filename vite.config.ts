/**
 * Vite configuration for the DasakeMovies frontend.
 *
 * - Uses the official React plugin for Vite.
 * - Configures build output directory and asset handling:
 *   - `outDir`: output folder for production build
 *   - `assetsDir`: subfolder for static assets
 *   - `rollupOptions.output`: custom file naming with hash for caching
 * - Sets `base` to '/' for correct production routing.
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
  },
  base: '/', // 🔹 important: use '/' instead of './' in production
});
