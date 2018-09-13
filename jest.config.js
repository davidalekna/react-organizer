const ignores = [
  '/node_modules/',
  '/fixtures/',
  '/__tests__/helpers/',
  '__mocks__',
];

module.exports = {
  testPathIgnorePatterns: [...ignores],
  testMatch: ['**/__tests__/**/*.+(js|jsx|ts|tsx)'],
  coveragePathIgnorePatterns: [...ignores],
  coverageThreshold: {
    global: {
      branches: 73,
      functions: 66,
      lines: 80,
      statements: 86,
    },
  },
};
