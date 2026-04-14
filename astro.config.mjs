// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  server: {
    host: true, // Esto expone el proyecto a la red local
    port: 4321, // Puedes fijar el puerto si quieres
  },
  vite: {
    plugins: [tailwindcss()]
  },
  image: {
    // Permite que el componente <Image> de Astro optimice imágenes remotas del CDN de Shopify
    domains: ['cdn.shopify.com'],
  },
  integrations: [react()]
});