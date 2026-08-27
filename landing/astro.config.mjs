import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://vinyls-addict.eu',
  integrations: [tailwind()],
  output: 'static',
});
