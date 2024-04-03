import React, { useRef } from 'react'

import InifiniteScroll from '@components/utils/InifiniteScroll'
import { useContext } from '@providers/Context'
import TextNote from "@components/TextNote"
import styles from "@styles/notes-board.module.css"

import { Note } from '@ts/models/Notes.types'

function NotesBoard({
  className=''
}: {
  className?: string
}) {
  const { 
    state,
    actions
  } = useContext()

  return (
    <InifiniteScroll
      className={`${styles.container} ${className}`}
      hasMore={state.models.notes.hasNextPage}
      inverse={true}
      next={() => {
        actions.models.notes.increasePagination()
      }}
      items={
        state.models.notes.values.map((item: Note) => (
          <TextNote 
            key={item.id}
            data={item}
            className={styles.textnote}
          />
        ))
      }
    />
  )
}

export default NotesBoard;