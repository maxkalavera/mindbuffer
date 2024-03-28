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
  const { board } = useContext()

  return (
    <InifiniteScroll
      className={`${styles.container} ${className}`}
      hasMore={board.notes.hasNextPage.value}
      inverse={true}
      next={() => {
        board.notes.page.increase()
      }}
      items={
        board.notes.values.map((item: Note) => (
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