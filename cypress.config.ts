import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    env: {
      EMAIL: 'test@mail.com',
      PASSWORD: '12345678',
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
