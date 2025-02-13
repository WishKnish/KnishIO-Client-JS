import { defineConfig, loadEnv } from 'vite';
import { resolve as path } from 'node:path';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import typescript from '@rollup/plugin-typescript';
import dts from 'vite-plugin-dts';

export default defineConfig(async ({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    define: {
      'process.env.NODE_ENV': true,
    },
    build: {
      minify: true,
      sourcemap: true,
      outDir: path(__dirname, '..', 'dist'),
      target: 'es2020',
      lib: {
        formats: ['iife', 'es', 'cjs'],
        entry: path(__dirname, '..', 'src', 'index.ts'), // Changed to .ts
        name: 'KnishIO',
        fileName: (format) => {
          if (['iife', 'cjs'].includes(format)) {
            return `client.${format}.js`;
          }
          return `client.${format}.mjs`;
        }
      },
      rollupOptions: {
        external: ['vue'],
        output: {
          manualChunks: undefined
        }
      }
    },
    esbuild: {
      target: 'es2020'
    },
    plugins: [
      dts({
        insertTypesEntry: true,
        rollupTypes: true
      }),
      typescript({
        tsconfig: path(__dirname, '..', 'tsconfig.json'),
        declaration: true,
        declarationDir: path(__dirname, '..', 'dist', 'types'),
        exclude: ['**/*.test.ts', '**/*.spec.ts']
      }),
      nodePolyfills({
        globals: {
          Buffer: true
        }
      }),
      resolve({ browser: true }),
      commonjs()
    ]
  };
});
