import { faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons"

import { useContext } from "@providers/Context"
import IconButton from "@components/IconButton"
import styles from "@styles/searchbar.module.css"
import { useState } from "react"

function Searchbar({
  className = "",
  value = "",
  onChange = () => undefined
}: {
  className?: string,
  value?: string
  onChange?: (value: string | undefined) => void
}) {
  const { dispatch } = useContext()
  const [ inputValue, setInputValue ] = useState<string>('')
  const [ search, setSearch ] = useState<string>('')

  const sendSearch = () => {
    setSearch(inputValue)
    dispatch({
      type: 'notes/search',
      payload: inputValue
    })
  }

  const clearSearch = () => {
    setInputValue('')
    setSearch('')
    dispatch({ type: 'notes/clearSearch' })
  }

  const useSearchButton = inputValue === '' || inputValue !== search;
  return (
    <div className={`${className} ${styles.container}`}>
      <input
        type="text"
        placeholder="Search..."
        className={`${styles.input} ${className}`}
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
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