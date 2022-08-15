export default {
  displayName: {
    name: 'nestjs',
    color: 'magentaBright',
  },
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': '@swc/jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    'pet\\-core/(.*)$':
      '<rootDir>/../../../node_modules/pet-core/dist/$1',
    '#seedwork/(.*)$':
      '<rootDir>/../../../node_modules/pet-core/dist/@seedwork/$1',
    '#category/(.*)$':
      '<rootDir>/../../../node_modules/pet-core/dist/pet/$1',
  },
  setupFilesAfterEnv: [
		'../../@core/src/@seedwork/domain/tests/jest.ts',
	],
};
