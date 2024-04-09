import React, { useEffect, useRef, useState } from 'react'

import store from '@src/store'
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

  useEffect(() => {
    const promise = store.dispatch(fetchNotesThunk({ page: 1, search: '' }))
    return () => {
      promise.abort()
    }
  }, [])

  useEffect(() => {
    const promise = store.dispatch(fetchNotepadsThunk({ page: 1, search: '' }))
    return () => {
      promise.abort()
    }
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
