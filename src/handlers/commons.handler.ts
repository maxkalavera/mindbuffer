import { app, ipcMain } from 'electron'
import os from 'os'

app.on('ready', () => {
  ipcMain.handle(
    'commons:getPlatform',
    async function getAperture (
      event: Electron.IpcMainInvokeEvent
    ): Promise<any> {
      return os.platform()
    }
  )
})