import path from 'node:path'

export function getPreloadEntry () {
  /* @ts-ignore */
  const __filePath = new URL(import.meta.url).pathname
  return path.resolve(path.dirname(__filePath), './preload.js')
}

export function getResourcesDir () {
  /* @ts-ignore */
  const __filePath = new URL(import.meta.url).pathname
  return path.resolve(path.dirname(__filePath), './resources/')
}