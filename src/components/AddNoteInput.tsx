import { useEffect, useState, useRef } from "react"

import { useContext } from '@providers/Context'
import AddNoteButtonCarrousel from "@components/AddNoteButtonCarousel"
import styles from "@styles/add-note-input.module.css"

function AddNoteInput({
  className=''
}: {
  className?: string
}) {
  const { state: { commons: { noteInput } }, actions } = useContext()

  const createNote = async () => {
    if (noteInput.trim() === '') return

    const note = await window.electronAPI.notes.create({
      data: {
        content: noteInput,
        pageId: 1,
      }
    })
    if (note !== undefined) {
      //# board.notes.add({ values: [note]})
      actions.commons.noteInput.set({ value: '' })
    }
  }

  const keyMap = useRef<{[key: number]: boolean}>({
    18: false,
    13: false,
  })
  const onKeyDown = (event: any) => {
    if (event.keyCode in keyMap.current)
      keyMap.current[event.keyCode] = true

    if (Object.values(keyMap.current).every((item) => item))
      createNote()
  }
  
  const onKeyUp = (event: any) => {
    if (event.keyCode in keyMap.current)
      keyMap.current[event.keyCode] = false
  }

  return (
    <div className={`${className} ${styles.container}`}>
      <textarea
        placeholder="Add some thoughts..."
        className={`${styles.textarea}`}
        value={noteInput}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onChange={
          (e) => actions.commons.noteInput.set({ value: e.target.value })
        }
      />
      <AddNoteButtonCarrousel 
        onSave={() => createNote()}
        isSaveActive={noteInput !== ''}
      />
    </div>
  );
}

export default AddNoteInput;