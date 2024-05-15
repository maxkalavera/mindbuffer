import { DataTypes } from 'sequelize' 

import type { Sequelize } from 'sequelize'

export const modelDefiner =  (sequelize: Sequelize) => {
  return sequelize.define('Notepad', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    modelName: 'Notepad',
    tableName: 'notepads'
  })
}

export const associationsDefiner = (sequelize: Sequelize) => {
  sequelize.models.Notepad.hasMany(
    sequelize.models.Page, { foreignKey: 'notepadId', as: 'pages' })
}