import { DataTypes } from 'sequelize' 

import type { Sequelize } from 'sequelize'

export const modelDefiner =  (sequelize: Sequelize) => {
  return sequelize.define('Note', {
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    pageId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: 'pages',
				key: 'id'
			},
			onDelete: 'CASCADE',
			onUpdate: 'NO ACTION'
    },
  }, {
    modelName: 'Note',
    tableName: 'notes'
  })
}

export const associationsDefiner = (sequelize: Sequelize) => {
  sequelize.models.Note.belongsTo(
    sequelize.models.Page, 
    { as: 'page' },
  )
}