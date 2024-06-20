import path from 'node:path'
import fs from 'node:fs'
import { app } from 'electron'
import knex from 'knex'

import { getResourcesDir } from "@main/utils/resources"
import { ThrowFatalError } from '@main/utils/errors';

/******************************************************************************
 * Set up database location
 ******************************************************************************/

const databaseLocations = {
  'production': path.resolve(app.getPath('userData'), 'amberpad.db'),
  'development' : path.resolve('.run/amberpad.development.db'), 
  'testing': path.resolve('.run/amberpad.test.db'),
}
const databasePath = (
  process.env.__TESTING_ENVRONMENT_DB_PATH ||  
  databaseLocations[globals.ENVIRONMENT] || 
  databaseLocations['production']
)
// Create folder for db if it doesn't exists
if (!fs.existsSync(path.dirname(databasePath))){
  fs.mkdirSync(path.dirname(databasePath))
}

/******************************************************************************
 * Export database object
 ******************************************************************************/

export default {
  queriesManager: undefined,
  connectDatabase: async function () {
    this.queriesManager = await knex({
      client: 'better-sqlite3',
      debug: globals.DEBUG,
      connection: {
        filename: databasePath,
      },
      useNullAsDefault: true,
    });
    return this.queriesManager;
  },
  init: async function () {
    if (this.queriesManager === undefined) {
      this.queriesManager = await this.connectDatabase();
    }

    // Run setup migrations
    try {
      await this.queriesManager.migrate.up({
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
    return this
  },
  destroy: async function () {
    this.queriesManager.destroy();
  },
  getManager: async function () {
    if (this.queriesManager === undefined) {
      this.queriesManager = await this.connectDatabase();
    }
    return this.queriesManager;
  },
  testConnection: async function (): Promise<Boolean> {
    try {
      await this.queriesManager.raw('SELECT 1')
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