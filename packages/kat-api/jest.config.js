module.exports = {
  name: 'packages-kat-api',
  preset: '../../jest.config.js',
  globals: {
    'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' },
  },
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/./packages/kat-api-pt',
  testEnvironment: 'node',
};
