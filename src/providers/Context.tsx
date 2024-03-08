import React from 'react'
import _ from 'lodash'

import useAsyncReducer from '@hooks/useAsyncReducer'

const INITIAL_STATE: {[key: string]: any} = {
  boardNotes: [],
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
    'notes/create': async (state, payload) => {
      const note = await (window as any).database.notes.create(payload)
      if (note) {
        state.boardNotes.push(note)
      } else {
        // Error
      }
    },
    'notes/findAll': async (state) => {
      const boardNotes = await (window as any).database.notes.findAll()
      if (boardNotes) state.boardNotes = boardNotes
    },
    'notes/delete': async (state, payload) => {
      const isDeleted = await (window as any).database.notes.delete(payload)
      if (isDeleted) {
        state.boardNotes = state.boardNotes.filter((item: any) => item.dataValues.id !== payload)
      } else {
        // Error
      }
    },
    'notes/boardQuery': async (state, payload) => {
      const boardNotes = await (window as any).database.notes.boardQuery({
        page: 1,
      })
      if (boardNotes) state.boardNotes = boardNotes
    },
    'notes/search': async (state, payload) => {
      const boardNotes = await (window as any).database.notes.boardQuery({
        page: 1,
        search: payload
      })
      if (boardNotes) state.boardNotes = boardNotes
    },
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