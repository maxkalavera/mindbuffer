import { faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons"

import { useContext } from "@providers/Context"
import IconButton from "@components/IconButton"
import styles from "@styles/searchbar.module.css"
import { useState } from "react"

function Searchbar({
  className = "",
}: {
  className?: string,
}) {
  const { state, actions } = useContext()

  const sendSearch = () => {
    actions.commons.activeSearch.set({ value: state.commons.search })
    //# board.notes.clear()
    //# board.notes.page.reset()
  }

  const clearSearch = () => {
    actions.commons.activeSearch.set({ value: '' })
    //# board.notes.clear()
    //# board.notes.page.reset()
  }

  const onInputChange = (event: any) => {
    actions.commons.search.set({ value: event.target.value })
  }

  const useSearchButton = state.commons.search === '' || 
    state.commons.search  !== state.commons.activeSearch;
  return (
    <div className={`${className} ${styles.container}`}>
      <input
        type="text"
        placeholder="Search..."
        className={`${styles.input} ${className}`}
        value={state.commons.search}
        onChange={(event) => onInputChange(event)}
        onKeyDown={(event: any) => (event.code === "Enter") ? sendSearch() : null }
      ></input>
      <IconButton 
        className={styles.button}
        icon={useSearchButton ? faMagnifyingGlass : faXmark}
        onClick={() => useSearchButton ? sendSearch() : clearSearch()}
      />
    </div>

  );
}

export default Searchbar;