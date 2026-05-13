import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  use: {
    // Define the full base URL with its network protocol
    baseURL: 'netlify.app',
  },
});
