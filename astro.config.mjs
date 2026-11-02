// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://markdocs.app',
  integrations: [react()],
  devToolbar: { enabled: false },
  // Mantém o espaço entre texto e elementos inline quebrados em linhas
  // diferentes no código-fonte (ex.: "Compre uma vez. <span>É seu.</span>").
  compressHTML: false,
});
