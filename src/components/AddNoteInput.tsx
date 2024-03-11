import { useState } from "react"

import { useContext } from '@providers/Context'
import AddNoteButtonCarrousel from "@components/AddNoteButtonCarousel"
import styles from "@styles/add-note-input.module.css"

function AddNoteInput({
  className=''
}: {
  className?: string
}) {
  const { dispatch, textInput } = useContext()

  const saveNote = async () => {
    dispatch({type: 'notes/create'})
  }

  return (
    <div className={`${className} ${styles.container}`}>
      <textarea
        placeholder="Add some thoughts..."
        className={`${styles.textarea}`}
        value={textInput}
        onChange={e => dispatch({type: 'context/updateTextInput', payload: e.target.value})}
      />
      <AddNoteButtonCarrousel 
        onSave={() => saveNote()}
        isSaveActive={textInput !== ''}
      />
    </div>
  );
}

export default AddNoteInput;