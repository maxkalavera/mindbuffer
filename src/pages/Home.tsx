import { useState } from 'react'
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'

import NoteGallery from '@components/NoteGallery'
import AddNoteInput from '@components/AddNoteInput'
import Pages from '@components/Pages'
import SearchBar from '@components/SearchBar'
import IconButton from '@components/IconButton'
import styles from '@styles/home.module.css'

function Home() {
  const [searchTerm, setSearchTerm] = useState('')
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <SearchBar
          value={searchTerm}
          onChange={(value) => setSearchTerm(value)}
        />
        <IconButton 
          icon={faEllipsisVertical}
        />
      </div>
      <div className={styles.content}>
        <div className={styles.pages}>
          <Pages />
        </div>
        <div className={styles['notes-frame']}>
          <NoteGallery />
          <AddNoteInput />
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