import { Base } from '@ts/models/Base.types'
import type { Page, PageID } from '@ts/models/Pages.types'

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

export type Note = Base & NoteData

export interface NoteFiltersPayload {
  page?: number,
  search?: string,
  paginationOffset?: number,
}