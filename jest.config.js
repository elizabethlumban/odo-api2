module.exports = {
  coverageDirectory: './coverage',
  collectCoverageFrom: ['src/**/*.js', '!src/index.js', '!**/__tests__/**', '!**/node_modules/**'],
  testEnvironment: 'node',
  modulePaths: ['<rootDir>/src', '<rootDir>/test'],
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80
    }
  }
};
