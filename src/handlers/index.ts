import { app, ipcMain } from 'electron'

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

  ipcMain.handle('database.notes:boardQuery', async (
    event, 
    kwargs: { 
      page?: number,
      search?: string,
    } = {}
  ) => {
    kwargs = Object.create({
      page: 1,
      search: ''
    }, kwargs)
    const pageOffset = 20
    if (kwargs.page < 1) kwargs.page = 1
    try {
      if (kwargs.search === '') {
        return await database.models.Note.findAll({ 
          order: [['updatedAt', 'DESC']],
          limit: pageOffset,
          offset: pageOffset * (kwargs.page - 1),
        })
      }
        return await database.models.Note.findAll({ 
          order: [['updatedAt', 'DESC']],
          limit: pageOffset,
          offset: pageOffset * (kwargs.page - 1),
          where: {
            content: {
              
            }
          }
        })

    } catch (error) {
      console.error(error)
      return []
    } 
  })
})