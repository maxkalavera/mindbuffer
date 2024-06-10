import React, { useEffect, useState, useRef } from "react"

import store from "@renderer/utils/store"
import { useAlert } from "@renderer/providers/Alert"
import { createNoteThunk } from "@renderer/actions/notes.slice"
import AddNoteButtonCarrousel from "@renderer/components/AddNoteButtonCarousel"
import styles from "@renderer/styles/add-note-input.module.css"

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
      pageID: context.selectedPageID || null,
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
        id={globals.ENVIRONMENT === 'testing' ? 'id:create-note-textarea:ZtAZE54FsV' : ''}
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