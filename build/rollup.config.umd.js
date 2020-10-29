import base from './rollup.config.base';
import globals from './globals';
import { terser } from "rollup-plugin-terser";
import nodePolyfills from "rollup-plugin-node-polyfills";

const config = Object.assign( {}, base, {
  output: {
    file: 'dist/client.umd.js',
    format: 'umd',
    name: 'KnishIO',
    globals: globals,
  },
  plugins: [
    nodePolyfills(),
    terser(),
  ],
} )

export default config
