import type { Action } from '@ts/providers/Context.types'

export const setSearch: Action<{ value: string }> = (state, payload) => ({
  ...state,
  commons: {
    ...state.commons,
    search: payload.value
  }
})

export const setActiveSearch: Action<{ value: string }> = (state, payload) => ({
  ...state,
  commons: {
    ...state.commons,
    activeSearch: payload.value
  }
})

export const setNoteInput: Action<{ value: string }> = (state, payload) => ({
  ...state,
  commons: {
    ...state.commons,
    noteInput: payload.value
  }
})