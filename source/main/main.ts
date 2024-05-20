/// <reference path="../globals.d.ts" />
import path from 'node:path'
import { ThrowFatalError } from '@main/utils/errors'
import { getResourcesDir, getPreloadEntry } from "@main/utils/resources"
import { app, BrowserWindow } from "electron"
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer'
import checkSquirrelStartup from 'electron-squirrel-startup'
//import database from '@main/utils/database'
import databaseAlt from '@main/utils/database.bettersqlite3'
import '@main/handlers/notepads.handler'
import '@main/handlers/pages.handler'
import '@main/handlers/notes.handler'
import '@main/handlers/settings.handler'

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (checkSquirrelStartup) {
  destroy()
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    height: 768,
    width: 1080,
    // If testing and not debuging mode run in headless mode, in background
    show: globals.ENVIRONMENT !== 'testing' || globals.DEBUG === true,
    webPreferences: {
      preload: getPreloadEntry(),
    },
  })

  mainWindow.loadFile(path.resolve(getResourcesDir(), 'index.html'))
  // Open the DevTools.
  if (['development'].some((item) => item === globals.ENVIRONMENT)) {
    mainWindow.webContents.openDevTools();
  }
}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', init);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    destroy();
  }
});

app.on('activate', async () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    await init();
  }
});

app.whenReady().then(() => {
  if (['development'].some((item) => item === globals.ENVIRONMENT)) {
    installExtension(REACT_DEVELOPER_TOOLS)
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((err) => console.log('An error occurred: ', err));
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
async function init() {
  if (await databaseAlt.testConnection()) {
    await databaseAlt.init()
  }
  createWindow()
}

function destroy() {
  app.quit();
}
