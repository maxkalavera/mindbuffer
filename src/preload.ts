// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron'

//import settings from '@utils/settings'
import type { NoteID, NotePayload, Note, NoteFiltersPayload } from '@ts/models/Notes.types'
import type { NotepadID, NotepadPayload, Notepad, NotepadFiltersPayload } from '@ts/models/Notepads.types'

export const electronAPI = {
  store: {
    sidebarAperture: {
      get: () => ipcRenderer.invoke('store.sidebarAperture:get'),
      set: (payload: { sidebarAperture: number }) => ipcRenderer.invoke('store.sidebarAperture:set', payload)
    }
  },
  notes: {
    create: (payload: { data: NotePayload }) => 
      ipcRenderer.invoke('database.notes:create', payload),
    destroy: (payload: { id: NoteID }) => 
      ipcRenderer.invoke('database.notes:destroy', payload),
    getAll: (payload: NoteFiltersPayload) => 
      ipcRenderer.invoke('database.notes:getAll', payload),
  },
  notepads: {
    create: (payload: { data: NotepadPayload }) => 
      ipcRenderer.invoke('database.notepads:create', payload),
    update: (payload: { value: Notepad }) =>
      ipcRenderer.invoke('database.notepads:update', payload),
    destroy: (payload: { id: NotepadID }) =>
      ipcRenderer.invoke('database.notepads:destroy', payload),
    getAll: (payload: NotepadFiltersPayload) => 
      ipcRenderer.invoke('database.notepads:getAll', payload),
  },
  pages: {
  }
}

export type ElectronAPI = typeof electronAPI

contextBridge.exposeInMainWorld('electronAPI', electronAPI)