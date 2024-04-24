import { useEffect, useState, useRef } from "react"

import { useAlert } from "@providers/Alert"
import { createNoteThunk } from "@actions/notes.slice"
import store from "@src/store"
import AddNoteButtonCarrousel from "@components/AddNoteButtonCarousel"
import styles from "@styles/add-note-input.module.css"

/* @ts-ignore */
const PLATFORM = navigator.userAgentData.platform

function AddNoteInput({
  className=''
}: {
  className?: string
}) {
  const { showAlert } = useAlert()
  const [state, setState] = useState({
    inputValue: '',
  })
  const [context, setContext] = useState({
    selectedPageID: undefined,
  })

  useEffect(() => {
    store.monitor(
      (state) => ({
        selectedPageID: state.pages.selectedPageID
      }), 
      (state) => {
        setContext({
          selectedPageID: state.pages.selectedPageID
        })
      }
    )
  }, [])

  const createNote = async () => {
    if (state.inputValue.trim() === '') return

    store.dispatch(createNoteThunk({
      content: state.inputValue,
      pageId: context.selectedPageID,
    })).then(() => {
      showAlert({ message: 'Note created', type: 'success'})
    })
    setState({ inputValue: '' })

  }

  const platformKey = (PLATFORM === 'macOS' ? 'Meta' : 'Control')
  const keyMap = useRef<{[key: string]: boolean}>({
    [platformKey]: false,
    'Enter': false,
  })
  const onKeyDown = (event: any) => {
    if (event.key in keyMap.current)
      keyMap.current[event.key] = true

    if (Object.values(keyMap.current).every((item) => item)) {
      createNote()
      Object.keys(keyMap.current).forEach((key) => keyMap.current[key] = false)
    }
  }
  
  const onKeyUp = (event: any) => {
    if (event.key in keyMap.current)
      keyMap.current[event.key] = false
  }

  return (
    <div className={`${className} ${styles.container}`}>
      <textarea
        placeholder="Add some thoughts..."
        className={`${styles.textarea}`}
        value={state.inputValue}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onChange={(event) => setState({ inputValue: event.target.value })}
      />
      <AddNoteButtonCarrousel 
        onSave={createNote}
        isSaveActive={state.inputValue.trim() !== ''}
      />
    </div>
  );
}

export default AddNoteInput;