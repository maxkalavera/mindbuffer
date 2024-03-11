import { app, ipcMain } from 'electron'
import { Op } from 'sequelize'

import database from '@utils/database'

app.on('ready', () => {
  ipcMain.handle('database.notes:create', async (event, content) => {
    try {
      return await database.models.Note.create({ content })
    } catch (error) {
      console.error('Unable to create note', error)
      return null
    } 
  })

  ipcMain.handle('database.notes:findAll', async () => {
    try {
      return await database.models.Note.findAll()
    } catch (error) {
      console.error(error)
      return []
    } 
  })

  ipcMain.handle('database.notes:delete', async (event, id) => {
    try {
      await database.models.Note.destroy({
        where: {
          id: Number(id)
        }
      })
      return true
    } catch (error) {
      console.error(error)
      return false
    } 
  })

  ipcMain.handle('database.notes:queryBoardNotes', async (
    event, 
    {
      page = 1,
      search = ''
    }: {
      page?: number,
      search?: string
    }) => {
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
        LIMIT ${paginationOffset} OFFSET ${paginationOffset * (page - 1)};
      `, {
        model: database.models.Note,
        mapToModel: true
      })
      return notes.reverse()
    } catch (error) {
      console.error(error)
      return []
    } 
  })
})