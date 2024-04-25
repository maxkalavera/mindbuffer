import path from "path"
import { app } from 'electron'
import { Sequelize } from "sequelize"
import sqlite3 from 'sqlite3'

import { ThrowFatalError } from "@src/utils/errors"
import buildSeeder from "@utils/database/seeder"
import buildMigrator from '@utils/database/migrator'
import settings from '@utils/settings'

const MINDBUFFER_APPLY_TESTING_DATA = (process.env.MINDBUFFER_APPLY_TESTING_DATA || '').toLowerCase() === 'true'
const IS_PRODUCTION = app && app.isPackaged 

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  dialectModule: sqlite3,
  logging: settings.get('debug') as boolean,
  storage: (IS_PRODUCTION ? 
    path.resolve(app.getPath('userData'), settings.get('dbFilename') as string) :
    path.join(settings.get('rootDir') as string, '.run', settings.get('dbFilename') as string)
  ),
})

const umzug = buildMigrator(sequelize)
const seeder = buildSeeder(sequelize)

const modelDefiners: ((sequelize: Sequelize) => void)[] = [
  require('@models/Note.model').modelDefiner,
  require('@models/Notepad.model').modelDefiner,
  require('@models/Page.model').modelDefiner,
]
modelDefiners.forEach(async (definer) => definer(sequelize))

const associationsDefiners: ((sequelize: Sequelize) => void)[] = [
  require('@models/Note.model').associationsDefiner,
  require('@models/Notepad.model').associationsDefiner,
  require('@models/Page.model').associationsDefiner,
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
    if (!IS_PRODUCTION && MINDBUFFER_APPLY_TESTING_DATA) {
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
