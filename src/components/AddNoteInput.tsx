import { useEffect, useState, useRef } from "react"

import { useContext } from '@providers/Context'
import AddNoteButtonCarrousel from "@components/AddNoteButtonCarousel"
import styles from "@styles/add-note-input.module.css"

function AddNoteInput({
  className=''
}: {
  className?: string
}) {
  //const { dispatch, addNoteInput } = useContext()
  const { addNoteInput, board } = useContext()

  const createNote = async () => {
    if (addNoteInput.value.trim() === '') return

    const note = await window.electronAPI.notes.create({
      content: addNoteInput.value,
      pageId: 1,
    })
    if (note !== undefined) {
      board.notes.add({ values: [note]})
      board.scrollBottom.set({ value: true })
      addNoteInput.update({ value: '' })
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
        value={addNoteInput.value}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onChange={
          (e) => addNoteInput.update({ value: e.target.value})
        }
      />
      <AddNoteButtonCarrousel 
        onSave={() => createNote()}
        isSaveActive={addNoteInput.value !== ''}
      />
    </div>
  );
}

export default AddNoteInput;