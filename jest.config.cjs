module.exports = {
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["json", "lcov", "text", "clover"],
  preset: "ts-jest",
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: "<rootDir>/tsconfig.jest.json",
        useESM: true,
      },
    ],
    "^.+\\.(js|jsx|mjs)$": ["babel-jest", { configFile: "./babel.config.cjs" }],
    "\\.(svg|jpg|jpeg|png|gif)$": "jest-transform-stub",
  },
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["./jest.setup.js"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "mjs"],
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  moduleNameMapper: {
    "\\.(css|less|sass|scss)$": "identity-obj-proxy",
    "^src/(.*)$": "<rootDir>/src/$1",
    "^.+\\.svg$": "<rootDir>/src/__mocks__/svgMock.js",
    "\\.(svg|jpg|jpeg|png|gif)$": "jest-transform-stub",
    "^.+\\.png$": "<rootDir>/src/__mocks__/pngMock.js",
    "^.+\\.gif$": "<rootDir>/src/__mocks__/gifMock.js",
  },
  transformIgnorePatterns: ["/node_modules/(?!dayjs|axios)/"],
  collectCoverageFrom: [
    "src/containers/**/*.{ts,tsx,js,jsx}",
    "src/components/**/*.{ts,tsx,js,jsx}",
    "!src/containers/redux/sagas/**",
    "!src/containers/redux/slices/**",
  ],
  testMatch: [
    "<rootDir>/src/containers/**/*.test.{ts,tsx,js,jsx}",
    "<rootDir>/src/components/**/*.test.{ts,tsx,js,jsx}",
  ],
  testPathIgnorePatterns: [
    "/node_modules/",
    "<rootDir>/src/containers/redux/sagas/",
    "<rootDir>/src/containers/redux/slices/",
  ],
  globals: {
    "ts-jest": {
      useESM: true,
    },
  },
};
