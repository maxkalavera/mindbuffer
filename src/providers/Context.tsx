import React, { useEffect, useReducer, useRef, useState } from 'react'
import _ from 'lodash'

import type { ContextState, ReducerActions, ContextActions } from '@ts/providers/Context.types'

// ContextState
const INITIAL_STATE: ContextState = {
  notepads: {
    values: [],
    page: { value: 1},
    hasNextPage: { value: true},
  },
  addNoteInput: {
    value: ''
  },
  board: {
    notes: {
      values: [],
      page: { value: 1 },
      hasNextPage: { value: true}
    },
    scrollBottom: {
      value: true
    },
  },
  searchBar: {
    value: '',
    activeSearch: {
      value: ''
    },
  }
}

//const context = React.createContext<ContextActions & ContextState>(
//  INITIAL_STATE as ContextActions & ContextState)
const context = React.createContext<any>(INITIAL_STATE)

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
  const [state, setState] = useState<ContextActions & ContextState>(
    initialState as ContextActions & ContextState)
  const actions = _.cloneDeep(state)

  actions.addNoteInput.update = (payload) => setState((prevState) => {
    return {
      ...prevState,
      addNoteInput: {
        ...prevState.addNoteInput,
        value: payload.value
      }
    }
  })

  actions.board.notes.add = (payload) => setState((prevState) => {
    return {
      ...prevState,
      board: {
        ...prevState.board,
        notes: {
          ...prevState.board.notes,
          values: [...prevState.board.notes.values, ...payload.values]
        }
      }
    }
  })

  actions.board.notes.remove = (payload) => setState((prevState) => {
    return {
      ...prevState,
      board: {
        ...prevState.board,
        notes: {
          ...prevState.board.notes,
          values: prevState.board.notes.values.filter((item) => item.id !== payload.id)
        }
      }
    }
  })

  actions.board.notes.clear = () => setState((prevState) => {
    return {
      ...prevState,
      board: {
        ...prevState.board,
        notes: {
          ...prevState.board.notes,
          values: []
        }
      }
    }
  })

  actions.board.notes.page.increase = () => setState((prevState) => {
    return {
      ...prevState,
      board: {
        ...prevState.board,
        notes: {
          ...prevState.board.notes,
          page: {
            ...prevState.board.notes.page,
            value: prevState.board.notes.page.value + 1
          }
        }
      }
    }
  })

  actions.board.notes.page.reset = () => setState((prevState) => {
    return {
      ...prevState,
      board: {
        ...prevState.board,
        notes: {
          ...prevState.board.notes,
          page: {
            ...prevState.board.notes.page,
            value: 1
          }
        }
      }
    }
  })

  actions.board.notes.hasNextPage.set = (payload) => setState((prevState) => {
    return {
      ...prevState,
      board: {
        ...prevState.board,
        notes: {
          ...prevState.board.notes,
          hasNextPage: {
            ...prevState.board.notes.hasNextPage,
            value: payload.value
          }
        }
      }
    }
  })

  actions.board.scrollBottom.set = (payload) => setState((prevState) => {
    return {
      ...prevState,
      board: {
        ...prevState.board,
        scrollBottom: {
          ...prevState.board.scrollBottom,
          value: payload.value
        }
      }
    }
  })

  actions.searchBar.update = (payload) => setState((prevState) => {
    return {
      ...prevState,
      searchBar: {
        ...prevState.searchBar,
        value: payload.value
      }
    }
  })

  actions.searchBar.activeSearch.update = (payload) => setState((prevState) => {
    return ({
      ...prevState,
      searchBar: {
        ...prevState.searchBar,
        activeSearch: {
          ...prevState.searchBar.activeSearch,
          value: payload.value
        }
      }  
    })
  })

  actions.searchBar.activeSearch.clear = () => setState((prevState) => {
    return {
      ...prevState,
      searchBar: {
        ...prevState.searchBar,
        value: '',
        activeSearch: {
          ...prevState.searchBar.activeSearch,
          value: ''
        }
      }
    }
  })

  useEffect(() => {
    const controller = new AbortController()
    new Promise(async (resolve: any) => {
      const notes = await window.electronAPI.notes.getAll({
        page: state.board.notes.page.value,
        search: state.searchBar.activeSearch.value
      })
      if (notes === undefined || controller.signal.aborted) return
      
      actions.board.notes.add({ values: notes.reverse() })
      if (actions.board.notes.page.value === 1)
        actions.board.scrollBottom.set({ value: true })
      if (notes.length === 0)
        actions.board.notes.hasNextPage.set({ value: false })
      resolve()
    })
    return () => {
      controller.abort()
    }

  }, [state.board.notes.page.value, state.searchBar.activeSearch.value])

  useEffect(() => {
    const controller = new AbortController()
    new Promise(async (resolve: any) => {
      const notepads = await window.electronAPI.notepads.getAll({
        page: 1,
        search: '',
      })
      resolve()
    })
    return () => {
      controller.abort()
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    new Promise(async (resolve: any) => {
      const pages = await window.electronAPI.pages.getAll({
        page: 1,
        search: '',
      })
      console.log('RENDERER PAGES', pages)
      resolve()
    })
    return () => {
      controller.abort()
    }
  }, [])

  return (
    <context.Provider
      value={{
        ..._.merge(actions, state),
        setState
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