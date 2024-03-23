import { app, ipcMain } from 'electron'
import { QueryTypes } from 'sequelize'

import database from "@utils/database"

import type { NoteID, NotePayload } from '@ts/models/Notes.types'

app.on('ready', () => {
  ipcMain.handle(
    'database.notes:getAll',
    async function getAll (
      event: Electron.IpcMainInvokeEvent,
      {
        page=1,
        search=''
      } :
      {
        page: number,
        search: string,
      }
    ): Promise<any> {
      const paginationOffset = 20
      if (page < 1) page = 1
    
      try {
        const searchKeywords = search.toLowerCase().split(/\s+/)
        const notes = await database.sequelize.query(`
          SELECT * FROM "notes"
          WHERE
          ${
            searchKeywords
              .map((item) => `"content" LIKE "%${item}%"`)
              .join(' OR ')
          }
          ORDER BY "createdAt" DESC
          LIMIT $$limit OFFSET $$offset;
        `, {
          type: QueryTypes.SELECT,
          bind: {
            limit: paginationOffset,
            offset: paginationOffset * (page - 1),
          },
          raw: true,
        })
        return notes
      } catch (error) {
        console.error(error)
        return []
      } 
    }
  )
})

app.on('ready', () => {
  ipcMain.handle(
    'database.notes:create',
    async function create (
      event: Electron.IpcMainInvokeEvent, 
      payload: NotePayload
    ): Promise<any> {
      try {
        return database.models.Note.create({...payload})
      } catch (error) {
        console.error(error)
      }
    }
  )
})

app.on('ready', () => {
  ipcMain.handle(
    'database.notes:update',
    async function update (
      event: Electron.IpcMainInvokeEvent, 
      id: NoteID, 
      payload: NotePayload
    ): Promise<any> {
      try {
        return database.models.Note.update(payload, { where: { id: id } })
      } catch (error) {
        console.error(error)
      }
    }
  )
})

app.on('ready', () => {
  ipcMain.handle(
    'database.notes:destroy',
    async function destroy (
      event: Electron.IpcMainInvokeEvent, 
      id: NoteID
    ) {
      try {
        database.models.Note.destroy({ where: { id: id } })
        return true
      } catch (error) {
        console.error(error)
        return false
      }
    }
  )
})
