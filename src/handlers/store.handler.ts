import store from '@utils/settings'
import { app, ipcMain } from 'electron'

app.on('ready', () => {
  ipcMain.handle(
    'store.sidebarAperture:get',
    async function getAperture (
      event: Electron.IpcMainInvokeEvent
    ): Promise<any> {
      return store.get('sidebarAperture')
    }
  )
})

app.on('ready', () => {
  ipcMain.handle(
    'store.sidebarAperture:set',
    async function setAperture (
      event: Electron.IpcMainInvokeEvent,
      payload: { sidebarAperture: number }
    ): Promise<any> {
      if (payload.sidebarAperture > 1.0) payload.sidebarAperture = 1.0
      else if (payload.sidebarAperture < 0.0) payload.sidebarAperture = 0.0
      return store.set('sidebarAperture', payload.sidebarAperture)
    }
  )
})