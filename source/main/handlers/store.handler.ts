import { app, ipcMain } from 'electron'

import { ThrowError } from '@main/utils/errors'
import store from "@main/utils/electron-store"

app.on('ready', () => {
  ipcMain.handle(
    'store:get',
    async function (
      event: Electron.IpcMainInvokeEvent,
      payload: { key: string }
    ): Promise<any> {
      try {
        return store.get(payload.key)
      } catch (error) {
        ThrowError({ 
          content: 'Error retrieving value from electron storage',
          error: error,
        })
      }
    }
  )
})

app.on('ready', () => {
  ipcMain.handle(
    'store:set',
    async function (
      event: Electron.IpcMainInvokeEvent,
      payload: { key: string, value: any }
    ): Promise<any> {
      try {
        return store.set(payload.key, payload.value) 
      } catch (error) {
        ThrowError({ 
          content: 'Error retrieving value from electron storage',
          error: error,
        })
      }
    }
  )
})