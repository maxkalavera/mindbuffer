import { DataTypes } from 'sequelize' 

import type { Sequelize } from 'sequelize'


export const definer =  (sequelize: Sequelize) => {
  return sequelize.define('Note', {
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    modelName: 'Note',
    tableName: 'notes'
  });
}
