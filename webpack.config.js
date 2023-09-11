let path = require( 'node:path' );
const webpack = require('webpack');

module.exports = ( env, argv ) => ( {
  entry: path.resolve( __dirname, argv.mode === 'development' ? 'index.js' : 'src/index.js' ),
  devtool: argv.mode === 'development' ? 'inline-source-map' : 'source-map',
  output: {
    path: path.resolve( __dirname, 'dist' ),
    filename: argv.mode === 'development' ? 'KnishIOClientJSDev.js' : 'KnishIOClientJS.js'
  },
  plugins:[
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer']
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [ '@babel/preset-env', { 'modules': false } ]
            ],
            plugins: [
              // Stage 0
              '@babel/plugin-proposal-function-bind',

              // Stage 1
              '@babel/plugin-proposal-export-default-from',
              '@babel/plugin-proposal-logical-assignment-operators',
              [ '@babel/plugin-proposal-optional-chaining', { 'loose': false } ],
              [ '@babel/plugin-proposal-pipeline-operator', { 'proposal': 'minimal' } ],
              [ '@babel/plugin-proposal-nullish-coalescing-operator', { 'loose': false } ],
              '@babel/plugin-proposal-do-expressions',

              // Stage 2
              [ '@babel/plugin-proposal-decorators', { 'legacy': true } ],
              '@babel/plugin-proposal-function-sent',
              '@babel/plugin-proposal-export-namespace-from',
              '@babel/plugin-proposal-numeric-separator',
              '@babel/plugin-proposal-throw-expressions',

              // Stage 3
              '@babel/plugin-syntax-dynamic-import',
              '@babel/plugin-syntax-import-meta',
              [ '@babel/plugin-proposal-class-properties', { 'loose': false } ],
              '@babel/plugin-proposal-json-strings',

              // local
              '@babel/plugin-transform-property-mutators',
              '@babel/plugin-transform-shorthand-properties',
              '@babel/plugin-transform-for-of',
              '@babel/plugin-transform-arrow-functions',
              '@babel/plugin-transform-classes',
              '@babel/plugin-transform-async-to-generator',
              [ '@babel/plugin-transform-runtime', { 'regenerator': true } ]
            ]
          }
        }
      }
    ]
  }
} );
