import { dialog, app } from "electron"

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
  error ? console.log(error) : undefined
  if ( __ENVIRONMENT__ !== 'testing' || __DEBUG__ === true) {
    dialog.showErrorBox(title, content)
  }
}

export function ThrowFatalError ({
  content='',
  title='Error',
  error=undefined,
}: ThrowErrorParams = {} ) {
  error ? console.log(error) : undefined
  if ( __ENVIRONMENT__ !== 'testing' || __DEBUG__ === true) {
    dialog.showErrorBox(title, content)
  }
  app.quit()

}