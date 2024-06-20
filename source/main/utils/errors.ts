import { dialog, app } from "electron"

import store from '@main/utils/electron-store'

type ThrowErrorParams = {
  content?: string,
  title?: string,
  error?: Error,
}

export function ThrowError ({
  content='',
  title='Error',
  error=undefined,
}: ThrowErrorParams = {} ) {
  if (error && globals.ENVIRONMENT !== 'testing') {
    const detail = `Type: Error\n\n` +
      `Stack:\n${error.stack}\n\n` +
      `Globals:\n${JSON.stringify(globals, undefined, 4)}\n\n` +
      `Electron store:\n${JSON.stringify(store.store, undefined, 4)}\n\n`
    globals.DEBUG ? console.log(detail) : ''
    dialog.showMessageBox(undefined, {
      message: content,
      detail: globals.DEBUG ? detail : '',
      type: 'error',
      title: title,
      buttons: [
        'Close'
      ]
    })
  }
}

export function ThrowFatalError ({
  content='',
  title='Fatal error',
  error=undefined,
}: ThrowErrorParams = {} ) {
  if (error && globals.ENVIRONMENT !== 'testing') {
    const detail = `Type: Fatal Error\n\n` +
      `Stack:\n${error.stack}\n\n` +
      `Globals:\n${JSON.stringify(globals, undefined, 4)}\n\n` +
      `Electron store:\n${JSON.stringify(store.store, undefined, 4)}\n\n`
    globals.DEBUG ? console.log(detail) : ''
    dialog.showMessageBox(undefined, {
      message: content,
      detail: globals.DEBUG ? detail : '',
      type: 'error',
      title: title,
      buttons: [
        'Close'
      ]
    }).then((response) => {
      console.log('Error response:', response)
      app.quit()
    })
  }
}