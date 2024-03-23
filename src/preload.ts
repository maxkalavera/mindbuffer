// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron'

import type { NoteID, NotePayload } from '@ts/models/Notes.types'
import type { NotepadID, NotepadPayload } from '@ts/models/Notepads.types'

export const electronAPI = {
  notes: {
    create: (payload: NotePayload) => 
      ipcRenderer.invoke('database.notes:create', payload),
    update: (id: NoteID, payload: NotePayload) => 
      ipcRenderer.invoke('database.notes:update', id, payload),
    destroy: (id: NoteID) => ipcRenderer.invoke('database.notes:destroy', id),
    getAll: ({ 
      page=1,
      search='',
    }: {
      page?: number,
      search?: string
    } = {}) => ipcRenderer.invoke('database.notes:getAll', { page, search}),
  },
  notepads: {
    create: (payload: NotepadPayload) => 
      ipcRenderer.invoke('database.notepads:create', payload),
    update: (id: NotepadID, payload: NotepadPayload) => 
      ipcRenderer.invoke('database.notepads:update', id, payload),
    destroy: (id: NotepadID) => 
      ipcRenderer.invoke('database.notepads:destroy', id),
      getAll: ({
        page=1,
        search='',
      }: {
        page?: number,
        search?: string,
      } = {}) => ipcRenderer.invoke('database.notepads:getAll', { page, search}),
  },
  pages: {
    create: (payload: NotepadPayload) => 
      ipcRenderer.invoke('database.pages:create', payload),
    update: (id: number, payload: NotepadPayload) => 
      ipcRenderer.invoke('database.pages:update', id, payload),
    destroy: (id: number) => 
      ipcRenderer.invoke('database.pages:destroy', id),
    getAll: ({ 
      page=1,
      search='',
    }: {
      page?: number,
      search?: string
    } = {}) => ipcRenderer.invoke('database.pages:getAll', { page, search}),
  }
}

export type ElectronAPI = typeof electronAPI

contextBridge.exposeInMainWorld('electronAPI', electronAPI)
