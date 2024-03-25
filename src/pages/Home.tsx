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
import { reject } from 'lodash'

function Home() {
  const resizableRef = useRef<any>(null)
  const [aperture, setAperture] = useState<number | null>(null)

  useEffect(() => {
    let controler = new AbortController()
    new Promise(async (resolve: any) => {
      const aperture = await window.electronAPI.store.sidebarAperture.get()
      if (controler.signal.aborted) 
        resolve()
      setAperture(aperture)
      resolve()
    }).then()
    return () => controler.abort()
  }, [])

  useEffect(() => {
    (async () => {
      if (aperture === null) return
      await window.electronAPI.store.sidebarAperture.set({ sidebarAperture: aperture })
    })()
  }, [aperture])

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
        <AlertBox 
          className={styles.alert} 
        />
        <div className={styles.content}>
          <Groups 
            className={styles.groups} 
            resizableRef={resizableRef}
            aperture={aperture === null ? 0.0 : aperture}
            onOpenClick={() => {
              setAperture((prevAperture) => prevAperture === 0.0 ? 1.0 : 0.0)
            }}
          />
          <VerticalDragableLine 
            resizableRef={resizableRef}
            aperture={aperture === null ? 0.0 : aperture}
            onApertureChange={setAperture}
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