import path from "path"
// @ts-ignore
import { app } from 'electron'
import { Model, Sequelize } from "sequelize"

import migrator from '@utils/migrator'
import store from '@utils/store'

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: app && app.isPackaged ? 
    path.resolve(app.getPath('userData'), store.get('dbFilename') as string) :
    path.join(store.get('rootDir') as string, '.run', store.get('dbFilename') as string)
})

const umzug = migrator(sequelize)

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
