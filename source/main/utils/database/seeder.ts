import type { QueryInterface } from 'sequelize'
import type { Sequelize } from 'sequelize'
import { Where } from 'sequelize/types/utils';

type SeederParams = {
  seeders?: {
    name: string;
    up: any;
    down: any;
  }[],
  context?: QueryInterface,
  resetDatabase?: boolean,
}

interface SeederType {
  up: () => void,
  down: () => void,
  emptyDatabase: () => void,
}

const Seeder = function Seeder (
  this: SeederType,
  {
  seeders=[],
  context=undefined,
}: SeederParams) {
  this.up = async function up () {
    if (context === undefined) {
      console.error('No context provided to run the seeders')
      return
    }
    for(let i = 0; i < seeders.length; i++) {
      const seeder = seeders[i]
      await seeder.up({
        context
      })
    }
  }
  this.down = async function down () {
    if (context === undefined) {
      console.error('No context provided to run the seeders')
      return
    }
    for(let i = seeders.length - 1; i >= 0; i--) {
      const seeder = seeders[i]
      await seeder.down({ 
        context
      })
    }
  }
  this.emptyDatabase = async function resetDatabase () {
    if (context === undefined) {
      console.error('No context provided to run the seeders')
      return
    }

    const models = Object.values(context.sequelize.models)
      .filter((item) => item.name !== 'SequelizeMeta')
    const transaction = await context.sequelize.transaction();
    try {
      await models.forEach(async (model) => {
        await model.truncate()
          .catch((error) => { throw error })
      })
      await transaction.commit()
    } catch (error) {
      console.error(error)
      await transaction.rollback()
    }
  }
} as any as (new (params: SeederParams) => SeederType)

export default function buildSeeder (
  sequelize: Sequelize,
) {
  const seeder = new Seeder({
    seeders: [
      {
        name: '00_initial',
        up: require('@main/assets/seeders/00_initial').up,
        down: require('@main/assets/seeders/00_initial').down
      }
    ],
    context: sequelize.getQueryInterface(),
    resetDatabase: true,
  })
  return seeder
}
