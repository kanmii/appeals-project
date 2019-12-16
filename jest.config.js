/* eslint-disable @typescript-eslint/no-var-requires */
// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  clearMocks: true,
  collectCoverageFrom: [
    "src/**/*.(ts|svelte|js)",
    "!src/main.js",
    "!src/App.svelte",
    "!src/__tests__/**",
    "!src/**/*injectables.[tj]s"
  ],
  coverageDirectory: "coverage",
  moduleFileExtensions: ["js", "json", "svelte", "ts"],
  testEnvironment: "jest-environment-jsdom-fourteen",
  testRegex: "src/__tests__/.+?\\.test\\.[tj]s$",
  transform: {
    "^.+\\.js$": "babel-jest",
    "^.+\\.ts$": "<rootDir>/node_modules/babel-jest",
    "^.+\\.svelte$": [
      "jest-transform-svelte",
      { preprocess: require("svelte-preprocess")() }
    ]
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
