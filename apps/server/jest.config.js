module.exports = {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: ".",
  testEnvironment: "node",
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest"
  },
  coverageDirectory: "../coverage",
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "src/main.ts"
  ],
  testPathIgnorePatterns: [
    "/node_modules/",
    "src/main.ts"
  ]
};
