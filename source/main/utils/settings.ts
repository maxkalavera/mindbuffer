import path from 'path'
import { app } from 'electron'
import Store from 'electron-store'

type StoreType = {
  debug?: boolean,
  sidebarAperture?: number,
  selectedPageID?: string,
  migrationsGlob?: string,
  dbPath?: string,
}

const store = new Store<StoreType>({
  defaults: {
    sidebarAperture: 0.0,
    selectedPageID: '',
    migrationsGlob: path.resolve('../', 'assets/migrations/*.{js,cjs,mjs,ts,cts,mts,sql}'),
    dbPath: {
      'development' : '.run/mindbuffer.db', 
      'production': path.resolve(app.getPath('userData'), 'mindbuffer.db'),
      'testing': '.run/mindbuffer.test.db',
    }[globals.ENVIRONMENT] || path.resolve(app.getPath('userData'), 'mindbuffer.db'),
  }
}) as Store<StoreType> & { set: (key: string, any) => void, get: (key: string) => any, clear: () => void, store: any }

if (globals.RESET_SETTINGS_STORE)  {
  store.clear()
  console.log('Resetting settings..')
}
if (globals.DEBUG) {
  console.log(`Settings content: ${JSON.stringify(store.store , undefined, 2)}`)
  console.log('Values of globals:', globals)
}

export default store