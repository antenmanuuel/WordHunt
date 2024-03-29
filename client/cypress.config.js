import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "https://wordhunt-fff9a57fb464.herokuapp.com/",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
