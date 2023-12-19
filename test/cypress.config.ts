import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {},
    baseUrl: 'http://localhost:8000',
    specPattern: './e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: false,
    
  },
});
