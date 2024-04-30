import type { ElectronAPI } from "preload"

declare global {
  var __ENVIRONMENT__: 'development' | 'production' | 'testing'; /* Only works in developing and testing environment */
  var __DEBUG__: boolean; /* Only works in developing and testing environment */
  var __BINARY_PATH__: string; /* Only works in testing environment */
  interface Window {
    electronAPI: ElectronAPI,
    globals: {
      [key: string] : any
    }
  }
}

global.__BINARY_PATH__