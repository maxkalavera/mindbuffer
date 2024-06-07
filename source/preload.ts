// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron'

import type { 
  QueryInvoker,
  ModelQueryInvoker, 
  ModelCreateInvoker, 
  ModelUpdateInvoker, 
  ModelDestroyInvoker 
} from '@ts/invokers.types';
import type { 
  NotePayload, 
  Note, 
  NotesFiltersPayload 
} from '@ts/models/Notes.types';
import type { 
  PagePayload, 
  Page, 
  PagesFiltersPayload, 
  PageID 
} from '@ts/models/Pages.types'
import type { 
  NotepadPayload, 
  Notepad, 
  NotepadsFiltersPayload, 
  NotepadsPagesFiltersPayload, 
  NotepadID 
} from '@ts/models/Notepads.types'

export const electronAPI = {
  settings: {
    sidebarAperture: {
      get: () => 
        ipcRenderer.invoke('settings.sidebarAperture:get'),
      set: (payload: { sidebarAperture: number }) => 
        ipcRenderer.invoke('settings.sidebarAperture:set', payload)
    },
    selectedPageID: {
      get: () => 
        ipcRenderer.invoke('settings.selectedPageID:get'),
      set: (payload: { selectedPageID: PageID }) => 
        ipcRenderer.invoke('settings.selectedPageID:set', payload)
    },
  },
  notes: {
    getAll: ((payload) => {
      return ipcRenderer.invoke('database.notes:getAll', payload)
    }) as ModelQueryInvoker<NotesFiltersPayload, Note>,
    create: ((payload) => {
      return ipcRenderer.invoke('database.notes:create', payload)
    }) as ModelCreateInvoker<NotePayload, Note>,
    update: ((payload) => {
      return ipcRenderer.invoke('database.note:update', payload)
    }) as ModelUpdateInvoker<Note>,
    destroy: ((payload) => {
      return ipcRenderer.invoke('database.notes:destroy', payload)
    }) as ModelDestroyInvoker<Note>,
  },
  notepads: {
    getAll: ((payload: NotepadsFiltersPayload) => {
      return ipcRenderer.invoke('database.notepads:getAll', payload)
    }) as ModelQueryInvoker<NotepadsFiltersPayload, Notepad>,
    getPages: ((payload: NotepadsPagesFiltersPayload) => {
      return ipcRenderer.invoke('database.notepads.pages:get', payload)
    }) as QueryInvoker<NotepadsPagesFiltersPayload, {
      values: {
        id: NotepadID,
        pages: Page[]
      }[]
    }>,
    create: ((payload) => {
      return ipcRenderer.invoke('database.notepads:create', payload)
    }) as ModelCreateInvoker<NotepadPayload, Notepad>,
    update: ((payload) => {
      return ipcRenderer.invoke('database.notepads:update', payload)
    }) as ModelUpdateInvoker<Notepad>,
    destroy: ((payload) => {
      return ipcRenderer.invoke('database.notepads:destroy', payload)
    }) as ModelDestroyInvoker<Notepad>,
  },
  pages: {
    getAll: ((payload: PagesFiltersPayload) => {
      return ipcRenderer.invoke('database.pages:getAll', payload)
    }) as QueryInvoker<PagesFiltersPayload, {
      values: {
        id: NotepadID,
        pages: Page[]
      }[]
    }>,
    get: ((payload) => {
      return ipcRenderer.invoke('database.pages:get', payload)
    }) as QueryInvoker<{ pageID: PageID}, { value: Page & { notepad: Notepad } }>,
    create: ((payload) => {
      return ipcRenderer.invoke('database.pages:create', payload)
    }) as ModelCreateInvoker<PagePayload, Page>,
    update: ((payload: { value: Page }) => {
      return ipcRenderer.invoke('database.pages:update', payload)
    }) as ModelUpdateInvoker<Page>,
    destroy: ((payload) => {
      return ipcRenderer.invoke('database.pages:destroy', payload)
    }) as ModelDestroyInvoker<Page>,
  }
}

export type ElectronAPI = typeof electronAPI

contextBridge.exposeInMainWorld('electronAPI', electronAPI)