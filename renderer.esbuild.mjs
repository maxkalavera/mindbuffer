import { resolve } from 'node:path';
import esbuild from 'esbuild';
import { clean } from 'esbuild-plugin-clean';
import globals from './globals.mjs'

const outDir = './.package';
const config = {
  target: 'es2020',
  platform: 'browser',
  format: 'cjs',
  logLevel: "info",
  bundle: true,
  minify: false,
  sourcemap: true,
  entryPoints: ["./source/renderer/renderer.tsx"],
  outfile: resolve(outDir, './renderer.js'),
  tsconfig: './tsconfig.web.json',
  define: {
    globals: JSON.stringify(globals)
  },
  plugins: [
    clean({
      cleanOnStartPatterns: [
        './renderer.js',
      ].map((item) => resolve(outDir, item)),
    }),
  ],
}

if (process.argv.some((item) => item === '--watch')) {
  const context = await esbuild.context(config)
  await context.watch()
} else {
  await esbuild.build(config)
}
