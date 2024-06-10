import React, { useEffect, useState } from 'react'

import store from '@renderer/utils/store'
import { fetchNotesThunk } from '@renderer/actions/notes.slice'
import InifiniteScroll from '@renderer/components/utils/InifiniteScroll'
import TextNote from "@renderer/components/TextNote"
import styles from "@renderer/styles/notes-board.module.css"

import { Note } from '@commons/ts/models/Notes.types'

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
      loading: false,
    },
    pages: {
      selectedPageID: undefined,
    }
  })

  useEffect(() => {
    store.monitor(
      (state) => ({
        commons: { 
          search: state.commons.search,
        },
        notes: {
          values: state.notes.values,
          page: state.notes.page,
          hasNextPage: state.notes.hasNextPage,
          adjustScrollHash: state.notes.adjustScrollHash,
          scrollBeginingHash: state.notes.scrollBeginingHash,
          loading: state.notes.loading
        },
        pages: {
          selectedPageID: state.pages.selectedPageID,
        }
      }),
      (state) => {
        setContext({
          commons: { 
            search: state.commons.search,
          },
          notes: {
            values: state.notes.values,
            page: state.notes.page,
            hasNextPage: state.notes.hasNextPage,
            adjustScrollHash: state.notes.adjustScrollHash,
            scrollBeginingHash: state.notes.scrollBeginingHash,
            loading: state.notes.loading
          },
          pages: {
            selectedPageID: state.pages.selectedPageID
          }
        })
      } 
    )
  }, [])

  const onScrollNext = () => {
    store.dispatch(fetchNotesThunk({
      page: context.notes.page + 1,
      search: context.commons.search,
      pageID: context.pages.selectedPageID,
    }))   
  }

  return (
    <InifiniteScroll
      id={globals.ENVIRONMENT === 'testing' ? 'id:notes-board:Y8FAln8HKV' : ''}
      className={`${className} ${styles.container}`}
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
            className={[
              styles.textnote,
            ].join(' ')}
          />
        ))
      }
    />
  )
}

export default NotesBoard;