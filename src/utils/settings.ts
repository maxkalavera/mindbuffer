import path from 'path'
import Store from 'electron-store'

const rootDir = path.dirname(path.dirname(path.dirname(__filename)))
const srcDir = path.resolve(rootDir, 'src')

const settings = new Store({
  schema: {
    debug: {
      type: 'boolean',
      default: false
    },
    rootDir: {
      type: 'string',
      default: rootDir
    },
    srcDir: {
      type: 'string',
      default: srcDir
    },
    migrationsGlob: {
      type: 'string',
      default: path.resolve(srcDir, 'assets/migrations/*.{js,cjs,mjs,ts,cts,mts,sql}')
    },
    dbFilename: {
      type: 'string',
      default: 'mindbuffer.db'
    },
  }
})

settings.set('debug', (process.env.MINDBUFFER_DEBUG || '').toLowerCase() === 'true')

if ((process.env.MINDBUFFER_RESET_SETTINGS || '').toLowerCase() === 'true')  {
  settings.clear()
  console.log('Resetting settings...')
}
if (settings.get('debug')) console.log('Settings', settings.store)

export default settings