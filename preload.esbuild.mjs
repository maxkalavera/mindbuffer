import { resolve } from 'node:path';
import esbuild from 'esbuild';
import { nodeExternalsPlugin } from 'esbuild-node-externals';
import { clean } from 'esbuild-plugin-clean';
import globals from './globals.esbuild.mjs'

const outDir = './.package';

await esbuild.build({
  target: 'es2020',
  platform: 'browser',
  format: 'cjs',
  logLevel: "info",
  bundle: true,
  minify: false,
  sourcemap: true,
  entryPoints: ["./source/preload.ts"],
  outfile: resolve(outDir, './preload.js'),
  tsconfig: './tsconfig.json',
  external: [
    'electron',
  ],
  define: {
    globals: JSON.stringify(globals)
  },
  plugins: [
    nodeExternalsPlugin(),
    clean({
      cleanOnStartPatterns: [
        './preload.js',
      ].map((item) => resolve(outDir, item)),
    }),
  ],
}).catch(() => process.exit(1));