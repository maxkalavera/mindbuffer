
import { NotepadID } from '@commons/ts/models/Notepads.types'
import { BaseModel } from '@commons/ts/models/BaseModel.types'

export type PageID = number

export interface PagePayload {
  name: string,
  notepadID: NotepadID,
}

export interface PageData {
  name: string,
  notepadID: NotepadID,
}

export type Page = BaseModel & PageData

export interface PagesFiltersPayload {
  page?: number,
  paginationOffset?: number,
}