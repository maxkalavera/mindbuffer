
import type { NoteID } from "@ts/models/Notes.types"

export interface ContextState {
  notepads: {
    values: any[],
    page: {
      value: number
    },
    hasNextPage: {
      value: boolean
    },
  },
  addNoteInput: {
    value: string
  },
  board: {
    notes: {
      values: any[],
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
  addNoteInput: {
    update: (payload: {value: string}) => void,
  },
  board: {
    notes: {
      add: (payload: {values: any[]}) => void,
      remove: (payload: { id: NoteID }) => void,
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