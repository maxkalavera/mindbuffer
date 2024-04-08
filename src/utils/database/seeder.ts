import type { QueryInterface } from 'sequelize'
import type { Sequelize } from 'sequelize'

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
    const tables = (await context.showAllTables())
      .filter((item) => item !== 'SequelizeMeta')
    for(let i = 0; i < tables.length; i++) {
      const tableName = tables[i]
      const res = await context.bulkDelete(
        tableName, 
        {}, 
        {
          // @ts-ignore
          cascade: true
        }
      )
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
        up: require('@assets/seeders/00_initial').up,
        down: require('@assets/seeders/00_initial').down
      }
    ],
    context: sequelize.getQueryInterface(),
    resetDatabase: true,
  })
  return seeder
}
