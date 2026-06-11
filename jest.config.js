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
