import _ from 'lodash'

import type { Action } from '@ts/providers/Context.types'
import type { Note } from "@ts/models/Notes.types"

export const setNotes: Action<{ values: Note[] }> = (state, payload) => ({
  ...state,
  models: {
    ...state.models,
    notes: {
      ...state.models.notes,
      values: payload.values
    }
  }
})

export const addNotes: Action<{ values: Note[] }> = (state, payload) => ({
  ...state,
  models: {
    ...state.models,
    notes: {
      ...state.models.notes,
      values: [...payload.values, ...state.models.notes.values]
    }
  }
})

export const updateNotes: Action<{ values: Note[] }> = (state, payload) => ({
  ...state,
  models: {
    ...state.models,
    notes: {
      ...state.models.notes,
      notes: state.models.notes.values.map((item) => 
        payload.values.find((paylodItem) => paylodItem.id === item.id) || 
        item
      )
    }
  }
})

export const destroyNotes: Action<{ values: Note[] }> = (state, payload) => ({
  ...state,
  models: {
    ...state.models,
    notes: {
      ...state.models.notes,
      values: state.models.notes.values.filter((item) => { 
        return !payload.values.some((payloadItem) => payloadItem.id === item.id)
      })
    }
  }
})

export const increasePagination: Action = (state) => ({
  ...state,
  models: {
    ...state.models,
    notes: {
      ...state.models.notes,
      page: state.models.notes.page + 1
    }
  }
})

export const resetPagination: Action = (state) => ({
  ...state,
  models: {
    ...state.models,
    notes: {
      ...state.models.notes,
      page: 1
    }
  }
})

export const setNextPage: Action<{ value: boolean }> = (state, payload) => ({
  ...state,
  models: {
    ...state.models,
    notes: {
      ...state.models.notes,
      hasNextPage: payload.value
    }
  }
})