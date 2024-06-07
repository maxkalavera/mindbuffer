import React, { useEffect, useRef, useState } from 'react'

import store from '@renderer/utils/store'
import pagesSlice, { fetchSelectedPageThunk } from '@renderer/actions/pages.slice'
import { fetchNotesThunk } from '@renderer/actions/notes.slice'
import { fetchNotepadsThunk } from '@renderer/actions/notepads.slice'
import ResizableSide from '@renderer/components/ResizableSide'
import Groups from '@renderer/components/Groups'
import AlertBox from '@renderer/components/AlertBox'
import NotesBoard from '@renderer/components/NotesBoard'
import AddNoteInput from '@renderer/components/AddNoteInput'
import SearchBar from '@renderer/components/SearchBar'
import styles from '@renderer/styles/home.module.css'

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
      (state: any) => ({
        search: state.commons.search,
        selectedPageID: state.pages.selectedPageID
      }), 
      (state: any) => {
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
    // Fetch selected page
    let promise: any = undefined
    if (context.pages.selectedPageID === undefined) {
      const { setSelectedPage } = pagesSlice.actions
      store.dispatch(setSelectedPage({ value: undefined }))
    } else {
      store.dispatch(fetchSelectedPageThunk({
        pageID: context.pages.selectedPageID
      }))
    }
    return () => {
      promise && promise.abort()
    }
  }, [context.pages.selectedPageID])

  useEffect(() => {
    // Fetch notes
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
    // Fetch notepads
    const promise = store.dispatch(fetchNotepadsThunk({ 
      page: 1, 
      search: context.pages.selectedPageID === undefined ? context.commons.search  : ''
    }))
    return () => {
      promise.abort()
    }
  }, [context.commons.search, context.pages.selectedPageID])

  useEffect(() => {
    (async () => {
      const { setSelectedPageID } = pagesSlice.actions
      const selectedPageID = await window.electronAPI.settings.selectedPageID.get()
      store.dispatch(setSelectedPageID({ value: selectedPageID }))
    })()
  }, [])

  return (
    <div      
      className="
        bg-zinc-950
        size-full
        flex flex-col justify-stretch items-stretch
      "
    >
      <div
        data-testid='header'
        className="
          h-12 px-4
          flex flex-row gap-4 justify-center items-center
        "
      >
        <SearchBar />
      </div>
      <div
          data-testid='content'
          className="
            bg-brown-200
            min-h-0
            grow shrink basis-auto 
            flex flex-row justiry-start items-stretch
          "
        >
          <div 
            data-testid='left'
            className="
              flex flex-col justify-start items-stretch
            "
          >
            <div 
              data-testid='divider' 
              className="
                bg-amber-500/[0.15]
                h-6
              " 
            />
            <Groups 
              className="
                bg-amber-500/[0.15]
                min-w-0 px-4
                grow shrink basis-auto
              "
            />
          </div>
          <div
            data-testid='right'
            className="
              min-w-0
              grow shrink basis-auto
              flex flex-col
            "
          >
            <div 
              data-testid='divider' 
              className="w-full h-6 bg-amber-500/[0.15]" 
            />
            <NotesBoard 
              className="
                px-4
              "
            />
            <AddNoteInput 
              className="
                px-4
              "
            />
          </div>
        </div>
    </div>
  );
  /*
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
  */
}
