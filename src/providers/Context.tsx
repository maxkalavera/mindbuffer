import React, { useEffect, useReducer, useRef, useState } from 'react'
import _ from 'lodash'

import type { ContextState, ReducerActions, ContextActions } from '@ts/providers/Context.types'

// ContextState
const INITIAL_STATE: ContextState = {
  notepads: {
    values: [],
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

const context = React.createContext<ContextActions & ContextState>(
  INITIAL_STATE as ContextActions & ContextState)

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
  const [state, setState] = useState<ContextState & ContextActions>(
    initialState as ContextState & ContextActions)
  const actions = _.cloneDeep(state)

  actions.notepads.add = (payload) => setState((prevState) => {
    const clonedNotepads = _.cloneDeep(prevState.notepads.values)
    for (let i = 0; i < payload.values.length; i++) {
      const notepad = clonedNotepads.find(
        (item) => item.id == payload.values[i].id)
      if (notepad) {
        notepad.pages = notepad.pages.concat(payload.values[i].pages)
      }
      // const { notepadId: relatedNotepadId } = payload.values[i]
      // const notepad = clonedNotepads.find((item) => item.id == relatedNotepadId)
      // notepad.pages.push(payload.values[i])
    }

    return {
      ...prevState,
      notepads: {
        ...prevState.notepads,
        values: [...prevState.notepads.values, ...payload.values]
      }
    }
  })

  actions.notepads.update = (payload) => setState((prevState) => {
    const values = prevState.notepads.values.slice()
    const notepadIndex = values.findIndex((item) => item.id === payload.value.id)
    if(notepadIndex > 0)
      values.splice(notepadIndex, 1, payload.value)
    return {
      ...prevState,
      notepads: {
        ...prevState.notepads,
        values
      }
    }
  })

  actions.notepads.destroy = (payload) => setState((prevState) => {
    return {
      ...prevState,
      notepads: {
        ...prevState.notepads,
        values: prevState.notepads.values.filter((item) => item.id !== payload.id)
      }
    }
  })

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

  actions.board.notes.destroy = (payload) => setState((prevState) => {
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

  actions.notepads.pages = {} as any

  actions.notepads.pages.add = (payload) => setState((prevState) => {
    const clonedNotepads = _.cloneDeep(prevState.notepads.values)
    for (let i = 0; i < payload.values.length; i++) {
      const { notepadId: relatedNotepadId } = payload.values[i]
      const notepad = clonedNotepads.find((item) => item.id == relatedNotepadId)
      notepad.pages.push(payload.values[i])
    }

    return {
      ...prevState,
      notepads: {
        ...prevState.notepads,
        values: clonedNotepads
      }
    }
  })

  actions.notepads.pages.update = (payload) => setState((prevState) => {
    const clonedNotepads = _.cloneDeep(prevState.notepads.values)
    const notepad = clonedNotepads.find((item) => item.id == payload.value.notepadId)
    if (notepad) {
      const pageIndex = notepad.pages.findIndex((item) => item.id === payload.value.id)
      if (pageIndex > 0)
        notepad.pages.splice(pageIndex, 1, payload.value)
    }

    return {
      ...prevState,
      notepads: {
        ...prevState.notepads,
        values: clonedNotepads
      }
    }
  })

  actions.notepads.pages.destroy = (payload) => setState((prevState) => {
    const clonedNotepads = _.cloneDeep(prevState.notepads.values)
    const notepad = clonedNotepads.find(
      (item) => item.id == payload.value.notepadId)
    if (notepad) {
      notepad.pages = notepad.pages.filter((item) => item.id !== payload.value.id)
    }

    return {
      ...prevState,
      notepads: {
        ...prevState.notepads,
        values: clonedNotepads
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
      if (notes !== undefined && !controller.signal.aborted) {
        actions.board.notes.add({ values: notes.reverse() })
        if (actions.board.notes.page.value === 1)
          actions.board.scrollBottom.set({ value: true })
        if (notes.length === 0)
          actions.board.notes.hasNextPage.set({ value: false })
      }
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
      if (notepads !== undefined && !controller.signal.aborted) {
        actions.notepads.add({ 
          values: notepads.map(
            (item: any) => ({
              ...item,
              pages: item.pages.reverse()
            })
          ).reverse() 
        })
      }
    })
    return () => {
      controller.abort()
    }
  }, [])
  
  return (
    <context.Provider
      value={{
        ...actions,
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