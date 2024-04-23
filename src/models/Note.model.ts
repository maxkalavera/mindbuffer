import { DataTypes } from 'sequelize' 

import type { Sequelize } from 'sequelize'

export const modelDefiner =  (sequelize: Sequelize) => {
  return sequelize.define('Note', {
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
  }, {
    modelName: 'Note',
    tableName: 'notes'
  })
}

export const associationsDefiner = (sequelize: Sequelize) => {
  sequelize.models.Note.belongsTo(
    sequelize.models.Page, 
    { as: 'page' }
  )
}