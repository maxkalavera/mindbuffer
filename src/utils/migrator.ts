
const { Umzug, SequelizeStorage } = require('umzug')

import type { Sequelize } from 'sequelize'

export default (sequelize: Sequelize) => {
  const umzug = new Umzug({
    migrations: [
      {
        // the name of the migration is mandatory
        name: '00_initial',
        up: require('@assets/migrations/00_initial').up,
        down: require('@assets/migrations/00_initial').down
      },
    ],
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize }),
    logger: console,
  })
  return umzug 
}


