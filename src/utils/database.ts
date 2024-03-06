import path from "path"
// @ts-ignore
import { app } from 'electron'
import { Sequelize } from "sequelize"
const { Umzug, SequelizeStorage } = require('umzug')
import migrator from '@utils/migrator'

import settings from '@utils/settings'

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: app && app.isPackaged ? 
    path.resolve(app.getPath('userData'), settings.get('dbFilename') as string) :
    path.join(settings.get('rootDir') as string, '.webpack', settings.get('dbFilename') as string)
})

const umzug = migrator(sequelize)

/*
const umzug = new Umzug({
  migrations: { glob: settings.get('migrationsGlob') },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
})
*/

const modelDefiners: ((sequelize: Sequelize) => void)[] = [
  require('@models/Note.model').definer
]
modelDefiners.forEach(async (definer) => definer(sequelize))

export default {
  sequelize: sequelize,
  models: sequelize.models,
  init: async function () {
    await umzug.up()
  },
  testConnection: async function () {
    try {
      await this.sequelize.authenticate()
      console.log('Connection to database has been established successfully.')
      return true
    } catch (error) {
      console.error('Unable to connect to the database:', error)
      return false
    }
  }
}
