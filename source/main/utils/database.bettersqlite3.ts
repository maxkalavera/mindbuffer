import path from 'node:path'
import fs from 'node:fs'
import knex from 'knex'

import { getResourcesDir } from "@main/utils/resources"
import settings from '@main/utils/settings'
import { ThrowFatalError } from '@main/utils/errors';

// Create folder for db if it doesn't exists
if (!fs.existsSync(path.dirname(settings.get('dbPath')))){
  fs.mkdirSync(path.dirname(settings.get('dbPath')))
}
const QueriesManager = knex({
  client: 'better-sqlite3',
  debug: globals.DEBUG,
  connection: {
    filename: settings.get('dbPath') as string,
  },
  useNullAsDefault: true,
})

export default {
  knex: QueriesManager,
  init: async function () {
    // Run setup migrations
    try {
      await QueriesManager.migrate.up({
        directory: path.resolve(getResourcesDir(), './migrations'),
        extension: 'ts',
        tableName: 'knex_migrations'
      })
    } catch (error) {
      ThrowFatalError({
        content: 'Unable to set up the database, the app will be closed',
        error: error,
      })
    }
  },
  testConnection: async function (): Promise<Boolean> {
    try {
      await QueriesManager.raw('SELECT 1')
      return true
    } catch (error) {
      ThrowFatalError({
        content: 'Unable to connect to the database, the app will be closed',
        error: error,
      })
      return false
    }
  }
}