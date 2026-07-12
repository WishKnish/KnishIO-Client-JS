import neostandard from 'neostandard'

// Flat-config migration of the legacy .eslintrc.cjs: neostandard supplies the
// standard-style baseline (eslint 9+); the rules block below carries over the
// project's long-standing overrides. The old vue plugin was dropped — this SDK
// has no .vue sources and lint only ever covered src/**/*.js.
export default [
  { ignores: ['dist/**'] },
  ...neostandard(),
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ga: 'readonly', // Google Analytics
        cordova: 'readonly',
        __statics: 'readonly',
        process: 'readonly',
        jest: 'readonly'
      }
    },
    rules: {
      'no-param-reassign': 'off',
      'no-underscore-dangle': 'off',
      'max-len': 'off',
      '@stylistic/semi': 'warn',
      '@stylistic/comma-dangle': ['error', 'never'],
      '@stylistic/spaced-comment': ['error', 'always'],
      '@stylistic/quotes': ['error', 'single'],
      'prefer-template': 'error',
      '@stylistic/no-multi-spaces': 'error',
      'no-console': 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      '@stylistic/template-curly-spacing': 'off',
      '@stylistic/indent': 'off'
    }
  }
]
