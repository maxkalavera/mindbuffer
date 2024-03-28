import type { Page } from '@ts/models/Pages.types'
import type { Base } from '@ts/models/Base.types'

export type NotepadID = number

export interface NotepadPayload {
  name: string
}

export interface NotepadData {
  name: string
  pages?:{
    values: {
      value: Page,
      page: number,
      hasNextPage: boolean
    }[]
  }
}

export type Notepad = Base & NotepadData

export interface NotepadFiltersPayload {
  page?: number,
  search?: string,
  paginationOffset?: number,
  associatedPage?: number,
  associatedPaginationOffset?: number,
}