const ignores = ['/node_modules/', '/lib/'];

module.exports = {
  transform: {
    '.(ts|tsx)': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  coveragePathIgnorePatterns: [...ignores],
  // coverageThreshold: {
  //   global: {
  //     branches: 35,
  //     functions: 60,
  //     lines: 70,
  //     statements: 70,
  //   },
  // },
  testPathIgnorePatterns: [...ignores],
};
