import { BaseModel } from '@commons/ts/models/BaseModel.types'
import type { Page, PageID } from '@commons/ts/models/Pages.types'

export type NoteID = number

export interface NotePayload {
  content: string,
  pageID: PageID,
}

export interface NoteData {
  content: string,
  pageID: PageID,
  page?: Page,
}

export type Note = BaseModel & NoteData

export interface NotesFiltersPayload {
  search?: string,
  pageID?: PageID,
  page?: number,
  paginationOffset?: number,
}