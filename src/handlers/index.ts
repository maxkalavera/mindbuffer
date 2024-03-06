import { app, ipcMain } from 'electron'

import database from '@utils/database'

app.on('ready', () => {
  ipcMain.handle('database.notes:create', async (event, content) => {
    try {
      return await database.models.Note.create({ content })
    } catch (error) {
      console.error('Unable to create note', error)
    } 
  })

  ipcMain.handle('database.notes:findAll', async () => {
    try {
      return await database.models.Note.findAll()
    } catch (error) {
      console.error(error)
    } 
  })
})