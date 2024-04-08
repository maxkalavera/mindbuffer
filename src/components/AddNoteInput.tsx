import { useEffect, useState, useRef } from "react"

import notesSlice from "@actions/notes.slice"
import commonsSlice from "@actions/commons.slice"
import store from "@src/store"
import AddNoteButtonCarrousel from "@components/AddNoteButtonCarousel"
import styles from "@styles/add-note-input.module.css"

function AddNoteInput({
  className=''
}: {
  className?: string
}) {
  const [context, setContext] = useState<{ value: string }>({ value: '' })

  useEffect(() => {
    store.monitor(
      (state) => state.commons.noteInput,
      (state) => { setContext({ value: state.commons.noteInput }) }
    )
  }, [])

  const createNote = async () => {
    if (context.value.trim() === '') return

    const note = await window.electronAPI.notes.create({
      data: {
        content: context.value,
        pageId: 1,
      }
    })
    if (note !== undefined) {
      const { setNoteInput } = commonsSlice.actions
      const { addBotom: addNotes } = notesSlice.actions
      store.dispatch(setNoteInput({ value: '' }))
      store.dispatch(addNotes({ values: [note] }))
    }
  }

  const updateInputValue = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { setNoteInput } = commonsSlice.actions
    store.dispatch(setNoteInput({ value: event.target.value }))
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
        value={context.value}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onChange={updateInputValue}
      />
      <AddNoteButtonCarrousel 
        onSave={() => createNote()}
        isSaveActive={context.value.trim() !== ''}
      />
    </div>
  );
}

export default AddNoteInput;