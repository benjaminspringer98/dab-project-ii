import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import tailwind from "@astrojs/tailwind";
import deno from '@astrojs/deno';

export default defineConfig({
  integrations: [svelte(), tailwind()],
  server: {
    port: 3000,
    host: true
  },
  output: 'server',
  adapter: deno({
    port: 3000,
  }),
});