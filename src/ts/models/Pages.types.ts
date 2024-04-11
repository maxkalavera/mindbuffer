
import { NotepadID } from '@ts/models/Notepads.types'
import { BaseModel } from '@src/ts/models/BaseModel.types'

export type PageID = number

export interface PagePayload {
  name: string,
  notepadId: NotepadID,
}

export interface PageData {
  name: string,
  notepadId: NotepadID,
}

export type Page = BaseModel & PageData

export interface PageFiltersPayload {
  notepads: {
    id: NotepadID,
    page: number
  }[],
  search?: string,
  paginationOffset?: number,
}