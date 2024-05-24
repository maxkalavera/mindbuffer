import path from 'node:path'
import { fileURLToPath } from 'url';

export function getPreloadEntry () {
  /* @ts-ignore */
  return path.join(path.dirname(fileURLToPath(import.meta.url)), './preload.js')
}

export function getResourcesDir () {
  /* @ts-ignore */
  console.log('fileURLToPath(import.meta.url)---->', fileURLToPath(import.meta.url))
  /* @ts-ignore */
  return path.join(path.dirname(fileURLToPath(import.meta.url)), './resources/')
}