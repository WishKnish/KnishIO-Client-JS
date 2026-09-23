module.exports = {
  roots: ['<rootDir>/tests'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  // v8 provider pairs with the swc transform (the default babel provider
  // would re-instrument through babel for no reason).
  coverageProvider: 'v8',
  testEnvironment: 'node',
  transform: {
    '^.+\\.js$': ['@swc/jest', {
      jsc: { target: 'es2022' },
      module: { type: 'commonjs' }
    }]
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(@noble))'
  ],
  // The cross-SDK vector suites always run. In a standalone checkout (no
  // ../shared-test-results) each registers a single visible skipped test instead.
  testPathIgnorePatterns: ['/node_modules/']
}
