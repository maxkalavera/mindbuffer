import { app, ipcMain } from 'electron'
import { QueryTypes } from 'sequelize'

import getSelectFields from '@utils/database/getSelectFields'
import database from "@utils/database"

import type { PageID, PagePayload, Page } from '@ts/models/Pages.types'

app.on('ready', () => {
  ipcMain.handle(
    'database.pages:getAll',
    async function getAll (
      event: Electron.IpcMainInvokeEvent,
      {
        page = 1,
        search = '',
      }: {
        page?: number,
        search?: string,
      }
    ): Promise<any> {
      const paginationOffset = 20
      if (page < 1) page = 1
    
      try {
        const searchKeywords = search === '' ? [] : search.toLowerCase().split(/\s+/)
        const data = await database.sequelize.query(`
          SELECT
          ${
            getSelectFields(database.models.Page)
          },
          ${
            getSelectFields(
              database.models.Notepad, 
              {
                as: ({ fieldName }) => `notepad.${fieldName}`
              })
          }
          FROM "pages"
          LEFT OUTER JOIN "notepads"
          ON "pages".notepadId="notepads".id
          ${
            searchKeywords.length > 0 ? 
              `
              WHERE
                "pages".id in (
                  SELECT pageId FROM "notes"
                  WHERE
                  ${
                    searchKeywords
                      .map((item) => `"content" LIKE "%${item}%"`)
                      .join(' OR ')
                  }
                )
              ` : 
              ''
          }
          ORDER BY "pages"."createdAt" DESC
          LIMIT ? OFFSET ?;
        `, {
          type: QueryTypes.SELECT,
          replacements: [
            paginationOffset,
            paginationOffset * (page - 1),
          ],
          raw: true,
          nest: true,
        })
        return data
      } catch (error) {
        console.error(error)
        return []
      } 
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
