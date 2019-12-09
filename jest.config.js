// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  clearMocks: true,
  collectCoverageFrom: [
    "src/**/*.js",
    "src/**/*.svelte",
    "!src/main.js",
    "!src/App.svelte",
    "!src/__tests__/**",
    "!src/**/*injectables.js"
  ],
  coverageDirectory: "coverage",
  moduleFileExtensions: ["js", "json", "svelte"],
  // testEnvironment: "jest-environment-jsdom-fourteen",
  testRegex: "src/__tests__/.+?\\.test\\.js$",
  transform: {
    "^.+\\.js$": "babel-jest",
    "^.+\\.svelte$": "svelte-jester"
  },
  watchPathIgnorePatterns: [
    "<rootDir>/node_modules*",
    "<rootDir>/package.json",
    "<rootDir>/public/",
    "<rootDir>/src/graphql/.+?types",
    "<rootDir>/jest\\.config\\.js",
    "<rootDir>/coverage/"
  ]
};
