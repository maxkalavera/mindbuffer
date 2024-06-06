/// <reference path="../globals.d.ts" />
import path from 'node:path'
import { app, BrowserWindow } from "electron"
import { getResourcesDir, getPreloadEntry } from "@main/utils/resources"
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer'
import checkSquirrelStartup from 'electron-squirrel-startup'
import database from '@main/utils/database'
import '@main/handlers/notepads.handler'
import '@main/handlers/pages.handler'
import '@main/handlers/notes.handler'
import '@main/handlers/settings.handler'

var appContext: {
  mainWindow: BrowserWindow,
  database: {[key: string]: any},
} = {
  mainWindow: undefined,
  database: undefined
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (checkSquirrelStartup) {
  destroy()
}

const createWindow = () => {
  const window = new BrowserWindow({
    height: 768,
    width: 1080,
    // If testing and not debuging mode run in headless mode, in background
    show: globals.ENVIRONMENT !== 'testing' || globals.DEBUG === true,
    webPreferences: {
      preload: getPreloadEntry(),
    },
  })

  window.loadFile(path.join(getResourcesDir(), 'index.html'))
  // Open the DevTools.
  if (['development'].some((item) => item === globals.ENVIRONMENT)) {
    window.webContents.openDevTools();
  }
  return window
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    destroy();
  }
});

app.on('activate', init);

app.on('second-instance', init);

app.whenReady()
  .then(init)
  .then(() => {
    if (['development'].some((item) => item === globals.ENVIRONMENT)) {
      installExtension(REACT_DEVELOPER_TOOLS)
        .then((name) => console.log(`Added Extension:  ${name}`))
        .catch((err) => console.log('An error occurred: ', err));
    }
  })

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
async function init() {
  let windows = BrowserWindow.getAllWindows();
  if (windows.length === 0) {
    appContext.mainWindow = createWindow();
    windows = BrowserWindow.getAllWindows();
  } else {
    windows[0].show();
    windows[0].focus();
  }

  if (appContext.database === undefined && await database.testConnection()) {
    appContext.database = await database.init()
  }  
}

function destroy() {
  app.quit();
  appContext.database.knex.destroy()
}
