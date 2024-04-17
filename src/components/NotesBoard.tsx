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
      selectedPageID: undefined,
    },
    notes: {
      values: [],
      page: 1,
      hasNextPage: true,
      adjustScrollHash: 0,
      scrollBeginingHash: 0,
      loading: false,
    }
  })

  useEffect(() => {
    store.monitor(
      (state) => ({
        commons: { 
          search: state.commons.search,
          selectedPageID: state.commons.selectedPageID,
        },
        notes: {
          values: state.notes.values,
          page: state.notes.page,
          hasNextPage: state.notes.hasNextPage,
          adjustScrollHash: state.notes.adjustScrollHash,
          scrollBeginingHash: state.notes.scrollBeginingHash,
          loading: state.notes.loading
        }
      }),
      (state) => {
        setContext({
          commons: { 
            search: state.commons.search,
            selectedPageID: state.commons.selectedPageID
          },
          notes: {
            values: state.notes.values,
            page: state.notes.page,
            hasNextPage: state.notes.hasNextPage,
            adjustScrollHash: state.notes.adjustScrollHash,
            scrollBeginingHash: state.notes.scrollBeginingHash,
            loading: state.notes.loading
          }
        })
      } 
    )
  }, [])

  const onScrollNext = () => {
    store.dispatch(fetchNotesThunk({
      page: context.notes.page + 1,
      search: context.commons.search,
      pageID: context.commons.selectedPageID,
    }))   
  }

  return (
    <InifiniteScroll
      className={`${styles.container} ${className}`}
      hasMore={context.notes.hasNextPage}
      inverse={true}
      loading={context.notes.loading}
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