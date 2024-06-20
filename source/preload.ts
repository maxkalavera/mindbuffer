// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron'

import type { 
  QueryInvokerType,
  ModelQueryInvokerType, 
  ModelCreateInvokerType, 
  ModelUpdateInvokerType, 
  ModelDestroyInvokerType 
} from '@ts/invokers.types'
import type { 
  NotePayloadType, 
  NoteType, 
  NotesFiltersPayloadType 
} from 'ts/models/Notes.types'
import type { 
  PagePayloadType, 
  PageType, 
  PagesFiltersPayloadType, 
  PageIDType 
} from '@ts/models/Pages.types'
import type { 
  NotepadPayloadType, 
  NotepadType, 
  NotepadsFiltersPayloadType, 
  NotepadsPagesFiltersPayloadType, 
  NotepadIDType
} from '@ts/models/Notepads.types'

export const electronAPI = {
  store: {
    get: (payload: { key: string }) => 
      ipcRenderer.invoke('store:get', payload),
    set: (payload: { key: string, value: any }) => 
      ipcRenderer.invoke('store:set', payload)
  },
  settings: {
    sidebarAperture: {
      get: () => 
        ipcRenderer.invoke('settings.sidebarAperture:get'),
      set: (payload: { sidebarAperture: string }) => 
        ipcRenderer.invoke('settings.sidebarAperture:set', payload)
    },
    selectedPageID: {
      get: () => 
        ipcRenderer.invoke('settings.selectedPageID:get'),
      set: (payload: { selectedPageID: PageIDType }) => 
        ipcRenderer.invoke('settings.selectedPageID:set', payload)
    },
  },
  notes: {
    getAll: ((payload) => {
      return ipcRenderer.invoke('database.notes:getAll', payload)
    }) as ModelQueryInvokerType<NotesFiltersPayloadType, NoteType>,
    create: ((payload) => {
      return ipcRenderer.invoke('database.notes:create', payload)
    }) as ModelCreateInvokerType<NotePayloadType, NoteType>,
    update: ((payload) => {
      return ipcRenderer.invoke('database.note:update', payload)
    }) as ModelUpdateInvokerType<NoteType>,
    destroy: ((payload) => {
      return ipcRenderer.invoke('database.notes:destroy', payload)
    }) as ModelDestroyInvokerType<NoteType>,
  },
  notepads: {
    getAll: ((payload: NotepadsFiltersPayloadType) => {
      return ipcRenderer.invoke('database.notepads:getAll', payload)
    }) as ModelQueryInvokerType<NotepadsFiltersPayloadType, NotepadType>,
    getPages: ((payload: NotepadsPagesFiltersPayloadType) => {
      return ipcRenderer.invoke('database.notepads.pages:get', payload)
    }) as QueryInvokerType<NotepadsPagesFiltersPayloadType, {
      values: {
        id: NotepadIDType,
        pages: PageType[]
      }[]
    }>,
    create: ((payload) => {
      return ipcRenderer.invoke('database.notepads:create', payload)
    }) as ModelCreateInvokerType<NotepadPayloadType, NotepadType>,
    update: ((payload) => {
      return ipcRenderer.invoke('database.notepads:update', payload)
    }) as ModelUpdateInvokerType<NotepadType>,
    destroy: ((payload) => {
      return ipcRenderer.invoke('database.notepads:destroy', payload)
    }) as ModelDestroyInvokerType<NotepadType>,
  },
  pages: {
    getAll: ((payload: PagesFiltersPayloadType) => {
      return ipcRenderer.invoke('database.pages:getAll', payload)
    }) as QueryInvokerType<PagesFiltersPayloadType, {
      values: {
        id: NotepadIDType,
        pages: PageType[]
      }[]
    }>,
    get: ((payload) => {
      return ipcRenderer.invoke('database.pages:get', payload)
    }) as QueryInvokerType<{ pageID: PageIDType}, { value: PageType & { notepad: NotepadType } }>,
    create: ((payload) => {
      return ipcRenderer.invoke('database.pages:create', payload)
    }) as ModelCreateInvokerType<PagePayloadType, PageType>,
    update: ((payload: { value: PageType }) => {
      return ipcRenderer.invoke('database.pages:update', payload)
    }) as ModelUpdateInvokerType<PageType>,
    destroy: ((payload) => {
      return ipcRenderer.invoke('database.pages:destroy', payload)
    }) as ModelDestroyInvokerType<PageType>,
  }
}

export type ElectronAPI = typeof electronAPI

contextBridge.exposeInMainWorld('electronAPI', electronAPI)