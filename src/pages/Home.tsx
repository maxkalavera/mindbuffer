import { useEffect, useState } from 'react'
//import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'

import AlertBox from '@components/AlertBox'
import NotesBoard from '@components/NotesBoard'
import AddNoteInput from '@components/AddNoteInput'
import Pages from '@components/Pages'
import SearchBar from '@components/SearchBar'
//import IconButton from '@components/IconButton'
import styles from '@styles/home.module.css'

function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <SearchBar />
        { /*
          <IconButton 
            icon={faEllipsisVertical}
          />
        */ }
      </div>
      <div className={styles.content}>
        { /*
          <div className={styles.pages}>
            <Pages />
          </div>
        */ }
        <div className={styles['notes-frame-container']}>
        <AlertBox />
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

export default function HomeWrapper () {
  return (
    <Home />
  )
}