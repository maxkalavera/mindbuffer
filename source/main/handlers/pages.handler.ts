import { app, ipcMain } from 'electron'
import { unflatten } from "flat"

import { ThrowError } from '@main/utils/errors'
import databaseAlt from '@main/utils/database.bettersqlite3'

import type { 
  QueryHandler,
  ModelQueryHandler,
  ModelCreateHandler,
  ModelUpdateHandler,
  ModelDestroyHandler,
} from '@commons/ts/handlers.types'
import type { 
  PagePayload, 
  Page, 
  PageID,
  PagesFiltersPayload 
} from '@commons/ts/models/Pages.types'
import { Notepad } from '@commons/ts/models/Notepads.types'
import knex from 'knex'

app.on('ready', () => {
  ipcMain.handle(
    'database.pages:getAll',
    async function getAll (_, payload) {
      const options = Object.assign({
        page: 1,
        paginationOffset: globals.ASSOCIATED_PAGES_PAGINATION_OFFSET,
      }, payload)
      options.page = options.page < 1 ? 1 : options.page

      const data = await knex('pages')
        .select('*')
        .limit(options.paginationOffset)
        .offset(options.paginationOffset * (options.page - 1))

      return {
        values: data
      }
    } as ModelQueryHandler<PagesFiltersPayload, Page>
  )
})

app.on('ready', () => {
  ipcMain.handle(
    'database.pages:get',
    async function get (_, payload) {
      const knex = databaseAlt.knex
      const notepadsColumns = Object.keys(await knex('notepads').columnInfo())
      const pagesColumns = Object.keys(await knex('pages').columnInfo())
      const data = await knex('pages')
        .select([
          ...(pagesColumns.map((item) => ({[item]: `pages.${item}`}))),
          ...(notepadsColumns.map((item) => ({[`notepad.${item}`]: `notepads.${item}`})))
        ])
        .from('pages')
        .leftJoin('notepads', 'pages.notepadID', 'notepads.id')
        .where({ 'pages.id': payload.pageID })

      if (data.length === 0) {
        throw('Row could not been got from database')
      }
      return {value: unflatten(data[0])}
    }  as QueryHandler<{ pageID: PageID}, { value: Page & { notepad: Notepad } }>
  )
})

app.on('ready', () => {
  ipcMain.handle(
    'database.pages:create',
    async function create (_, payload) {
      try {
        const knex = databaseAlt.knex
        const data = await knex('pages')
          .returning('*')
          .insert(payload.data)
        return {
          values: data as any[]
        }
      } catch (error) {
        ThrowError({ 
          content: 'Row could not been created',
          error: error,
        })
      }
    } as ModelCreateHandler<PagePayload, Page>
  )
})

app.on('ready', () => {
  ipcMain.handle(
    'database.pages:update',
    async function update (_, payload) {
      try {
        const knex = databaseAlt.knex
        const data = await knex('pages')
          .where({ id: payload.value.id })
          .update(payload.value, '*')
        
        if (data.length === 0) {
          throw('Row could not been updated')
        }
        return {value: data[0] as any}
      } catch (error) {
        ThrowError({ 
          content: 'Row could not been updated',
          error: error,
        })
      }
    } as ModelUpdateHandler<Page>
  )
})

app.on('ready', () => {
  ipcMain.handle(
    'database.pages:destroy',
    async function destroy (_, payload) {
      try {
        const knex = databaseAlt.knex
        const data = await knex('pages')
          .where({ id: payload.value.id })
          .delete('*')

        if (data.length === 0) {
          throw('Row could not been removed')
        }
        return {
          value: {
            id: undefined,
            ...payload.value
          }
        }
      } catch (error) {
        ThrowError({ 
          content: 'Row could not been removed',
          error: error,
        })
      }
    } as ModelDestroyHandler<Page>
  )
})
