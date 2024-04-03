import React, { useEffect, useState } from "react" 
import { faLayerGroup, faPlus, faEllipsisH } from '@fortawesome/free-solid-svg-icons'

import InifiniteScroll from '@components/utils/InifiniteScroll'
import CreateNotepad from '@components/modals/CreateNotepad'
import { useContext } from "@providers/Context"
import { useModal } from '@providers/Modal'
import Notepad from '@components/Notepad'
import IconButton from '@components/IconButton'
import styles from "@styles/groups.module.css" 

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
  const { showModal } = useModal()
  const { state, actions } = useContext()

  return (
    <div 
      className={`${className} ${styles.container}`} 
      ref={resizableRef} 
    >
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
            <CreateNotepad />, 
            'New Notepad'
          )}
        />
      </div>

      <InifiniteScroll
        className={`${aperture === 0.0 ? styles.hide : null} ${styles.content}`}
        hasMore={false}
        next={() => {
          actions.models.notepads.increasePagination()
        }}
        scrolledOver={(elements) => {
          //console.log('SCROLLED OVER', elements.map((item) => item.id))
          actions.models.pages.increasePagination({
            values:  elements.map((item) => ({
              id: parseInt(item.id)
            }))
          })
        }}
        items={
          state.models.notepads.values.map((item: any, key: number) => (
            <Notepad 
              id={`${item.id}`}
              key={key}
              data={item} 
            />
          ))
        }
      />
    </div> 
  ) 
}
