import React, { useEffect, useState } from "react" 
import { faLayerGroup, faPlus, faEllipsisH } from '@fortawesome/free-solid-svg-icons'

import CreateNotepad from '@components/modals/CreateNotepad'
import { useContext } from "@providers/Context"
import { useModal } from '@providers/Modal'
import Notepad from '@components/Notepad'
import IconButton from '@components/IconButton'
import styles from "@styles/groups.module.css" 

import type { NotepadPayload } from "@ts/models/Notepads.types"

export default function Groups({ 
  className='', 
  aperture=0.0,
  resizableRef=null,
  onOpenClick=()=>null
}: { 
  className?: string,
  aperture?: number,
  onOpenClick?: () => any
  resizableRef?: React.MutableRefObject<any> 
}) {
  const { showModal, closeModal } = useModal()
  const { notepads } = useContext()

  const createNotepad = (payload: { data: NotepadPayload }) => {
    (async () => {
      const notepad = await window.electronAPI.notepads.create(payload)
      if (notepad === undefined) return
      notepads.add({ values: [notepad]})
      closeModal()
    })()
  }

  return (
    <div 
      className={`${className} ${styles.container}`} 
      ref={resizableRef} >
        <div
          className={styles.header}
        >
          <IconButton
            className={styles['show-frame-button']}
            icon={faLayerGroup}
            onClick={onOpenClick}
          />
          <h4 
            className={`secondary-h4 ${styles['header-title']}`}
          >
            Notepads / Pages
          </h4>
          <IconButton
            className={styles['add-button']} 
            icon={faPlus}
            onClick={() => showModal(
              <CreateNotepad 
                onSuccess={createNotepad}
                onCancel={() => closeModal()}
              />, 'New Notepad'
            )}
          />
        </div>

        <div 
          className={`${aperture === 0.0 ? styles.hide : null} ${styles.content}`}
        >
          {
            notepads.values.map((item: any, key: number) => (
              <Notepad 
                key={key}
                data={item} 
              />
            ))
          }
         </div>
    </div> 
  ) 
} 
