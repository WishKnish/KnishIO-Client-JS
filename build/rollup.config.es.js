import base from './rollup.config.base';
import globals from './globals';
import {terser} from "rollup-plugin-terser";

const config = Object.assign({}, base, {
  output: {
    file: 'dist/client.esm.js',
    format: 'es',
    name: 'KnishIO',
    globals: globals,
  },
  plugins: [
    terser(),
  ],
})

export default config
