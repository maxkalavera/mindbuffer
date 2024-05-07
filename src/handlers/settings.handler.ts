import settings from '@utils/settings'
import { app, ipcMain } from 'electron'

import { ThrowError } from '@utils/errors'
import { PageID } from '@ts/models/Pages.types'

app.on('ready', () => {
  ipcMain.handle(
    'settings.sidebarAperture:get',
    async function (
      event: Electron.IpcMainInvokeEvent
    ): Promise<number> {
      try {
        return settings.get('sidebarAperture') as number
      } catch (error) {
        ThrowError({ 
          content: 'Error syncing settings',
          error: error,
        })
      }
    }
  )
})

app.on('ready', () => {
  ipcMain.handle(
    'settings.sidebarAperture:set',
    async function (
      event: Electron.IpcMainInvokeEvent,
      payload: { sidebarAperture: number }
    ): Promise<any> {
      if (payload.sidebarAperture > 1.0) payload.sidebarAperture = 1.0
      else if (payload.sidebarAperture < 0.0) payload.sidebarAperture = 0.0
      try {
        return settings.set('sidebarAperture', payload.sidebarAperture)
      } catch (error) {
        ThrowError({ 
          content: 'Error syncing settings',
          error: error,
        })
      }
    }
  )
})

app.on('ready', () => {
  ipcMain.handle(
    'settings.selectedPageID:get',
    async function (
      event: Electron.IpcMainInvokeEvent
    ): Promise<PageID> {
      try {
        const result = settings.get('selectedPageID')
        return result ? 
          JSON.parse(result as string) as PageID :
          undefined
      } catch (error) {
        ThrowError({ 
          content: 'Error syncing settings',
          error: error,
        })
      }
    }
  )
})

app.on('ready', () => {
  ipcMain.handle(
    'settings.selectedPageID:set',
    async function (
      event: Electron.IpcMainInvokeEvent,
      payload: { selectedPageID: PageID }
    ): Promise<any> {
      try {
        if (payload.selectedPageID === undefined) {
          return settings.set('selectedPageID', '')
        } else {
          return settings.set('selectedPageID', JSON.stringify(payload.selectedPageID))
        }
      } catch (error) {
        ThrowError({ 
          content: 'Error syncing settings',
          error: error,
        })
      }
    }
  )
})