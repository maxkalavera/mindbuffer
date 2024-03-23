import { DataTypes } from 'sequelize' 

import type { Sequelize } from 'sequelize'

export const modelDefiner =  (sequelize: Sequelize) => {
  return sequelize.define('Page', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    modelName: 'Page',
    tableName: 'pages'
  })
}

export const associationsDefiner = (sequelize: Sequelize) => {
  sequelize.models.Page.hasMany(
    sequelize.models.Note, { foreignKey: 'pageId', as: 'notes' })
  sequelize.models.Page.belongsTo(sequelize.models.Notepad, { as: 'notepad' })
}