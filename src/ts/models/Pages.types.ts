
import { NotepadID } from '@ts/models/Notepads.types'
import { Base } from '@ts/models/Base.types'

export type PageID = number

export interface PagePayload {
  name: string,
  notepadId: NotepadID,
}

export interface PageData {
  name: string,
  notepadId: NotepadID,
}

export type Page = Base & PageData

export interface PageFiltersPayload {
  notepads: {
    id: NotepadID,
    page: number
  }[],
  search?: string,
  paginationOffset?: number,
}