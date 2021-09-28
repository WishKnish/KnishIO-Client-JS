import base from './rollup.config.base';
import cjs from '@rollup/plugin-commonjs';
import globals from './globals';
import { terser } from 'rollup-plugin-terser';

const config = Object.assign( {}, base, {
  output: {
    file: 'dist/client.cjs.js',
    format: 'cjs',
    name: 'KnishIO',
    globals: globals
  },
  plugins: [
    cjs( {
      exclude: 'src/* src/** src/**/*'
    } ),
    terser()
  ]
} );

export default config;
