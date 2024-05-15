import { dialog, app } from "electron"

import settings from '@main/utils/settings'

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
    dialog.showMessageBox(undefined, {
      message: content,
      detail: globals.DEBUG ? 
        `Type: Error\n\n` +
        `Stack:\n${error.stack}\n\n` +
        `Globals:\n${JSON.stringify(globals, undefined, 4)}\n\n` +
        `Settings:\n${JSON.stringify(settings.store, undefined, 4)}\n\n` :
        '',
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
    dialog.showMessageBox(undefined, {
      message: content,
      detail: globals.DEBUG ? 
        `Type: Fatal Error\n\n` +
        `Stack:\n${error.stack}\n\n` +
        `Globals:\n${JSON.stringify(globals, undefined, 4)}\n\n` +
        `Settings:\n${JSON.stringify(settings.store, undefined, 4)}\n\n` :
        '',
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