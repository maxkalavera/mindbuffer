import React, { useEffect, useState } from "react"
import { faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons"

import commonsSlice from "@renderer/actions/commons.slice"
import store from "@renderer/utils/store"
import IconButton from "@renderer/components/IconButton"
import styles from "@renderer/styles/searchbar.module.css"

function Searchbar({
  className = "",
}: {
  className?: string,
}) {
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
    state.search  !== context.commons.search
  return (
    <div className={`${className} ${styles.container}`}>
      <input
        id={globals.ENVIRONMENT === 'testing' ? 'id:searchbar-input:aPNkesepop' : ''}
        type="text"
        placeholder="Search..."
        className={`${styles.input} ${className}`}
        value={state.search}
        onChange={(event) => onInputChange(event)}
        onKeyDown={(event: any) => (event.code === "Enter") ? sendSearch(state.search) : null }
      />
      {
        sendSearchFlag ?
          (
            <IconButton 
              id={globals.ENVIRONMENT === 'testing' ? 'id:searchbar-send-button:OGUB40c5DM' : ''}
              className={styles.button}
              icon={faMagnifyingGlass}
              onClick={() => sendSearch(state.search)}
            />
          ) :
          (
            <IconButton 
              id={globals.ENVIRONMENT === 'testing' ? 'id:searchbar-clear-button:KlsiLQF3zr' : ''}
              className={styles.button}
              icon={faXmark}
              onClick={() => clearSearch()}
            />
          )
      }
    </div>

  );
}

export default Searchbar;