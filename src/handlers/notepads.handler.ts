import { app, ipcMain } from 'electron'
import { QueryTypes } from 'sequelize'

import getSelectFields from '@utils/database/getSelectFields'
import groupByAssociations from '@utils/database/groupByAssociations'
import database from "@utils/database"

import type { NotepadID, NotepadPayload, Notepad, NotepadFiltersPayload } from '@ts/models/Notepads.types'

app.on('ready', () => {
  ipcMain.handle(
    'database.notepads:getAll',
    async function getAll (
      event: Electron.IpcMainInvokeEvent,
      payload: NotepadFiltersPayload
    ): Promise<any> {
      const options = Object.assign({
        search: '',
        page: 1,
        paginationOffset: 20
      }, payload)
      if (options.page < 1) options.page = 1
    
      try {
        const searchKeywords = options.search === '' ?
          [] : 
          options.search.toLowerCase().split(/\s+/)
        const data = await database.sequelize.query(`
        SELECT
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
        ON "notepads".id="pages".notepadId
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
        ORDER BY
          "notepads".createdAt ASC, 
          "pages"."createdAt" ASC
        LIMIT ? OFFSET ?;
        `, {
          type: QueryTypes.SELECT,
          replacements: [
            options.paginationOffset,
            options.paginationOffset * (options.page - 1),
          ],
          raw: true,
          nest: true,
        })
        return groupByAssociations(data, 'id', ['pages'])
      } catch (error) {
        console.error(error)
        return []
      } 
    }
  )
})

app.on('ready', () => {
  ipcMain.handle(
    'database.notepads:create',
    async function create (
      event: Electron.IpcMainInvokeEvent, 
      payload: { data: NotepadPayload }
    ): Promise<any> {
      try {
        const notepad = (await database.models.Notepad
          .create({ ...payload.data as NotepadPayload }))
          .dataValues
        notepad.pages = []
        return notepad
      } catch (error) {
        console.error(error)
        return undefined
      }
    }
  )
})

app.on('ready', () => {
  ipcMain.handle(
    'database.notepads:update',
    async function update (
      event: Electron.IpcMainInvokeEvent,
      payload: { value: Notepad }
    ): Promise<any> {
      try {
        return await database.models.Notepad.update(
          payload.value as Notepad, 
          { where: { id: payload.value.id } }
        )
      } catch (error) {
        console.error(error)
      }
    }
  )
})

app.on('ready', () => {
  ipcMain.handle(
    'database.notepads:destroy',
    async function destroy (
      event: Electron.IpcMainInvokeEvent,
      payload: { id: NotepadID }
    ): Promise<any> {
      try {
        return await database.models.Notepad.destroy({ 
          where: { id: payload.id as NotepadID } 
        })
      } catch (error) {
        console.error(error)
        return 0
      }
    }
  )
})
