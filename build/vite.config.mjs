import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, '../src/index.js'),
      name: 'KnishIOClient',
      formats: ['es', 'cjs', 'iife'],
      fileName: (format) => {
        switch (format) {
          case 'es':
            return 'client.es.mjs'
          case 'cjs':
            return 'client.cjs.js'
          case 'iife':
            return 'client.iife.js'
          default:
            return 'client.js'
        }
      }
    },
    rollupOptions: {
      external: [
        '@noble/post-quantum',
        '@noble/hashes',
        '@urql/core',
        'graphql',
        'graphql-ws',
        'isomorphic-fetch',
        'jssha',
        'wonka',
        '@thumbmarkjs/thumbmarkjs'
      ],
      output: {
        globals: {
          '@noble/post-quantum': 'NoblePostQuantum',
          '@noble/hashes': 'NobleHashes',
          '@urql/core': 'UrqlCore',
          'graphql': 'GraphQL',
          'graphql-ws': 'GraphQLWS',
          'isomorphic-fetch': 'fetch',
          'jssha': 'jsSHA',
          'wonka': 'wonka',
          '@thumbmarkjs/thumbmarkjs': 'ThumbmarkJS'
        }
      }
    },
    outDir: resolve(__dirname, '../dist'),
    emptyOutDir: true,
    sourcemap: true,
    minify: 'esbuild'
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, '../src')
    }
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
  }
})