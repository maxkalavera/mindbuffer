// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron'

export const electronAPI = {
  notes: {
    create: (payload: {content: string}) => {},
    update: (id: number, payload: {content: string}) => {},
    delete: (id: number) => {},
    boardNotes: (payload: {
      page?: number,
      search?: string
    }) => {},
  },
  notepads: {
    create: (payload: {content: string}) => {},
    update: (id: number, payload: {content: string}) => {},
    delete: (id: number) => {},
  },
  pages: {
    create: (payload: {content: string}) => {},
    update: (id: number, payload: {content: string}) => {},
    delete: (id: number) => {},
  }
}

contextBridge.exposeInMainWorld('electronAPI', electronAPI)