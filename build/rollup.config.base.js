import babel from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import external from 'rollup-plugin-peer-deps-external';
import remote from './external';

const config = require( '../package.json' );

export default {
  input: 'src/index.js',
  plugins: [
    external( {
      includeDependencies: true
    } ),
    resolve( {
      browser: true,
      preferBuiltins: false
    } ),
    babel( {
      babelHelpers: 'runtime',
      exclude: 'src/**'
    } ),
    replace( {
      VERSION: JSON.stringify( config.version )
    } )
  ],
  external: remote
};
