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
  const { searchBar, board } = useContext()

  const sendSearch = () => {
    searchBar.activeSearch.update({ value: searchBar.value })
    board.notes.clear()
    board.notes.page.reset()
  }

  const clearSearch = () => {
    searchBar.activeSearch.clear()
    board.notes.clear()
    board.notes.page.reset()
  }

  const onInputChange = (event: any) => {
    searchBar.update({ value: event.target.value })
  }

  const useSearchButton = searchBar.value === '' || searchBar.value !== searchBar.activeSearch.value;
  return (
    <div className={`${className} ${styles.container}`}>
      <input
        type="text"
        placeholder="Search..."
        className={`${styles.input} ${className}`}
        value={searchBar.value}
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