import type { Page } from '@ts/models/Pages.types'
import type { BaseModel } from '@src/ts/models/BaseModel.types'

export type NotepadID = number

export interface NotepadPayload {
  name: string
}

export interface NotepadData {
  name: string
  pages: Page[]
}

export type Notepad = BaseModel & NotepadData

export interface NotepadFiltersPayload {
  page?: number,
  search?: string,
  paginationOffset?: number,
  associatedPage?: number,
  associatedPaginationOffset?: number,
}