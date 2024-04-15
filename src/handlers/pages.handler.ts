import { app, ipcMain } from 'electron'
import { QueryTypes } from 'sequelize'

import { groupByWidthAssociations } from '@utils/database/groupBy'
import getSelectFields from '@utils/database/getSelectFields'
import database from "@utils/database"

import type { 
  ModelQueryHandler,
  ModelCreateHandler,
  ModelUpdateHandler,
  ModelDestroyHandler,
} from '@src/ts/handlers.types'
import type { 
  PagePayload, 
  Page, 
  PageFiltersPayload 
} from '@ts/models/Pages.types'

app.on('ready', () => {
  ipcMain.handle(
    'database.pages:getAll',
    async function getAll (_, payload) {
      const options = Object.assign({
        search: '',
        paginationOffset: 50,
      }, payload)    
      options.notepads.map((item) => item.page < 1 ?
        {
          ...item,
          page: 1
        } :
        item
      )
      if (options.notepads.length === 0)
        return

      const data = await database.sequelize.query(`
        ${
          options.notepads.map((notepad) => 
            `
            SELECT *
            FROM (
              SELECT
                ROW_NUMBER () OVER (
                  ORDER BY "pages"."createdAt"
                ) as rowNumber,
                ${getSelectFields(database.models.Page, {
                  as: ({ tableName, fieldName }) => fieldName === 'notepadId' ?
                    `${fieldName}` :
                    `${tableName}.${fieldName}`
                })}
              FROM "pages" 
              WHERE "pages"."notepadId"=${notepad.id}
            )
            WHERE
              rowNumber > ${options.paginationOffset * (notepad.page - 1)} AND
              rowNumber <= ${options.paginationOffset * (notepad.page)}
            `
          ).join(' UNION ')
        }
      `, {
        type: QueryTypes.SELECT,
        replacements: [],
        raw: true,
        nest: true,
      })

      return {
        values: groupByWidthAssociations(data, 'notepadId', ['pages'])
      }
    } as ModelQueryHandler<PageFiltersPayload, Page>
  )
})

app.on('ready', () => {
  ipcMain.handle(
    'database.pages:create',
    async function create (_, payload) {
      try {
        const response = await database.models.Page.bulkCreate(payload.data as any)
        return {
          values: response.map((item) => ({
            ...item.dataValues,
            notes: []
          }))
        }
      } catch (error) {
        console.error(error)
      }
    } as ModelCreateHandler<PagePayload, Page>
  )
})

app.on('ready', () => {
  ipcMain.handle(
    'database.pages:update',
    async function update (_, payload) {
      try {
        const response = await database.models.Page.update(
          payload.value as Page,
          { where: { id: payload.value.id } }
        )
        if (response[0] === 1) {
          return { value: payload.value }
        }
      } catch (error) {
        console.error(error)
      }
    } as ModelUpdateHandler<Page>
  )
})

app.on('ready', () => {
  ipcMain.handle(
    'database.pages:destroy',
    async function destroy (_, payload) {
      try {
        const response =  await database.models.Page.destroy({ 
          where: { id: payload.value.id } 
        })
        if (response === 1) {
          return { value: payload.value }
        }
      } catch (error) {
        console.error(error)
      }
    } as ModelDestroyHandler<Page>
  )
})
