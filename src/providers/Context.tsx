import React from 'react'
import _ from 'lodash'

import useAsyncReducer from '@hooks/useAsyncReducer'

const INITIAL_STATE: any = {
  textInput: '',
  boardNotes: [],
  page: 1,
  search: '',
  hasNextPage: true,
  dispatch: () => undefined as undefined,
}

const context = React.createContext(INITIAL_STATE)

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
  const [state, dispatch] = useAsyncReducer({
    'context/updateTextInput': (state, payload) => {
      state.textInput = payload
    },
    'notes/create': async (state) => {
      const note = await (window as any).database.notes.create(state.textInput)
      if (note !== undefined) {
        state.boardNotes.push(note)
        state.textInput = ''
      }
    },
    'notes/findAll': async (state) => {
      const boardNotes = await (window as any).database.notes.findAll()
      if (boardNotes !== undefined) state.boardNotes = boardNotes
    },
    'notes/delete': async (state, payload) => {
      const isDeleted = await (window as any).database.notes.delete(payload)
      if (isDeleted) {
        state.boardNotes = state.boardNotes.filter((item: any) => item.dataValues.id !== payload)
      }
    },
    'notes/queryBoardNotes': async (state) => {
      const boardNotes = await (window as any).database.notes.queryBoardNotes({
        page: 1,
        search: ''
      })
      if (boardNotes !== undefined) {
        state.boardNotes = boardNotes
        state.page = 1
        state.search = ''
        state.hasNextPage = true
      }
    },
    'notes/search': async (state, payload) => {
      const boardNotes = await (window as any).database.notes.queryBoardNotes({
        page: 1,
        search: payload
      })
      if (Array.isArray(boardNotes)) {
        state.boardNotes = boardNotes
        state.page = 1
        state.search = payload
        state.hasNextPage = true
      }
    },
    'notes/clearSearch': async (state, payload) => {
      const boardNotes = await (window as any).database.notes.queryBoardNotes({
        page: 1,
      })
      if (Array.isArray(boardNotes)) state.boardNotes = boardNotes
    },
    'notes/nextPage': async (state) => {
      if (!state.hasNextPage) return

      const boardNotes = await (window as any).database.notes.queryBoardNotes({
        page: state.page + 1,
        search: state.search
      })
      if (Array.isArray(boardNotes)) {
        state.boardNotes = boardNotes.concat(state.boardNotes)
        state.page = state.page + 1
        if (boardNotes.length === 0) state.hasNextPage = false
      }
    }
  }, initialState)

  return (
    <context.Provider
      value={{
        ...state,
        dispatch,
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