module.exports = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.js$': 'esbuild-jest'
  },
  transformIgnorePatterns: [
    '/node_modules/(?!esmock)'
  ]
}
