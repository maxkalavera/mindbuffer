import React, { useEffect, useRef, useState } from 'react'

import store from '@src/store'
import pagesSlice, { fetchSelectedPageThunk } from '@src/actions/pages.slice'
import { fetchNotesThunk } from '@actions/notes.slice'
import { fetchNotepadsThunk } from '@actions/notepads.slice'
import ResizableSide from '@components/ResizableSide'
import Groups from '@components/Groups'
import AlertBox from '@components/AlertBox'
import NotesBoard from '@components/NotesBoard'
import AddNoteInput from '@components/AddNoteInput'
import SearchBar from '@components/SearchBar'
import styles from '@styles/home.module.css'

export default function Home() {
  const [context, setContext] = useState({
    commons: {
      search: '',
    },
    pages: {
      selectedPageID: undefined,
    }
  })

  useEffect(() => {
    store.monitor(
      (state) => ({
        search: state.commons.search,
        selectedPageID: state.pages.selectedPageID
      }), 
      (state) => {
        setContext({
          commons:  {
            search: state.commons.search,
          },
          pages: {
            selectedPageID: state.pages.selectedPageID
          }
        })
      }
    )
  }, [])

  useEffect(() => {
    const { search } = context.commons
    const { selectedPageID } = context.pages
    const promise = store.dispatch(fetchNotesThunk({ 
      page: 1, 
      search: search,
      pageID: selectedPageID,
    }))
    return () => {
      promise.abort()
    }
  }, [context.commons.search, context.pages.selectedPageID])

  useEffect(() => {
    if (context.pages.selectedPageID === undefined) {
      const { setSelectedPage } = pagesSlice.actions
      store.dispatch(setSelectedPage({ value: undefined }))
      return
    }
    const promise = store.dispatch(fetchSelectedPageThunk({
      pageID: context.pages.selectedPageID
    }))
    return () => {
      promise.abort()
    }
  }, [context.pages.selectedPageID])

  useEffect(() => {
    const promise = store.dispatch(fetchNotepadsThunk({ 
      page: 1, 
      search: context.commons.search 
    }))
    return () => {
      promise.abort()
    }
  }, [context.commons.search])

  useEffect(() => {
    const promise = store.dispatch(fetchNotepadsThunk({ 
      page: 1, 
      search: context.commons.search 
    }))
    return () => {
      promise.abort()
    }
  }, [context.commons.search])

  useEffect(() => {
    (async () => {
      const { setSelectedPageID } = pagesSlice.actions
      const selectedPageID = await window.electronAPI.settings.selectedPageID.get()
      store.dispatch(setSelectedPageID({ value: selectedPageID }))
    })()
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <SearchBar />
      </div>
      <div className={styles['content-container']}>
        <AlertBox 
          className={styles.alert} 
        />
        <div className={styles.content}>
          <ResizableSide>
            <Groups 
              className={styles.groups}
            />
          </ResizableSide>
          <div className={styles['notes-frame']}>
            <NotesBoard 
              className={styles['notes-board']}
            />
            <AddNoteInput 
              className={styles['add-note-input']}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
