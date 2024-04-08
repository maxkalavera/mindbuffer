import React, { useEffect, useReducer, useRef, useState } from 'react'
import _ from 'lodash'
/*
import * as commons from '@actions/commons'
import * as notepads from '@actions/notepads'
import * as notes from '@actions/notes'
import * as pages from '@actions/pages'
*/
import type { Notepad, NotepadID } from '@ts/models/Notepads.types'
import type { 
  ContextState, 
  Action, 
  ContextActions,
  DispatcherBuilder, 
  IntegralContext, 
  Payload,
  ContextRef,
} from '@ts/providers/Context.types'

const INITIAL_STATE: ContextState = {
  commons: {
    search: '',
    activeSearch: '',
    noteInput: '',
  },
  models: {
    notes: {
      values: [],
      page: 1,
      hasNextPage: true,
    },
    notepads: {
      values: [],
      page: 1,
      hasNextPage: true,
    },
    pages: {
      pendingPagesFetching: Array(),
      pendingPagesFetchingCount: 1,
    }
  }
}

const INITIAL_CONTEXT_REF: ContextRef = {
  models: {
    pages: {
      paginationMap: new Map()
    }
  }
}


const context = React.createContext<any>(undefined)

function useContext() {
  return React.useContext(context)
}

function ContextProvider({
  children = [],
  initialState = INITIAL_STATE,
}: {
  children?: JSX.Element[] | JSX.Element
  initialState?: typeof INITIAL_STATE
}): JSX.Element {
  const [state, setState] = useState<ContextState>(initialState)
  const contextRef = useRef(INITIAL_CONTEXT_REF)
  const buildDispatcher: DispatcherBuilder = ((action: Action<Payload>) => {
    return (payload: Payload) => {
      setState((prevState) => action(prevState, payload, contextRef))
    }
  }) as DispatcherBuilder

  /*
  const actions: ContextActions = {
    commons: {
      search: {
        set: buildDispatcher(commons.setSearch)
      },
      activeSearch: {
        set: buildDispatcher(commons.setActiveSearch)
      },
      noteInput: {
        set: buildDispatcher(commons.setNoteInput)
      },
    },
    models: {
      notes: {
        set: buildDispatcher(notes.setNotes),
        add: buildDispatcher(notes.addNotes),
        update: buildDispatcher(notes.updateNotes),
        destroy: buildDispatcher(notes.destroyNotes),
        increasePagination: buildDispatcher(notes.increasePagination),
        resetPagination: buildDispatcher(notes.resetPagination),
        setNextPage: buildDispatcher(notes.setNextPage),
      },
      notepads: {
        set: buildDispatcher(notepads.setNotepads),
        add: buildDispatcher(notepads.addNotepads),
        update: buildDispatcher(notepads.updateNotepads),
        destroy: buildDispatcher(notepads.destroyNotepads),
        increasePagination: buildDispatcher(notepads.increasePagination),
        resetPagination: buildDispatcher(notepads.resetPagination),
        setNextPage: buildDispatcher(notepads.setNextPage),
      },
      pages: {
        set: buildDispatcher(pages.setPages),
        add: buildDispatcher(pages.addPages),
        update: buildDispatcher(pages.updatePages),
        destroy: buildDispatcher(pages.destroyPages),
        increasePagination: buildDispatcher(pages.increasePagination),
        resetPagination: buildDispatcher(pages.resetPagination),
        setNextPage: buildDispatcher(pages.setNextPage),
        resetPendingPagination: buildDispatcher(pages.resetPendingPagination),
      }
    }
  }
  */

  useEffect(() => {
    // Fetch notes from database, re do query if filters change
    const controller = new AbortController()
    new Promise(async (resolve: any) => {
      const notes = await window.electronAPI.notes.getAll({
        page: state.models.notes.page,
        search: state.commons.activeSearch
      })
      if (notes !== undefined && !controller.signal.aborted) {
        //actions.models.notes.add({ values: notes.reverse() })

        if (notes.length === 0) {
          //actions.models.notes.setNextPage({ value: false })
        }
      }
    })
    return () => {
      controller.abort()
    }
  }, [
    state.commons.activeSearch, 
    state.models.notes.page
  ])

  useEffect(() => {
    // Fetch notepads from database, re do query if filters change
    const controller = new AbortController()
    new Promise(async () => {
      const notepads = await window.electronAPI.notepads.getAll({
        page: state.models.notes.page,
        search: state.commons.activeSearch
      })
      if (notepads !== undefined && !controller.signal.aborted) {
        //actions.models.notepads.add({ values: notepads })
        
        if (notepads.length === 0) {
          //actions.models.notes.setNextPage({ value: false })
        }
      }
    })
    return () => {
      controller.abort()
    }
  }, [
    state.commons.activeSearch, 
    state.models.notes.page
  ])

  useEffect(() => {
    const { models: { pages: { paginationMap } } } = contextRef.current
    const { pendingPagesFetching } = state.models.pages
    const controller = new AbortController()
    new Promise(async () => {
      // Fetch more elements from database requested in pendingPagesFetching var
      const pagesByNotepad = await window.electronAPI.pages.getAll({
        notepads: pendingPagesFetching.map(item => {
          const pagination = paginationMap.get(item.id)
          pagination.page += 1
          paginationMap.set(item.id, pagination)
          return {
            id: item.id,
            page: pagination.page
          }
        })
      })
      // If not page is returned by given notepad set flag to show there is no more pages
      pendingPagesFetching.forEach(({ id }) => {
        if (pagesByNotepad.findIndex((item: any) => item.notepadId === id) === -1) {
          const pagination = paginationMap.get(id)
          pagination.hasNextPage = false
          paginationMap.set(id, pagination)
        }
      })
      //actions.models.pages.resetPendingPagination()
    })
    return () => {
      controller.abort()
    }
  }, [
    state.models.pages.pendingPagesFetchingCount
  ])

  return (
    <context.Provider
      value={{
        state,
        //actions,
      }}
    >
      {children}
    </context.Provider>
  )
}

export {
  ContextProvider,
  useContext,
}