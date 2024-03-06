import { useState } from "react"

import { useContext } from '@providers/Context'
import AddNoteButtonCarrousel from "@components/AddNoteButtonCarousel"
import styles from "@styles/add-note-input.module.css"

function AddNoteInput() {
  const { dispatch } = useContext()
  const [value, setValue] = useState('')

  const saveNote = async () => {
    dispatch({type: 'notes/create', payload: value})
  }

  return (
    <div className={styles.container}>
      <textarea
        placeholder="Add some thoughts..."
        className={`${styles.textarea}`}
        value={value}
        onChange={e => setValue(e.target.value)}
      />
      <AddNoteButtonCarrousel 
        onSave={() => saveNote()}
        isSaveActive={value !== ''}
      />
    </div>
  );
}

export default AddNoteInput;