/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  clearMocks: true,
  modulePathIgnorePatterns: ["/dist/"],
  resetMocks: true,
  resetModules: true,
  restoreMocks: true,
  setupFiles: ["./test/setup/env-setup.ts"],
  setupFilesAfterEnv: ["./test/setup/test-setup.ts"],
  testEnvironment: "./test/setup/environment.ts",
  // node_modules is default.
  testPathIgnorePatterns: ["/node_modules/", "/cypress/"],
  transform: {
    "\\.[jt]sx?$": "babel-jest",
  },
  verbose: true,
  watchPlugins: [
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname",
  ],
};

if (process.env.CI) {
  config.maxWorkers = 2;
}

module.exports = config;
