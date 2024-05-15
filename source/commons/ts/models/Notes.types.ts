import { BaseModel } from '@commons/ts/models/BaseModel.types'
import type { Page, PageID } from '@commons/ts/models/Pages.types'

export type NoteID = number

export interface NotePayload {
  content: string,
  pageId: PageID,
}

export interface NoteData {
  content: string,
  pageId: PageID,
  page?: Page,
}

export type Note = BaseModel & NoteData

export interface NoteFiltersPayload {
  page?: number,
  search?: string,
  pageID?: PageID,
  paginationOffset?: number,
}