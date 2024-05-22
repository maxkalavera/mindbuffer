import { app, ipcMain } from 'electron'

import { ThrowError } from '@main/utils/errors'
import database from '@main/utils/database'

import type { 
  ModelQueryHandler,
  ModelCreateHandler,
  ModelUpdateHandler,
  ModelDestroyHandler,
} from '@commons/ts/handlers.types'
import type {
  NotePayload, 
  NotesFiltersPayload, 
  Note 
} from '@commons/ts/models/Notes.types'

app.on('ready', () => {
  ipcMain.handle(
    'database.notes:getAll',
    async function getAll (_, payload) {
      /* 
        -- Raw query
        -- pageID or 0
        -- search or ''

        SELECT *
        FROM `notes`
        WHERE IIF(?=0, 1, pageID=?)
          AND IIF(?='', 1, id in
                    (SELECT noteID
                    FROM searches
                    WHERE noteContent MATCH ?
                    ORDER BY rank DESC, noteID DESC))
      */
      const options = Object.assign({
        search: null,
        pageID: null,
        page: 1,
        paginationOffset: globals.PAGINATION_OFFSET
      }, payload)
      options.page = options.page < 1 ? 1 : options.page

      try {
        const knex = database.knex
        const data = await knex('notes')
          .select('*')
          .where(knex.raw(
            `IIF(?=0, 1, pageID=?)`,
            [
              options.pageID || 0,
              options.pageID || 0
            ]
          ))
          .andWhere(knex.raw(
            `IIF(?='', 1, id in
                (SELECT noteID
                FROM searches
                WHERE noteContent MATCH ?
                ORDER BY rank DESC, noteID DESC))
            `, 
            [
              options.search || '', 
              `"${options.search}"` || '""'
            ]
          ))
          .limit(options.paginationOffset)
          .offset(options.paginationOffset * (options.page - 1))
        return {
          values: data
        } 
      } catch (error) {
        ThrowError({ 
          content: 'Error retrieving data from database',
          error: error,
        })
      } 
    }  as ModelQueryHandler<NotesFiltersPayload, Note>
  )
})

app.on('ready', () => {
  ipcMain.handle(
    'database.notes:create',
    async function create (_, payload) {
      try {
        const knex = database.knex
        const data = await knex('notes')
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
    } as ModelCreateHandler<NotePayload, Note>
  )
})

app.on('ready', () => {
  ipcMain.handle(
    'database.note:update',
    async function update (_, payload) {
      try {
        const knex = database.knex
        const data = await knex('notes')
          .where({ id: payload.value.id })
          .update(payload.value, '*')

        if (data.length === 0) {
          throw('Row could not been updated')
        }
        return {value: data as any}
      } catch (error) {
        ThrowError({ 
          content: 'Row could not been updated',
          error: error,
        })
      }
    } as ModelUpdateHandler<Note>
  )
})

app.on('ready', () => {
  ipcMain.handle(
    'database.notes:destroy',
    async function destroy (_, payload) {
      try {
        const knex = database.knex
        const data = await knex('notes')
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
    } as ModelDestroyHandler<Note>
  )
})
