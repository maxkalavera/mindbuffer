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
        pageID: undefined,
        paginationOffset: 20
      }, payload)
      if (options.page < 1) options.page = 1
    
      const queryParams = {
        limit: options.paginationOffset,
        offset: options.paginationOffset * (options.page - 1),
      } as any

      if (options.search) {
        queryParams.search = `"${options.search}"`
      } else if (options.pageID) {
        queryParams.pageID = options.pageID
      }

      try {
        const notes = await database.sequelize.query(`
          SELECT * FROM "notes"
            ${
              queryParams.search ||
              queryParams.pageID ?
                `WHERE` : ''
            }
            ${
              queryParams.search ? 
                `
                  id IN (
                    select noteID 
                    FROM searches 
                    WHERE noteContent 
                    MATCH $$search
                    ORDER BY 
                        rank DESC, 
                        noteID DESC
                  )              
                ` : 
                ''
            }
            ${
              queryParams.pageID ? 
                `id = $$pageID` : ''
            }
          LIMIT $$limit OFFSET $$offset;
        `, {
          type: QueryTypes.SELECT,
          bind: queryParams,
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
      console.log('database.notes:destroy PAYLOAD', payload)
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
