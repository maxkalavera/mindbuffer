// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('database', {
  notes: {
    create: (content: string) => ipcRenderer.invoke('database.notes:create', content),
    findAll: () => ipcRenderer.invoke('database.notes:findAll'),
  }
})