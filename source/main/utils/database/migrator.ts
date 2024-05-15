
import { Umzug, SequelizeStorage } from 'umzug'

import type { Sequelize } from 'sequelize'

export default function buildMigrator (sequelize: Sequelize) {
  const umzug = new Umzug({
    migrations: [
      {
        // the name of the migration is mandatory
        name: '00_initial',
        up: require('@main/assets/migrations/00_initial').up,
        down: require('@main/assets/migrations/00_initial').down
      },
      {
        name: '01_groups',
        up: require('@main/assets/migrations/01_groups').up,
        down: require('@main/assets/migrations/01_groups').down
      },
      {
        name: '02_searches',
        up: require('@main/assets/migrations/02_searches').up,
        down: require('@main/assets/migrations/02_searches').down
      }
    ],
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize }),
    logger: console,
  })
  return umzug 
}
