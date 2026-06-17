const fs = require('fs');
const path = require('path');

const rootDir = '.';
const absoluteRootDir = fs.realpathSync(rootDir);
const alternativeRootDir = absoluteRootDir.replace(/^\/var\//, '/');

const roots = [rootDir];
if (alternativeRootDir !== absoluteRootDir && fs.existsSync(alternativeRootDir)) {
  roots.push(alternativeRootDir);
}

module.exports = {
  globalSetup: '<rootDir>/test/jest-global-setup.ts',
  globalTeardown: '<rootDir>/test/jest-global-teardown.ts',
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: rootDir,
  roots: roots,
  testRegex: '.*\\.(spec|e2e-spec)\\.ts$',
  testPathIgnorePatterns: ['/node_modules/', '/coverage/', '/dist/'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['src/**/*.(t|j)s'],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
};
