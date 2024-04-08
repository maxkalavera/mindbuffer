import React, { useEffect, useRef, useState } from 'react'
import _ from 'lodash'

import store from '@src/store'
import { fetchNotes } from '@actions/notes.slice'
import InifiniteScroll from '@components/utils/InifiniteScroll'
//import { useContext } from '@providers/Context'
import TextNote from "@components/TextNote"
import styles from "@styles/notes-board.module.css"

import { Note } from '@ts/models/Notes.types'

function NotesBoard({
  className=''
}: {
  className?: string
}) {
  const [context, setContext] = useState({ 
    commons: {
      search: '',
    },
    notes: {
      values: [],
      page: 1,
      hasNextPage: true,
      insertedTopHash: 0,
      insertedBottomHash: 0,
    }
  })

  useEffect(() => {
    store.monitor(
      (state) => ({
        commons: { search: state.commons.search },
        notes: state.notes
      }),
      (state) => {
        setContext({
          commons: { search: state.commons.search },
          notes: state.notes
        })
      } 
    )
  }, [])

  const onScrollNext = () => {
    store.dispatch(fetchNotes({
      page: context.notes.page + 1,
      search: context.commons.search,
    }))   
  }

  return (
    <InifiniteScroll
      className={`${styles.container} ${className}`}
      hasMore={context.notes.hasNextPage}
      inverse={true}
      next={onScrollNext}
      insertedStartHash={`${context.notes.insertedBottomHash}`}
      insertedEndHash={`${context.notes.insertedTopHash}`}
      items={
        context.notes.values.map((item: Note) => (
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