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
      const note = await window.database.notes.create(payload)
      state.boardNotes.push(note)
      return state
    },
    'notes/findAll': async (state, payload) => {
      const boardNotes = await window.database.notes.findAll()
      if (boardNotes) state.boardNotes = boardNotes
      return state
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