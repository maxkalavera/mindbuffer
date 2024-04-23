import type { ElectronAPI } from "preload"

declare global {
  interface Window {
    electronAPI: ElectronAPI,
    globals: {
      [key: string] : any
    }
  }
}
