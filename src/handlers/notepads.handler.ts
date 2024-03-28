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
        const notepads = groupByAssociations(data, 'id', ['pages'])
        return notepads
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
