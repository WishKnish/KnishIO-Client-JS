import base from './rollup.config.base';
import globals from './globals';
import { terser } from 'rollup-plugin-terser';
import inject from '@rollup/plugin-inject';
import injectConfig from './inject';

const config = Object.assign( {}, base, {
  output: {
    file: 'dist/client.umd.js',
    format: 'umd',
    name: 'KnishIO',
    globals: globals
  },
  plugins: [
    inject( injectConfig ),
    terser()
  ]
} );

export default config;
