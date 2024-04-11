import React, { useEffect, useState } from 'react'

import store from '@src/store'
import { fetchNotesThunk } from '@actions/notes.slice'
import InifiniteScroll from '@components/utils/InifiniteScroll'
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
      adjustScrollHash: 0,
      scrollBeginingHash: 0,
    }
  })

  useEffect(() => {
    store.monitor(
      (state) => ({
        commons: { search: state.commons.search },
        notes: {
          values: state.notes.values,
          page: state.notes.page,
          hasNextPage: state.notes.hasNextPage,
          adjustScrollHash: state.notes.adjustScrollHash,
          scrollBeginingHash: state.notes.scrollBeginingHash,
        }
      }),
      (state) => {
        setContext({
          commons: { 
            search: state.commons.search 
          },
          notes: {
            values: state.notes.values,
            page: state.notes.page,
            hasNextPage: state.notes.hasNextPage,
            adjustScrollHash: state.notes.adjustScrollHash,
            scrollBeginingHash: state.notes.scrollBeginingHash,
          }
        })
      } 
    )
  }, [])

  const onScrollNext = () => {
    store.dispatch(fetchNotesThunk({
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
      scrollBeginingHash={`${context.notes.scrollBeginingHash}`}
      adjustScrollHash={`${context.notes.adjustScrollHash}`}
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