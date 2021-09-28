module.exports = {
  root: true,

  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },

  env: {
    browser: true
  },

  // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
  // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
  extends: [
    'plugin:vue/recommended'
    // 'airbnb-base'
  ],

  // required to lint *.vue files
  plugins: [
    'vue'
  ],

  globals: {
    'ga': true, // Google Analytics
    'cordova': true,
    '__statics': true,
    'process': true
  },

  // add your custom rules here
  rules: {
    'no-param-reassign': 'off',
    'no-underscore-dangle': 'off',
    'max-len': 'off',
    'semi': 1,
    'comma-dangle': [ 'error', 'never' ],
    'spaced-comment': [ 'error', 'always' ],
    'quotes': [ 'error', 'single' ],
    'prefer-template': [ 'error' ],
    'no-multi-spaces': 'error',

    // allow console.log during development only
    'no-console': 'off',
    // allow debugger during development only
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

    // TODO: Remove when is https://github.com/babel/babel-eslint/issues/530 fixed
    'template-curly-spacing': 'off',
    // 'template-curly-spacing': [ "error", "always" ],
    indent: 'off'
  }
};
