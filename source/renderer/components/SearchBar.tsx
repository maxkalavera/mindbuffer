import React, { useEffect, useState } from "react"
import { TextField, IconButton } from "@radix-ui/themes"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons';

import store from "@renderer/utils/redux-store"
import commonsSlice from "@renderer/actions/commons.slice"

const Searchbar = () => {
  const [state, setState] = useState({
    search: '',
  })
  const [context, setContext] = useState({
    commons: {
      search: '',
    },
    notes: {
      page: 1,
    },
  })

  useEffect(() => {
    store.monitor(
      (state) => ({
        commons:  {
          search: state.commons.search,
        },
        notes: {
          page: state.notes.page
        },
      }), 
      (state) => {
        setContext({
          commons:  {
            search: state.commons.search,
          },
          notes: {
            page: state.notes.page,
          },
        })
      }
    )
  }, [])

  const sendSearch = (search: string) => {
    const { setSearch } = commonsSlice.actions
    store.dispatch(setSearch({ value: search }))
  }

  const clearSearch = () => {
    const { setSearch } = commonsSlice.actions
    store.dispatch(setSearch({ value: '' }))
    setState({search: ''})
  }

  const onInputChange = (event: any) => {
    setState({search: event.target.value})
  }

  const sendSearchFlag = state.search === '' || 
    state.search  !== context.commons.search;
  return (
    <TextField.Root
      variant='soft'
      placeholder='Search'
      value={state.search}
      onChange={(event) => onInputChange(event)}
      onKeyDown={(event: any) => (event.code === "Enter") ? sendSearch(state.search) : null }
    >
      <TextField.Slot 
        side='right'
      >
        {
          sendSearchFlag ?
            <IconButton
              variant="ghost"
              onClick={() => sendSearch(state.search)}
            >
              <FontAwesomeIcon 
                size='sm'
                icon={faMagnifyingGlass}
              />
            </IconButton>
          :          
            <IconButton 
              variant="ghost"
              style={{cursor: 'pointer'}}
              onClick={() => clearSearch()}
            >
              <FontAwesomeIcon 
                size='sm'
                icon={faXmark}
              />
            </IconButton>
        }

      </TextField.Slot>
    </TextField.Root>
  )
}

export default Searchbar;