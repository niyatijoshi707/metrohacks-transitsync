import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // Tailwind CSS v4 — Vite-native plugin (no tailwind.config.js needed)
    tailwindcss(),

    // React plugin (fast refresh, JSX transform)
    react(),

    // PWA plugin — enables offline caching via service worker
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons.svg', 'images/*.webp'],
      manifest: {
        name: 'TransitSync — Ahmedabad Integrated Public Transport',
        short_name: 'TransitSync',
        description:
          'Multi-modal public transport coordination for Ahmedabad (METRO HACKS demo)',
        theme_color: '#0B2545',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait-primary',
        icons: [
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        // Precache all built assets including webp images for offline airplane mode
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
        navigateFallback: 'index.html',
        // Cache external fonts or resources if accessed
        runtimeCaching: [
          {
            urlPattern: /^https?.*/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'transitsync-cache-v1',
              networkTimeoutSeconds: 5,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24, // 1 day
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],

  // Vitest configuration — uses vitest/config defineConfig so 'test' is recognised
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: [],
  },
});
