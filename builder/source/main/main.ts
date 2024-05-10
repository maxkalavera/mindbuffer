/// <reference path="./main.d.ts" />
import { app, BrowserWindow } from "electron"

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    height: 768,
    width: 1080,
  })

  mainWindow.loadFile(HTML_INDEX_ENTRY)
  mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})