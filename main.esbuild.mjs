import { readFileSync} from 'node:fs';
import { resolve } from 'node:path';
import esbuild from 'esbuild';
import { nodeExternalsPlugin } from 'esbuild-node-externals';
import { copy } from 'esbuild-plugin-copy';
import { clean } from 'esbuild-plugin-clean';
import writeFilePlugin from 'esbuild-plugin-write-file';
import globals from './globals.esbuild.mjs'

const pkg = JSON.parse(readFileSync(resolve('./package.json'), { encoding: 'utf8' }));
const outDir = './.package';

await esbuild.build({
  target: 'node20',
  platform: 'node',
  format: 'esm',
  logLevel: "info",
  bundle: true,
  minify: false,
  sourcemap: true,
  entryPoints: ["./source/main/main.ts"],
  outfile: resolve(outDir, './main.mjs'),
  tsconfig: './tsconfig.json',
  external: [
    'electron',
    'sqlite3'
  ],
  define: {
    globals: JSON.stringify(globals)
  },
  plugins: [
    nodeExternalsPlugin(),
    copy({
      assets: [
        {
          from: ['./resources/**/*'],
          to: ['./resources'],
        },
        {
          from: globals.ENVIRONMENT === 'testing' ? 
            ['./electron-builder.test.config.ts'] : 
            ['./electron-builder.config.ts'],
          to: ['./electron-builder.config.ts']
        }
      ],
      watch: false,
    }),
    writeFilePlugin({
      after: {
        [resolve(outDir, './package.json')]: JSON.stringify({
          main: "main.mjs",
          //type: "module",
          name: pkg.name,
          version: pkg.version,
          license: pkg.license,
          description: pkg.description,
          repository: pkg.repository,
          devDependencies: {
            "electron": pkg.devDependencies.electron,
            "sqlite3": pkg.devDependencies.sqlite3,
          },
        }, null, 4)
      }
    }),
    clean({
      cleanOnStartPatterns: [
        './main.mjs',
        './resources',
        './electron-builder.config.ts',
        './package.json',
      ].map((item) => resolve(outDir, item)),
    }),
  ],
}).catch(() => process.exit(1));