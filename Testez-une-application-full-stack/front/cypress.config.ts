import { defineConfig } from 'cypress';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const codeCoverageTask = require('@cypress/code-coverage/task');

export default defineConfig({
  videosFolder: 'cypress/videos',
  screenshotsFolder: 'cypress/screenshots',
  fixturesFolder: 'cypress/fixtures',
  video: false,
  e2e: {
    setupNodeEvents(on, config) {
      codeCoverageTask(on, config);
      return config;
    },
    baseUrl: 'http://localhost:4200',
  },
});