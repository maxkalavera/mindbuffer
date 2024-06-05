import path from 'node:path'
import { app } from 'electron'
import Store from 'electron-store'

const databaseLocations = {
  'production': path.resolve(app.getPath('userData'), 'amberpad.db'),
  'development' : path.resolve('.run/amberpad.development.db'), 
  'testing': path.resolve('.run/amberpad.test.db'),
}

type StoreType = {
  sidebarAperture?: number,
  selectedPageID?: string,
  dbPath?: string,
}

const store = new Store<StoreType>({
  defaults: {
    sidebarAperture: 0.0,
    selectedPageID: '',
    dbPath: databaseLocations['production'],
  }
}) as Store<StoreType> & { set: (key: string, any) => void, get: (key: string) => any, clear: () => void, store: any }

/*  Settings setted when app is starting */
{
  store.set('dbPath', process.env.AMBERPAD_DB_PATH || databaseLocations[globals.ENVIRONMENT] || databaseLocations['production'])
}


if (globals.RESET_SETTINGS_STORE)  {
  store.clear()
  console.log('Resetting settings..')
}
if (globals.DEBUG) {
  console.log(`Settings content: ${JSON.stringify(store.store , undefined, 2)}`)
  console.log('Values of globals:', globals)
}

export default store