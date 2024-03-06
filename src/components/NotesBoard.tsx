import React from 'react'

import { useContext } from '@providers/Context'
import TextNote from "@components/TextNote"
import styles from "@styles/notes-board.module.css"
import { useEffect } from 'react'

function NotesBoard() {
  const { dispatch, boardNotes } = useContext()

  useEffect(() => {
    dispatch({type: 'notes/findAll'})
  }, [])

  return (
    <div className={styles.container}>
      {
        boardNotes.map((item, index) => (
          <TextNote 
            key={index}
            note={item}
          />
        ))
      }
    </div>
  );
}

export default NotesBoard;