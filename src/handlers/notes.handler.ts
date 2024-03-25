import { app, ipcMain } from 'electron'
import { QueryTypes } from 'sequelize'

import database from "@utils/database"

import type { NoteID, NotePayload, NoteFiltersPayload } from '@ts/models/Notes.types'

app.on('ready', () => {
  ipcMain.handle(
    'database.notes:getAll',
    async function getAll (
      event: Electron.IpcMainInvokeEvent,
      payload: NoteFiltersPayload,
    ): Promise<any> {
      const options = Object.assign({
        search: '',
        page: 1,
        paginationOffset: 20
      }, payload)
      if (options.page < 1) options.page = 1
    
      try {
        const searchKeywords = options.search.toLowerCase().split(/\s+/)
        const notes = await database.sequelize.query(`
          SELECT * FROM "notes"
          WHERE
          ${
            searchKeywords
              .map((item: string) => `"content" LIKE "%${item}%"`)
              .join(' OR ')
          }
          ORDER BY "createdAt" DESC
          LIMIT $$limit OFFSET $$offset;
        `, {
          type: QueryTypes.SELECT,
          bind: {
            limit: options.paginationOffset,
            offset: options.paginationOffset * (options.page - 1),
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
      payload: { data: NotePayload }
    ): Promise<any> {
      try {
        return (await database.models.Note.create({ ...payload.data })).dataValues
      } catch (error) {
        console.error(error)
        return undefined
      }
    }
  )
})

app.on('ready', () => {
  ipcMain.handle(
    'database.notes:destroy',
    async function destroy (
      event: Electron.IpcMainInvokeEvent, 
      payload: { id: NoteID }
    ) {
      try {
        return await database.models.Note.destroy({ where: { id: payload.id } })
      } catch (error) {
        console.error(error)
        return 0
      }
    }
  )
})
