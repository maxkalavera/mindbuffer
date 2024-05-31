import path from 'node:path';
import { unlink } from 'node:fs';
import { _electron } from 'playwright';
import { test as base } from '@playwright/test';
import knex from 'knex'

import seed from './seed';
//import emptyDatabase from './emptyDatabase';

import type {Page} from '@playwright/test'
//import type { ElectronApplication } from 'playwright';

const entrypoint = path.resolve('./.package/main.mjs');
//var electronApp: ElectronApplication | undefined;
//var queries: knex.Knex<any, unknown[]>;

type DatabaseType = knex.Knex<any, unknown[]> & {
  destroyDatase: () => Promise<void>
}

const connectDatabase = async (id: string): Promise<DatabaseType> => {
  const queries = knex({
    client: 'sqlite3',
    debug: global.DEBUG,
    connection: {
      filename: path.resolve(`.run/mindbuffer.test${id ? ('.' + id) : ''}.db`) as string,
    },
    useNullAsDefault: true,
  })

  await queries.migrate.up({
    directory: path.resolve('./resources/migrations'),
    extension: 'ts',
    tableName: 'knex_migrations'
  })

  return queries as DatabaseType;
}

// Extend the Test object with electron connection and database utilities
export const test = base.extend<{
  seed: (id: string) => Promise<void>,
  //setupDatabase: (id: string) => Promise<void>,
  launchElectron: (id?: string) => Promise<Page>
}>({
  seed: async({}, use) => {
    use (async (id: string) => {
      //return await seed(queries, id)
    })
  },
  /*
  setupDatabase: async({}, use) => use (async (id: string) => {
    test.context = {
      databaseID: id,
      queries: await connectDatabase(id),
    };
    await seed(test.context.queries, id);
  }),
  */
  launchElectron: async({}, use) => use(async (_id) => {
    // If not ID generate a random one
    const id = _id || Math.floor(Math.random() * 0xffffffffff).toString(16).padEnd(10, '0');
    const queries = await connectDatabase(id);
    try {
      id && await seed(queries, id);
    } catch (error) {
      if (error.code === 'ERR_MODULE_NOT_FOUND' && _id) {
        console.warn(`Seed '${_id}' was not found in the seeds folder`);
      } else if (error.code !== 'ERR_MODULE_NOT_FOUND') {
        throw error;
      }
    }

    /* @ts-ignore */
    test.context = {id, queries};
    const electronApp = await _electron.launch({ 
      args: [entrypoint],
      env: {
        ...process.env,
        MINDBUFFER_DB_PATH: `.run/mindbuffer.test${id ? ('.' + id) : ''}.db`,
      }
    });
    //electronApp.on('console', async msg => { console.log(msg); });
    return await electronApp.firstWindow();
  }),
  page: async ({}, use) => {
    use(undefined as never);
  }
  /*
  page: async ({}, use) => {
    const electronApp = await _electron.launch({ 
      args: [entrypoint],
    });
    use(await electronApp.firstWindow());
  }
  */
});

test.afterEach(async ({}) => {
  /* @ts-ignore */
  if (test.context) {
    /* @ts-ignore */
    const {id, queries} = test.context;
    await queries.destroy();
    unlink(
      `.run/mindbuffer.test.${id ? ('.' + id) : ''}.db`, 
      (error) => error // If errors ignore
    );
  }
})

/*
test.beforeAll(async () => {
  try {
    queries = knex({
      client: 'sqlite3',
      debug: global.DEBUG,
      connection: {
        filename: path.resolve('.run/mindbuffer.test.db') as string,
      },
      useNullAsDefault: true,
    })
  } catch (error) {
    console.error(error);
  }
  console.log('CONNECTING DATABASE')

  try {
    await queries.migrate.up({
      directory: path.resolve('./resources/migrations'),
      extension: 'ts',
      tableName: 'knex_migrations'
    })
  } catch (error) {
    console.error(error);
  }
});

test.beforeEach(async () => {
  await emptyDatabase(queries)
  console.log('DATABASE RESETED')
});

test.afterEach(async () => {
  electronApp && await electronApp.close();
});

test.afterAll(async () => {
  queries && queries.destroy()
});
*/