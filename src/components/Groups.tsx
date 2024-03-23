import React, { useEffect, useState } from "react" 
import { faLayerGroup, faPlus, faEllipsisH } from '@fortawesome/free-solid-svg-icons'

import CreateNotepad from '@components/modals/CreateNotepad'
import { useContext } from "@providers/Context"
import { useModal } from '@providers/Modal'
import Notepad from '@components/Notepad'
import IconButton from '@components/IconButton'
import styles from "@styles/groups.module.css" 

export default function Groups({ 
  className='', 
  openness=0.0,
  resizableRef=null,
  onOpenClick=()=>null
}: { 
  className?: string,
  openness?: number,
  onOpenClick?: () => any
  resizableRef?: React.MutableRefObject<any> 
}) {
  const { showModal, closeModal } = useModal()
  const { notepads } = useContext()

  useEffect(() => {
    //dispatch({ type: 'notepads/getAll' })
  }, [])

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
                onSuccess={(payload: any) => {

                }}
                onCancel={() => closeModal()}
              />, 'New Notepad'
            )}
          />
        </div>

        <div 
          className={`${openness === 0.0 ? styles.hide : null} ${styles.content}`}
        >
          {
            notepads.values.map((item: any, key: number) => (
              <Notepad 
                key={key}
                data={item.dataValues} 
              />
            ))
          }
         </div>
    </div> 
  ) 
} 
