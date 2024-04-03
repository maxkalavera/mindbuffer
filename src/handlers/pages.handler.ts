import { app, ipcMain } from 'electron'
import { QueryTypes } from 'sequelize'

import { groupByWidthAssociations } from '@utils/database/groupBy'
import getSelectFields from '@utils/database/getSelectFields'
import database from "@utils/database"

import type { PageID, PagePayload, Page, PageFiltersPayload } from '@ts/models/Pages.types'

app.on('ready', () => {
  ipcMain.handle(
    'database.pages:getAll',
    async function getAll (
      event: Electron.IpcMainInvokeEvent,
      payload: PageFiltersPayload
    ): Promise<any> {
      const options = Object.assign({
        search: '',
        paginationOffset: 20,
      }, payload)    
      options.notepads.map((item) => item.page < 1 ?
        {
          ...item,
          page: 1
        } :
        item
      )
      if (options.notepads.length === 0)
        return []

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

      return groupByWidthAssociations(data, 'notepadId', ['pages'])
    }
  )
})

app.on('ready', () => {
  ipcMain.handle(
    'database.pages:create',
    async function create (
      event: Electron.IpcMainInvokeEvent, 
      payload: { data: PagePayload }
    ): Promise<any> {
      try {
        const page = (await database.models.Page
          .create({ ...payload.data as PagePayload }))
          .dataValues
        page.notes = []
        return page
      } catch (error) {
        console.error(error)
      }
    }
  )
})

app.on('ready', () => {
  ipcMain.handle(
    'database.pages:update',
    async function update (
      event: Electron.IpcMainInvokeEvent,
      payload: { value: Page }
    ): Promise<any> {
      try {
        return (await database.models.Page.update(
          payload.value as Page,
          { where: { id: payload.value.id } }
        ))
      } catch (error) {
        console.error(error)
      }
    }
  )
})

app.on('ready', () => {
  ipcMain.handle(
    'database.pages:destroy',
    async function destroy (
      event: Electron.IpcMainInvokeEvent,
      payload: { id: PageID }
    ): Promise<any> {
      try {
        return await database.models.Page.destroy({ 
          where: { id: payload.id as PageID } 
        })
      } catch (error) {
        console.error(error)
        return 0
      }
    }
  )
})
