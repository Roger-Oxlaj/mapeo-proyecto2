const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000/",
    supportFile: false,
    setupNodeEvents(on, config) {
      // puedes agregar plugins aquí si los necesitas
    },
  },
});