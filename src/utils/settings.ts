import path from 'path'
import { app } from 'electron'
import Store from 'electron-store'

const environment = __ENVIRONMENT__ as 'development' | 'production' | 'testing';
const debug = __DEBUG__ as boolean;

const rootDir = path.dirname(path.dirname(path.dirname(__filename)))
const srcDir = path.resolve(rootDir, 'src')

const store = new Store({
  schema: {
    debug: {
      type: 'boolean',
      default: true
    },
    sidebarAperture: {
      type: 'number',
      default: 0.0,
    },
    selectedPageID: {
      type: 'string',
      default: ''
    },
    migrationsGlob: {
      type: 'string',
      default: path.resolve(srcDir, 'assets/migrations/*.{js,cjs,mjs,ts,cts,mts,sql}')
    },
    dbPath: {
      type: 'string',
    },
  }
})

store.set('dbPath', {
  'development' : '.run/mindbuffer.db', 
  'production': path.resolve(app.getPath('userData'), 'mindbuffer.db'),
  'testing': '.run/mindbuffer.test.db',
}[environment] || path.resolve(app.getPath('userData'), 'mindbuffer.db'))
store.set('debug', debug)

if ((process.env.MINDBUFFER_RESET_SETTINGS_STORE || '').toLowerCase() === 'true')  {
  store.clear()
  console.log('Resetting settings..')
}
if (store.get('debug')) {
  console.log(`Settings content: ${JSON.stringify(store.store , undefined, 2)}`)
}

export default store