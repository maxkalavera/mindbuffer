import path from 'node:path';
import { _electron } from 'playwright';
import { test as base } from '@playwright/test';
import knex from 'knex'

import seed from './seed';
import emptyDatabase from './emptyDatabase';

import type { ElectronApplication } from 'playwright';

const entrypoint = path.resolve('./.package/main.mjs');
var electronApp: ElectronApplication | undefined;
var queries: knex.Knex<any, unknown[]>;

export const test = base.extend<{
  seed: (id: string) => void
}>({
  seed: async({}, use) => {
    use (
      await (async (id: string) => {
        return await seed(queries, id)
      })
    )
  },
  page: async ({}, use) => {
    electronApp = await _electron.launch({ 
      args: [entrypoint],
    });
    use(await electronApp.firstWindow());
  }
});

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
});

test.afterEach(async () => {
  electronApp && electronApp.close();
});

test.afterAll(async () => {
  queries && queries.destroy()
});