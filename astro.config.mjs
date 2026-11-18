import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://noahweidig.com',
  base: '/catholic',
  trailingSlash: 'ignore',
  build: { format: 'file' },
});
