import { readFileSync} from 'node:fs';
import { resolve } from 'node:path';
import esbuild from 'esbuild';
import { nodeExternalsPlugin } from 'esbuild-node-externals';
import { copy } from 'esbuild-plugin-copy';
import { clean } from 'esbuild-plugin-clean';
import writeFilePlugin from 'esbuild-plugin-write-file';
import globals from './globals.mjs'

const pkg = JSON.parse(readFileSync(resolve('./package.json'), { encoding: 'utf8' }));
const outDir = './.package';

await esbuild.build({
  target: 'node20',
  platform: 'node',
  format: 'esm',
  bundle: true,
  minify: globals.ENVIRONMENT === 'production' ? true : false,
  sourcemap: globals.ENVIRONMENT === 'production' ? false : true,
  logLevel: globals.ENVIRONMENT === 'production' ? 'silent' : "info",
  entryPoints: ["./source/main/main.ts"],
  outfile: resolve(outDir, './main.mjs'),
  tsconfig: './tsconfig.json',
  external: pkg.electronMainDependencies || ['electron'],
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
          name: pkg.name,
          version: pkg.version,
          license: pkg.license,
          description: pkg.description,
          repository: pkg.repository,
          scripts: {
            "rebuild": "electron-rebuild -f -w better-sqlite3",
            //"postinstall": "electron-builder install-app-deps"
          },
          devDependencies: Object.fromEntries(
            Object.entries(pkg.devDependencies || {}).filter(([module, _]) => [
              'electron',
              'electron-rebuild'
            ].some(item => item === module))),
          dependencies: pkg.dependencies || {},
        }, null, 4)
      }
    }),
    clean({
      cleanOnStartPatterns: [
        './main.mjs',
        './main.mjs.map',
        './resources',
        './electron-builder.config.ts',
        './package.json',
      ].map((item) => resolve(outDir, item)),
    }),
  ],
}).catch(() => process.exit(1));