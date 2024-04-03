import type { Page } from '@ts/models/Pages.types'
import type { Base } from '@ts/models/Base.types'

export type NotepadID = number

export interface NotepadPayload {
  name: string
  pages: Page[]
}

export interface NotepadData {
  name: string
  pages: Page[]
}

export type Notepad = Base & NotepadData

export interface NotepadFiltersPayload {
  page?: number,
  search?: string,
  paginationOffset?: number,
  associatedPage?: number,
  associatedPaginationOffset?: number,
}