import React from 'react'
import { faArrowRight, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'

import IconButton from "@renderer/components/IconButton"
import styles from "@renderer/styles/add-note-button-carousel.module.css"

function AddNoteButtonCarousel({
  isSaveActive=false,
  onSave=()=>null
}: {
  isSaveActive?: boolean
  onSave?: () => void
}) {
  return (
    <div className={`${styles.container} ${!isSaveActive ? styles['display-menu-on-hover'] : ''}`}>
      {/*
      <IconButton 
        className={styles.button}
        icon={faFile}
      />
      <IconButton 
        className={styles.button}
        icon={faImage}
      />
      <IconButton 
        className={styles.button}
        icon={faMicrophone}
      />
      */}
      {
        isSaveActive ?
          <IconButton 
            id={globals.ENVIRONMENT === 'testing' ? 'id:create-note-button:j2OnOhuazV' : ''}
            className={`${styles.button} ${styles.save}`}
            icon={faArrowRight}
            onClick={onSave}
          /> :
          <IconButton 
            disabled={true}
            className={styles.button}
            icon={faEllipsisVertical}
          />
      }
    </div>
  );
}

export default AddNoteButtonCarousel;