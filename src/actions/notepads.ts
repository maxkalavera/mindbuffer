import _ from 'lodash'

import type { Action } from '@ts/providers/Context.types'
import type { Notepad } from "@ts/models/Notepads.types"

export const setNotepads: Action<{ values: Notepad[] }> = (state, payload) => ({
  ...state,
  models: {
    ...state.models,
    notepads: {
      ...state.models.notepads,
      values: payload.values
    }
  }
})

export const addNotepads: Action<{ values: Notepad[] }> = (state, payload) => ({
  ...state,
  models: {
    ...state.models,
    notepads: {
      ...state.models.notepads,
      values: [...state.models.notepads.values, ...payload.values]
    }
  }
})

export const updateNotepads: Action<{ values: Notepad[] }> = (state, payload) => ({
  ...state,
  models: {
    ...state.models,
    notepads: {
      ...state.models.notepads,
      values: state.models.notepads.values.map((item) => 
        payload.values.find((payloadItem) => payloadItem.id === item.id) || 
        item
      )
    }
  }
})

export const destroyNotepads: Action<{ values: Notepad[] }> = (state, payload) => ({
  ...state,
  models: {
    ...state.models,
    notepads: {
      ...state.models.notepads,
      values: state.models.notepads.values.filter((item) => { 
        return !payload.values.some((payloadItem) => payloadItem.id === item.id)
      })
    }
  }
})

export const increasePagination: Action = (state) => ({
  ...state,
  models: {
    ...state.models,
    notepads: {
      ...state.models.notepads,
      page: state.models.notepads.page + 1
    }
  }
})

export const resetPagination: Action = (state) => ({
  ...state,
  models: {
    ...state.models,
    notepads: {
      ...state.models.notepads,
      page: 1
    }
  }
})

export const setNextPage: Action<{ value: boolean }> = (state, payload) => ({
  ...state,
  models: {
    ...state.models,
    notepads: {
      ...state.models.notepads,
      hasNextPage: payload.value
    }
  }
})