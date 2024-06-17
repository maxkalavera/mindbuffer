import { resolve } from 'node:path';
import esbuild from 'esbuild';
import { nodeExternalsPlugin } from 'esbuild-node-externals';
import { clean } from 'esbuild-plugin-clean';
import globals from './globals.mjs'

const outputDir = './.package';
const isPackaged = globals.ENVIRONMENT === 'production' || 
  (globals.ENVIRONMENT === 'testing' && !globals.DEBUG)

await esbuild.build({
  target: 'es2020',
  platform: 'browser',
  format: 'cjs',
  logLevel: "info",
  bundle: true,
  minify: !!isPackaged,
  sourcemap: !isPackaged,
  logLevel: isPackaged ? 'silent' : "info",
  entryPoints: ["./source/preload.ts"],
  outfile: resolve(outputDir, './preload.js'),
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
        './preload.js.map',
      ].map((item) => resolve(outputDir, item)),
    }),
  ],
}).catch(() => process.exit(1));