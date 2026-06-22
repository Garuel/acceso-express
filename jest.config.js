module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: ["reflect-metadata"],
  modulePathIgnorePatterns: ["<rootDir>/dist/"],
};
