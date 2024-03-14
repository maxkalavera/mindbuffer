import React, { useEffect, useRef, useState } from 'react'
//import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'

import VerticalDragableLine from '@components/VerticalDragableLine'
import Groups from '@components/Groups'
import AlertBox from '@components/AlertBox'
import NotesBoard from '@components/NotesBoard'
import AddNoteInput from '@components/AddNoteInput'
import SearchBar from '@components/SearchBar'
//import IconButton from '@components/IconButton'
import styles from '@styles/home.module.css'

function Home() {
  const resizableRef = useRef<any>(null)
  const [openness, setOpenness] = useState<number>(0.0)

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
      <div className={styles['content-container']}>
        <AlertBox className={styles.alert} />
        <div className={styles.content}>
          <Groups 
            className={styles.groups} 
            resizableRef={resizableRef}
            openness={openness}
            onOpenClick={() => {
              setOpenness((prevOpenness) => prevOpenness === 0.0 ? 1.0 : 0.0)
            }}
          />
          <VerticalDragableLine 
            resizableRef={resizableRef}
            openness={openness}
            onOpenessChange={setOpenness}
          />
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