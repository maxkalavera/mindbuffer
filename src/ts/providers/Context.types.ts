
import { MutableRefObject } from "react"

import { NotepadPayload, Notepad, NotepadID } from "@ts/models/Notepads.types"
import { PagePayload, Page, PageID } from "@ts/models/Pages.types"
import type { NotePayload, Note, NoteID } from "@ts/models/Notes.types"

export type Payload = {
  [key: string]: any
}

export type ContextRef = {
  models: {
    pages: {
      paginationMap: Map<NotepadID, {
        page: number,
        hasNextPage: boolean,
      }>
    }
  }
}

export type Action<T extends Payload=undefined> = (
  state: ContextState, 
  payload?: T,
  ContextRef?: MutableRefObject<ContextRef>,
) => ContextState

export type Dispatcher<T extends Payload=undefined> =
  T extends undefined ? 
    () => void : 
    (payload: T) => void

export type DispatcherBuilder<T extends Payload = undefined> = 
  (
    action: Action<T>
  ) => Dispatcher<T> | Dispatcher<undefined>

export interface ContextState {
  commons: {
    search: string,
    activeSearch: string,
    noteInput: string,
  },
  models: {
    notes: {
      values: Note[],
      page: number,
      hasNextPage: boolean,
    },
    notepads: {
      values: Notepad[],
      page: number,
      hasNextPage: boolean,
    },
    pages: {
      pendingPagesFetching: {
        id: NotepadID,
      }[],
      pendingPagesFetchingCount: number,
    },
  }
}

export interface ContextActions {
  commons: {
    search: {
      set: Dispatcher<{ value: string }>
    },
    activeSearch: {
      set: Dispatcher<{ value: string }>
    },
    noteInput: {
      set: Dispatcher<{ value: string }>
    },
  },
  models: {
    notes: {
      set: Dispatcher<{ values: Note[] }>,
      add: Dispatcher<{ values: Note[] }>,
      update: Dispatcher<{ values: Note[] }>,
      destroy: Dispatcher<{ values: Note[] }>,
      increasePagination: Dispatcher,
      resetPagination: Dispatcher,
      setNextPage: Dispatcher<{ value: boolean }>,
    },
    notepads: {
      set: Dispatcher<{ values: Note[] }>,
      add: Dispatcher<{ values: Note[] }>,
      update: Dispatcher<{ values: Note[] }>,
      destroy: Dispatcher<{ values: Note[] }>,
      increasePagination: Dispatcher,
      resetPagination: Dispatcher,
      setNextPage: Dispatcher<{ value: boolean }>,
    }
    pages: {
      set: Dispatcher<{ values: Note[] }>,
      add: Dispatcher<{ values: Note[] }>,
      update: Dispatcher<{ values: Note[] }>,
      destroy: Dispatcher<{ values: Note[] }>,
      increasePagination: Dispatcher<{
        values: {
          id: NotepadID
        }[]
      }>,
      resetPagination: Dispatcher<{
        values: {
          id: NotepadID
        }[]
      }>,
      setNextPage: Dispatcher<{ 
        values: {
          id: NotepadID,
          hasNextPage: boolean,
        }[]
      }>,
      resetPendingPagination: Dispatcher,
    }
  }
}

export type IntegralContext = {
  state: ContextState,
  actions: ContextActions
}