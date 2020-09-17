import base from './rollup.config.base';
import { terser, } from "rollup-plugin-terser";
import globals from './globals';
import nodePolyfills from "rollup-plugin-node-polyfills";

const config = Object.assign({}, base, {
  output: {
    file: 'dist/client.min.js',
    format: 'iife',
    name: 'KnishIO',
    globals: globals,
  },
   plugins: [
     nodePolyfills(),
    terser(),
  ],
});

export default config
