import { defineConfig, loadEnv } from 'vite';
import { resolve as path } from 'node:path';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig(async ({ command, mode }) => {
	const env = loadEnv(mode, process.cwd(), '');

	return {
		define: {
			'process.env.NODE_ENV': true,
		},
		build: {
			//minify: false,
			sourcemap: true,
			outDir: path(__dirname, '..', 'dist'),
			target: 'es2015',
			lib: {
				formats: ['iife', 'es', 'cjs'],
				entry: path(__dirname, '..', 'src', 'index.js'),
				name: 'KnishIO',
				fileName: (format) => {
					if (['iife', 'cjs'].includes(format)) {
						return `client.${format}.js`;
					}
					return `client.${format}.mjs`;
				}
			}
		},
		plugins: [
			nodePolyfills({
				globals: {
					Buffer: true
				}
			}),
			resolve({browser: true}),
			commonjs()
		]
	};
});
