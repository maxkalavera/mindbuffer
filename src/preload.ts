// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron'

import type { NoteID, NotePayload, Note, NoteFiltersPayload } from '@ts/models/Notes.types'
import type { PageID, PagePayload, Page } from '@ts/models/Pages.types'
import type { NotepadID, NotepadPayload, Notepad, NotepadFiltersPayload } from '@ts/models/Notepads.types'

export const electronAPI = {
  store: {
    sidebarAperture: {
      get: () => ipcRenderer.invoke('store.sidebarAperture:get'),
      set: (payload: { sidebarAperture: number }) => ipcRenderer.invoke('store.sidebarAperture:set', payload)
    }
  },
  notes: {
    create: (payload: { data: NotePayload }) => {
      return ipcRenderer.invoke('database.notes:create', payload)
    },
    destroy: (payload: { id: NoteID }) => {
      return ipcRenderer.invoke('database.notes:destroy', payload)
    },
    getAll: (payload: NoteFiltersPayload) => {
      return ipcRenderer.invoke('database.notes:getAll', payload)
    },
  },
  notepads: {
    create: (payload: { data: NotepadPayload }) => {
      return ipcRenderer.invoke('database.notepads:create', payload)
    },
    update: (payload: { value: Notepad }) => {
      return ipcRenderer.invoke('database.notepads:update', payload)
    },
    destroy: (payload: { id: NotepadID }) => {
      return ipcRenderer.invoke('database.notepads:destroy', payload)
    },
    getAll: (payload: NotepadFiltersPayload) => {
      return ipcRenderer.invoke('database.notepads:getAll', payload)
    }
  },
  pages: {
    create: (payload: { data: PagePayload }) => {
      return ipcRenderer.invoke('database.pages:create', payload)
    },
    update: (payload: { value: Page }) => {
      return ipcRenderer.invoke('database.pages:update', payload)
    },
    destroy: (payload: { id: PageID }) => {
      return ipcRenderer.invoke('database.pages:destroy', payload)
    }
  }
}

export type ElectronAPI = typeof electronAPI

contextBridge.exposeInMainWorld('electronAPI', electronAPI)