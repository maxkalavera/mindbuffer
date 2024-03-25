
import { NotepadPayload, Notepad, NotepadID } from "@ts/models/Notepads.types"
import { PagePayload, Page, PageID } from "@ts/models/Pages.types"
import type { NotePayload, Note, NoteID } from "@ts/models/Notes.types"

export interface ContextState {
  notepads: {
    values: Notepad[],
    hasNextPage: {
      value: boolean
    },
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
    scrollBottom: {
      value: boolean
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