import path from 'path'
import Store from 'electron-store'

const rootDir = path.dirname(path.dirname(path.dirname(__filename)))
const srcDir = path.resolve(rootDir, 'src')

const store = new Store({
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
    sidebarAperture: {
      type: 'number',
      default: 0.0,
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

store.set('debug', (process.env.MINDBUFFER_DEBUG || '').toLowerCase() === 'true')

if ((process.env.MINDBUFFER_RESET_STORE || '').toLowerCase() === 'true')  {
  store.clear()
  console.log('Resetting store...')
}
if (store.get('debug')) console.log('Settings', store.store)

export default store