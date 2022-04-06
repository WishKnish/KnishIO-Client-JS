import base from './rollup.config.base';
import { terser } from 'rollup-plugin-terser';
import inject from '@rollup/plugin-inject';
import globals from './globals';
import injectConfig from './inject';

const config = Object.assign( {}, base, {
  output: {
    file: 'dist/client.min.js',
    format: 'iife',
    name: 'KnishIO',
    globals: globals
  },
  plugins: [
    inject( injectConfig ),
    terser()
  ]
} );

export default config;
