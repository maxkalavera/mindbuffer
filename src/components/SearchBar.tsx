import { faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons"

import commonsSlice from "@actions/commons.slice"
import store from "@src/store"
import IconButton from "@components/IconButton"
import styles from "@styles/searchbar.module.css"
import { useEffect, useState } from "react"

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
        id={__ENVIRONMENT__ === 'testing' ? 'id:searchbar-input:aPNkesepop' : ''}
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
              id={__ENVIRONMENT__ === 'testing' ? 'id:searchbar-send-button:OGUB40c5DM' : ''}
              className={styles.button}
              icon={faMagnifyingGlass}
              onClick={() => sendSearch(state.search)}
            />
          ) :
          (
            <IconButton 
              id={__ENVIRONMENT__ === 'testing' ? 'id:searchbar-clear-button:KlsiLQF3zr' : ''}
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