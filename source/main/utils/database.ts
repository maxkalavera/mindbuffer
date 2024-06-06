import path from 'node:path'
import fs from 'node:fs'
import knex from 'knex'

import settings from '@main/utils/settings'
import { getResourcesDir } from "@main/utils/resources"
import { ThrowFatalError } from '@main/utils/errors';

// Create folder for db if it doesn't exists
if (!fs.existsSync(path.dirname(settings.get('dbPath')))){
  fs.mkdirSync(path.dirname(settings.get('dbPath')))
}
/*
const QueriesManager = knex({
  client: 'better-sqlite3',
  debug: globals.DEBUG,
  connection: {
    filename: settings.get('dbPath') as string,
  },
  useNullAsDefault: true,
})
*/

export default {
  //knex: QueriesManager,
  queriesManager: undefined,
  connectDatabase: async function () {
    this.queriesManager = await knex({
      client: 'better-sqlite3',
      debug: globals.DEBUG,
      connection: {
        filename: settings.get('dbPath') as string,
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