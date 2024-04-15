import { app, ipcMain } from 'electron'
import { QueryTypes } from 'sequelize'

import database from "@utils/database"

import type { 
  ModelQueryHandler,
  ModelCreateHandler,
  ModelUpdateHandler,
  ModelDestroyHandler,
} from '@src/ts/handlers.types'
import type {
  NotePayload, 
  NoteFiltersPayload, 
  Note 
} from '@ts/models/Notes.types'

app.on('ready', () => {
  ipcMain.handle(
    'database.notes:getAll',
    async function getAll (_, payload) {
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
        return {
          values: notes
        }
      } catch (error) {
        console.error(error)
      } 
    }  as ModelQueryHandler<NoteFiltersPayload, Note>
  )
})

app.on('ready', () => {
  ipcMain.handle(
    'database.notes:create',
    async function create (_, payload) {
      try {
        const response = await database.models.Note.bulkCreate(payload.data as any)
        return {
          values: response.map((item) => item.dataValues)
        }
      } catch (error) {
        console.error(error)
      }
    } as ModelCreateHandler<NotePayload, Note>
  )
})

app.on('ready', () => {
  ipcMain.handle(
    'database.note:update',
    async function update (_, payload) {
      try {
        const response = await database.models.Note.update(
          payload.value, 
          { where: { id: payload.value.id } }
        )

        if (response[0] === 1) {
          return { value: payload.value }
        }
      } catch (error) {
        console.error(error)
      }
    } as ModelUpdateHandler<Note>
  )
})

app.on('ready', () => {
  ipcMain.handle(
    'database.notes:destroy',
    async function destroy (_, payload) {
      try {
        const response = await database.models.Note.destroy({ 
          where: { id: payload.value.id } 
        })
        if (response === 1) {
          return { value: payload.value }
        }
      } catch (error) {
        console.error(error)
      }
    } as ModelDestroyHandler<Note>
  )
})
