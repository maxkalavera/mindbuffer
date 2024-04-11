// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron'

import type { QueryInvoker, CreateInvoker, UpdateInvoker, DestroyInvoker } from '@ts/invokers.types'
import type { NotePayload, Note, NoteFiltersPayload } from '@ts/models/Notes.types'
import type { PagePayload, Page, PageFiltersPayload } from '@ts/models/Pages.types'
import type { NotepadPayload, Notepad, NotepadFiltersPayload } from '@ts/models/Notepads.types'

export const electronAPI = {
  commons: {
    getPlatform: (() => ipcRenderer.invoke('commons:getPlatform')) as any
  },
  store: {
    sidebarAperture: {
      get: () => ipcRenderer.invoke('store.sidebarAperture:get'),
      set: (payload: { sidebarAperture: number }) => ipcRenderer.invoke('store.sidebarAperture:set', payload)
    }
  },
  notes: {
    getAll: ((payload) => {
      return ipcRenderer.invoke('database.notes:getAll', payload)
    }) as QueryInvoker<NoteFiltersPayload, Note>,
    create: ((payload) => {
      return ipcRenderer.invoke('database.notes:create', payload)
    }) as CreateInvoker<NotePayload, Note>,
    update: ((payload) => {
      return ipcRenderer.invoke('database.note:update', payload)
    }) as UpdateInvoker<Note>,
    destroy: ((payload) => {
      return ipcRenderer.invoke('database.notes:destroy', payload)
    }) as DestroyInvoker<Note>,
  },
  notepads: {
    getAll: ((payload: NotepadFiltersPayload) => {
      return ipcRenderer.invoke('database.notepads:getAll', payload)
    }) as QueryInvoker<NotepadFiltersPayload, Notepad>,
    create: ((payload) => {
      return ipcRenderer.invoke('database.notepads:create', payload)
    }) as CreateInvoker<NotepadPayload, Notepad>,
    update: ((payload) => {
      return ipcRenderer.invoke('database.notepads:update', payload)
    }) as UpdateInvoker<Notepad>,
    destroy: ((payload) => {
      return ipcRenderer.invoke('database.notepads:destroy', payload)
    }) as DestroyInvoker<Notepad>,
  },
  pages: {
    getAll: ((payload: PageFiltersPayload) => {
      return ipcRenderer.invoke('database.pages:getAll', payload)
    }) as QueryInvoker<PageFiltersPayload, Page>,
    create: ((payload) => {
      return ipcRenderer.invoke('database.pages:create', payload)
    }) as CreateInvoker<PagePayload, Page>,
    update: ((payload: { value: Page }) => {
      return ipcRenderer.invoke('database.pages:update', payload)
    }) as UpdateInvoker<Page>,
    destroy: ((payload) => {
      return ipcRenderer.invoke('database.pages:destroy', payload)
    }) as DestroyInvoker<Page>,
  }
}

export type ElectronAPI = typeof electronAPI

contextBridge.exposeInMainWorld('electronAPI', electronAPI)