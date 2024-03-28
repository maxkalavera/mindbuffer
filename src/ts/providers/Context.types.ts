
import { NotepadPayload, Notepad, NotepadID } from "@ts/models/Notepads.types"
import { PagePayload, Page, PageID } from "@ts/models/Pages.types"
import type { NotePayload, Note, NoteID } from "@ts/models/Notes.types"

const n = new Map<string, {page: number, hasNextPage: boolean}>()

export interface ContextState {
  notepads: {
    values: Notepad[],
    hasNextPage: {
      value: boolean
    },
    pages: {
      paginateOver: {
        values: NotepadID[]
      }
    }
  },
  addNoteInput: {
    value: string
  },
  board: {
    notes: {
      values: Note[],
      page: {
        value: number,
      },
      hasNextPage: {
        value: boolean
      },
    },
  },
  searchBar: {
    value: string,
    activeSearch: {
      value: string
    }
  }
}

export interface ContextActions {
  notepads: {
    add: (payload: {values: Notepad[]}) => void,
    update: (payload: { value: Notepad }) => void,
    destroy: (payload: { id: NotepadID }) => void,
    pages: {
      add: (payload: {values: Page[]}) => void,
      update: (payload: { value: Page }) => void,
      destroy: (payload: { value: Page }) => void,
    },
  }
  addNoteInput: {
    update: (payload: {value: string}) => void,
  },
  board: {
    notes: {
      add: (payload: {values: Note[]}) => void,
      destroy: (payload: { id: NoteID }) => void,
      clear: () => void,
      page: {
        increase: () => void,
        reset: () => void,
      },
      hasNextPage: {
        set: (payload: {value: boolean}) => void
      },
    },
    scrollBottom: {
      set: (payload: {value: boolean}) => void
    }
  }
  searchBar: {
    update: (payload: {value: string}) => void,
    activeSearch: {
      update: (payload: {value: string}) => void,
      clear: () => void,
    }
  }
}

export interface ReducerActions {
  [key: string]: (state: any, payload: { [key: string | number | symbol]: any }) => ContextState
}