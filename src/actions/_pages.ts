import _, { forEach } from 'lodash'

import type { Action } from '@ts/providers/Context.types'
import type { Page } from '@ts/models/Pages.types'
import type { NotepadID } from '@ts/models/Notepads.types'

export const setPages: Action<{ values: Page[] }> = (state, payload) => ({
  ...state,
  models: {
    ...state.models,
    notepads: {
      ...state.models.notepads,
      values: state.models.notepads.values.map((item) => {
        const index = payload.values.findIndex((payloadItem) => payloadItem.notepadId === item.id)
        return {
          ...item,
          pages: index > 0 ? 
            [ payload.values[index] ] :
            []
        }
      })
    }
  }
})

export const addPages: Action<{ values: Page[] }> = (state, payload) => ({
  ...state,
  models: {
    ...state.models,
    notepads: {
      ...state.models.notepads,
      values: state.models.notepads.values.map((item) => {
        const index = payload.values.findIndex((payloadItem) => payloadItem.notepadId === item.id)
        return {
          ...item,
          pages: index > 0 ? 
            [...item.pages, payload.values[index]] :
            item.pages
        }
      })
    }
  }
})

export const updatePages: Action<{ values: Page[] }> = (state, payload) => ({
  ...state,
  models: {
    ...state.models,
    notepads: {
      ...state.models.notepads,
      values: state.models.notepads.values.map((item) => ({
        ...item,
        pages: item.pages.map(item =>
          payload.values.find((payloadItem) => payloadItem.id === item.id) || 
          item
        ),
      }))
    }
  }
})

export const destroyPages: Action<{ values: Page[] }> = (state, payload) => ({
  ...state,
  models: {
    ...state.models,
    notepads: {
      ...state.models.notepads,
      values: state.models.notepads.values.map((item) => ({
        ...item,
        pages: item.pages.filter(item =>
          !payload.values.some((payloadItem) => payloadItem.id === item.id)
        ),
      }))
    }
  }
})

export const increasePagination: Action<{  
  values: {
    id: NotepadID,
  }[]
}> = (state, payload, contextRef) => {
  const { models: { pages } } = contextRef.current
  const pendingPagesFetching = _.clone(state.models.pages.pendingPagesFetching)
  let hasChanged = false

  payload.values.forEach(({ id: notepadID }) => {
    // Add the just scrolled over element to a list of pending for fetching in the database
    const index = pendingPagesFetching.findIndex((item) => item.id === notepadID)
    if (index === -1) {
      let pagination = pages.paginationMap.get(notepadID)
      if (pagination === undefined) {
        pagination = {
          page: 1,
          hasNextPage: true,
        }
        pages.paginationMap.set(notepadID, pagination)
      }

      if (pagination.hasNextPage) {
        hasChanged = true
        pendingPagesFetching.push({
          id: notepadID
        })
      }
    }
  })

  return hasChanged ?
  {
    ...state,
    models: {
      ...state.models,
      pages: {
        ...state.models.pages,
        pendingPagesFetching,
        pendingPagesFetchingCount: state.models.pages.pendingPagesFetchingCount + 1
      }
    }
  } :
  state
}

export const resetPagination: Action<{
  values: {
    id: NotepadID,
  }[]
}> = (state, payload) => {
  //# Deprecated
  return {
    ...state,
  }
}

export const setNextPage: Action<{ 
  values: {
    id: NotepadID,
    hasNextPage: boolean,
  }[]  
}> = (state, payload) => {
  //# Deprecated
  return {
    ...state,
  }
}

export const resetPendingPagination: Action = (state) => {
  return {
    ...state,
    models: {
      ...state.models,
      pages: {
        ...state.models.pages,
        pendingPagesFetching: [],
      }
    }
  }
}