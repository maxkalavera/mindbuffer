import { app, ipcMain } from 'electron'
import { QueryTypes } from 'sequelize'

import getSelectFields from '@utils/database/getSelectFields'
import groupByAssociations from '@utils/database/groupByAssociations'
import database from "@utils/database"

import type { NotepadID, NotepadPayload } from '@ts/models/Notepads.types'

app.on('ready', () => {
  ipcMain.handle(
    'database.notepads:getAll',
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
        const searchKeywords = search.toLowerCase().split(/\s+/)
        const data = await database.sequelize.query(`
          SELECT
          ${
            getSelectFields(database.models.Notepad)
          },
          ${
            getSelectFields(
              database.models.Page, 
              { as: ({ fieldName }) => `pages.${fieldName}`})
          }
          FROM "notepads"
          LEFT OUTER JOIN "pages" on "notepads"."id"="pages"."notepadId"
          ORDER BY "notepads"."createdAt" DESC
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
      payload: NotepadPayload
    ): Promise<any> {
      try {
        return database.models.Notepad.create({...payload})
      } catch (error) {
        console.error(error)
      }
    }
  )
})

app.on('ready', () => {
  ipcMain.handle(
    'database.notepads:update',
    async function update (
      event: Electron.IpcMainInvokeEvent,
      id: NotepadID,
      payload: NotepadPayload
    ): Promise<any> {
      try {
        return database.models.Notepad.update(payload, { where: { id: id } })
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
      id: NotepadID
    ): Promise<any> {
      try {
        return database.models.Notepad.destroy({ where: { id: id } })
      } catch (error) {
        console.error(error)
      }
    }
  )
})
