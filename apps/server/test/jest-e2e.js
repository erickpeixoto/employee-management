module.exports = {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: ".",
  testEnvironment: "node",
  testRegex: ".e2e-spec.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest"
  },
  coverageDirectory: "../coverage-e2e",
  globalSetup: "./global-setup.ts",
  verbose: true,
  setupFilesAfterEnv: ["./jest.setup.js"],
  maxWorkers: 1,
  testSequencer: "./testSequencer.js",
  transformIgnorePatterns: ["/node_modules/(?!@prisma/client)"]
};
