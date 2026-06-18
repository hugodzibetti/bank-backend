module.exports = {
  projects: [
    {
      displayName: 'unit',
      moduleFileExtensions: ['js', 'json', 'ts'],
      rootDir: '.',
      testMatch: ['<rootDir>/**/*.spec.ts'],
      testPathIgnorePatterns: [
        '/node_modules/',
        '/coverage/',
        '/dist/',
        '/test/',
      ],
      transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
      },
      collectCoverageFrom: ['src/**/*.(t|j)s'],
      coverageDirectory: './coverage',
      testEnvironment: 'node',
    },
    {
      displayName: 'e2e',
      moduleFileExtensions: ['js', 'json', 'ts'],
      rootDir: '.',
      testMatch: ['<rootDir>/test/e2e/**/*.e2e-spec.ts'],
      transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
      },
      testEnvironment: 'node',
      globalSetup: './test/jest-global-setup.ts',
      globalTeardown: './test/jest-global-teardown.ts',
      testTimeout: 30000,
    },
  ],
};
