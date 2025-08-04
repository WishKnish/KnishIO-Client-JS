module.exports = {
  root: true,

  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },

  env: {
    browser: true,
    es2021: true,
    jest: true,
    node: true
  },

  extends: [
    'standard',
    'plugin:vue/vue3-essential'
  ],

  plugins: [
    'vue',
    '@typescript-eslint'
  ],

  globals: {
    ga: true, // Google Analytics
    cordova: true,
    __statics: true,
    process: true
  },

  // add your custom rules here
  rules: {
    'no-param-reassign': 'off',
    'no-underscore-dangle': 'off',
    'max-len': 'off',
    semi: 1,
    'comma-dangle': ['error', 'never'],
    'spaced-comment': ['error', 'always'],
    quotes: ['error', 'single'],
    'prefer-template': ['error'],
    'no-multi-spaces': 'error',

    // allow console.log during development only
    'no-console': 'off',
    // allow debugger during development only
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

    // TODO: Remove when is https://github.com/babel/babel-eslint/issues/530 fixed
    'template-curly-spacing': 'off',
    // 'template-curly-spacing': [ "error", "always" ],
    indent: 'off',

    // Relax some rules for migration period
    'new-cap': 'warn',
    'no-unused-vars': 'warn',
    'accessor-pairs': 'warn',
    'no-empty-pattern': 'warn',
    'no-extend-native': 'warn',
    'no-prototype-builtins': 'warn',
    'no-use-before-define': 'warn',

    // TypeScript specific rules (basic only)
    '@typescript-eslint/no-unused-vars': 'warn'
  },

  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: './tsconfig.json'
      },
      extends: [
        'standard'
      ],
      rules: {
        'no-undef': 'off', // TypeScript handles this
        'no-unused-vars': 'off', // Use TypeScript version
        '@typescript-eslint/no-unused-vars': 'error',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/no-unsafe-assignment': 'warn',
        '@typescript-eslint/no-unsafe-call': 'warn',
        '@typescript-eslint/no-unsafe-member-access': 'warn',
        '@typescript-eslint/no-unsafe-return': 'warn',
        '@typescript-eslint/restrict-template-expressions': 'warn',
        '@typescript-eslint/prefer-nullish-coalescing': 'error',
        '@typescript-eslint/prefer-optional-chain': 'error'
      }
    }
  ]
}
