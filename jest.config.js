module.exports = {
  preset: "jest-expo",
  setupFiles: ["<rootDir>/jest.polyfills.js"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testMatch: [
    "**/_tests_/**/*.test.ts",
    "**/_tests_/**/*.test.tsx",
    "**/_tests_/**/*.spec.ts",
    "**/_tests_/**/*.spec.tsx"
  ],
  moduleNameMapper: {
    "^expo/src/winter$": "<rootDir>/jest.expo-winter.js",
    "^@/(.*)$": "<rootDir>/src/$1"
  }
};
