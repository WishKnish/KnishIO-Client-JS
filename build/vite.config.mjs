import {
	defineConfig,
	loadEnv
} from 'vite';
import { resolve as path } from 'node:path';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default defineConfig( async ( {
	command,
	mode
} ) => {
	const env = loadEnv( mode, process.cwd(), '' );

	return {
		define: {
			'process.env.NODE_ENV': true,
		},
		build: {
			minify: true,
			sourcemap: true,
			outDir: path( __dirname, '..', 'dist' ),
			target: 'es2020',
			lib: {
				formats: [ 'iife', 'es', 'cjs' ],
				entry: path( __dirname, '..', 'src', 'index.js' ),
				name: 'KnishIO',
				fileName: ( format ) => {
					if ( [ 'iife', 'cjs' ].includes( format ) ) {
						return `client.${ format }.js`;
					}
					return `client.${ format }.mjs`;
				}
			},
			rollupOptions: {
				external: [ 'vue' ],
				output: {
					manualChunks: undefined
				}
			}
		},
		esbuild: {
			target: 'es2020'
		},
		plugins: [
			resolve( { browser: true } ),
			commonjs()
		]
	};
} );
