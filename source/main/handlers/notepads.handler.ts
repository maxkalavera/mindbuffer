import { app, ipcMain } from 'electron'
import { QueryTypes } from 'sequelize'

import toSerializable from '@main/utils/database/toSerializable'
import { ThrowError } from '@main/utils/errors'
import getSelectFields from '@main/utils/database/getSelectFields'
import { groupByWidthAssociations } from '@main/utils/database/groupBy'
import database from "@main/utils/database"

import type { 
  ModelQueryHandler,
  ModelCreateHandler,
  ModelUpdateHandler,
  ModelDestroyHandler,
} from '@commons/ts/handlers.types'
import type { 
  NotepadPayload, 
  Notepad, 
  NotepadFiltersPayload 
} from '@commons/ts/models/Notepads.types'

app.on('ready', () => {
  ipcMain.handle(
    'database.notepads:getAll',
    async function getAll (_, payload) {
      const options = Object.assign({
        search: '',
        pageID: undefined,
        page: 1,
        paginationOffset: 20,
        associatedPaginationPage: 1,
        associatedPaginationOffset: 50,
      }, payload)
      if (options.page < 1) options.page = 1
    
      const queryParams = {
        limit: options.paginationOffset,
        offset: options.paginationOffset * (options.page - 1),
        associatedLimitLeft: options.associatedPaginationOffset * (options.associatedPaginationPage - 1),
        associatedLimitRight: options.associatedPaginationOffset * (options.associatedPaginationPage),
      } as any

      if (options.search) {
        queryParams.search = `"${options.search}"`
      }

      try {
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
                    }
                  )
                }
            FROM "notepads"
            LEFT OUTER JOIN "pages" 
            ON "notepads"."id"="pages"."notepadId"
            WHERE
                "notepads"."id" IN (
                    SELECT id FROM "notepads" LIMIT $$limit OFFSET $$offset
                )
                ${
                  queryParams.search ?
                    `
                    AND
                    "pages"."id" IN (
                        SELECT pageId FROM "notes"
                        WHERE
                            id IN (
                                select noteID 
                                FROM searches 
                                WHERE noteContent 
                                MATCH $$search
                                ORDER BY 
                                    rank DESC, 
                                    noteID DESC
                            )  
                    )
                    ` :
                    ''

                }
        )
        WHERE
            notepadsRowNumber > $$associatedLimitLeft AND
            notepadsRowNumber <= $$associatedLimitRight
        `, {
          type: QueryTypes.SELECT,
          bind: queryParams,
          raw: true,
          nest: true,
        })
        return toSerializable({
          values: groupByWidthAssociations(data, 'id', ['pages'])
        })
      } catch (error) {
        ThrowError({ 
          content: 'Error retrieving data from database',
          error: error,
        })
      }
     return undefined
    } as ModelQueryHandler<NotepadFiltersPayload, Notepad>
  )
})

app.on('ready', () => {
  ipcMain.handle(
    'database.notepads:create',
    async function create (_, payload) {
      try {
        const response = await database.models.Notepad.bulkCreate(payload.data as any)
        return toSerializable({
          values: response.map((item) => ({
            ...item.dataValues,
            pages: [],
          }))
        })
      } catch (error) {
        ThrowError({ 
          content: 'Error retrieving data from database',
          error: error,
        })
      }
    } as ModelCreateHandler<NotepadPayload, Notepad>
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
          return toSerializable({ value: payload.value })
        }
      } catch (error) {
        ThrowError({ 
          content: 'Error retrieving data from database',
          error: error,
        })
      }
    } as ModelUpdateHandler<Notepad>
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
          return toSerializable({ value: payload.value })
        }
      } catch (error) {
        ThrowError({ 
          content: 'Error retrieving data from database',
          error: error,
        })
      }
    } as ModelDestroyHandler<Notepad>
  )
})
