import { app, ipcMain } from 'electron'
import { QueryTypes } from 'sequelize'

import getSelectFields from '@utils/database/getSelectFields'
import { groupByWidthAssociations } from '@utils/database/groupBy'
import database from "@utils/database"

import type { 
  QueryHandler,
  CreateHandler,
  UpdateHandler,
  DestroyHandler,
} from '@src/ts/handlers.types'
import type { 
  NotepadID, 
  NotepadPayload, 
  Notepad, 
  NotepadFiltersPayload 
} from '@ts/models/Notepads.types'

app.on('ready', () => {
  ipcMain.handle(
    'database.notepads:getAll',
    async function getAll (_, payload) {
      const options = Object.assign({
        search: '',
        page: 1,
        paginationOffset: 20,
        associatedPage: 1,
        associatedPaginationOffset: 20,
      }, payload)
      if (options.page < 1) options.page = 1
    
      try {
        const searchKeywords = options.search === '' ?
          [] : 
          options.search.toLowerCase().split(/\s+/)
        const data = await database.sequelize.query(`
        SELECT * 
        FROM (
            SELECT
                ROW_NUMBER () OVER (
                    PARTITION BY "notepads"."id"
                    ORDER BY "pages"."createdAt"
                ) as notepadsRowNumber,
                ${
                  getSelectFields(database.models.Notepad)
                },
                ${
                  getSelectFields(
                    database.models.Page, 
                    {
                      as: ({ fieldName }) => `pages.${fieldName}`
                    })
                }
            FROM "notepads"
            LEFT OUTER JOIN "pages" 
            ON "notepads"."id"="pages"."notepadId"
            WHERE
                "notepads"."id" IN (
                    SELECT id FROM "notepads" LIMIT ? OFFSET ?
                )
        )
        WHERE
            notepadsRowNumber > ? AND
            notepadsRowNumber <= ?
        `, {
          type: QueryTypes.SELECT,
          replacements: [
            options.paginationOffset,
            options.paginationOffset * (options.page - 1),
            options.associatedPaginationOffset * (options.associatedPage - 1),
            options.associatedPaginationOffset * (options.associatedPage),
          ],
          raw: true,
          nest: true,
        })
        return {
          values: groupByWidthAssociations(data, 'id', ['pages'])
        }
      } catch (error) {
        console.error(error)
      } 
    } as QueryHandler<NotepadFiltersPayload, Notepad>
  )
})

app.on('ready', () => {
  ipcMain.handle(
    'database.notepads:create',
    async function create (_, payload) {
      try {
        const response = await database.models.Notepad.bulkCreate(payload.data as any)
        return {
          values: response.map((item) => ({
            ...item.dataValues,
            pages: [],
          }))
        }
      } catch (error) {
        console.error(error)
      }
    } as CreateHandler<NotepadPayload, Notepad>
  )
})

app.on('ready', () => {
  ipcMain.handle(
    'database.notepads:update',
    async function update (_, payload) {
      try {
        const response = await database.models.Notepad.update(
          payload.value, 
          { where: { id: payload.value.id } }
        )

        if (response[0] === 1) {
          return { value: payload.value }
        }
      } catch (error) {
        console.error(error)
      }
    } as UpdateHandler<Notepad>
  )
})

app.on('ready', () => {
  ipcMain.handle(
    'database.notepads:destroy',
    async function destroy (_, payload) {
      try {
        const response = await database.models.Notepad.destroy({ 
          where: { id: payload.value.id } 
        })
        if (response === 1) {
          return { value: payload.value }
        }
      } catch (error) {
        console.error(error)
      }
    } as DestroyHandler<Notepad>
  )
})
