import { Sequelize } from "sequelize"
import sqlite3 from 'sqlite3'

import { ThrowFatalError } from "@main/utils/errors"
import buildSeeder from "@main/utils/database/seeder"
import buildMigrator from '@main/utils/database/migrator'
import settings from '@main/utils/settings'

const MINDBUFFER_APPLY_TESTING_DATA = (process.env.MINDBUFFER_APPLY_TESTING_DATA || '').toLowerCase() === 'true'

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  dialectModule: sqlite3,
  logging: settings.get('debug') as boolean,
  storage: settings.get('dbPath') as string,
})

const umzug = buildMigrator(sequelize)
const seeder = buildSeeder(sequelize)

const modelDefiners: ((sequelize: Sequelize) => void)[] = [
  require('@main/models/Note.model').modelDefiner,
  require('@main/models/Notepad.model').modelDefiner,
  require('@main/models/Page.model').modelDefiner,
]
modelDefiners.forEach(async (definer) => definer(sequelize))

const associationsDefiners: ((sequelize: Sequelize) => void)[] = [
  require('@main/models/Note.model').associationsDefiner,
  require('@main/models/Notepad.model').associationsDefiner,
  require('@main/models/Page.model').associationsDefiner,
]
associationsDefiners.forEach(async (definer) => definer(sequelize))

export default {
  sequelize: sequelize,
  models: sequelize.models,
  init: async function () {
    try {
      await umzug.up()
    } catch (error) {
      ThrowFatalError({
        content: 'Unable connecting to the database, the app will be closed',
        error: error,
      })
    }
    if (globals.ENVIRONMENT === 'testing' || MINDBUFFER_APPLY_TESTING_DATA) {
      await seeder.emptyDatabase()
      await seeder.up()
    }
  },
  testConnection: async function () {
    try {
      await this.sequelize.authenticate()
      return true
    } catch (error) {
      ThrowFatalError({
        content: 'Unable connecting to the database, the app will be closed'
      })
      return false
    }
  }
}
