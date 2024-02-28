import { useState } from 'react'
import { faArrowRight, faMicrophone, faImage, faFile, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'

import IconButton from "@components/IconButton";
import styles from "@styles/add-note-button-carousel.module.css"

function AddNoteButtonCarousel() {
  const hasText = false;

  return (
    <div className={`${styles.container} ${!hasText ? styles['display-menu-on-hover'] : ''}`}>
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
      {
        hasText ?
          <IconButton 
            className={`${styles.button} ${styles.send}`}
            icon={faArrowRight}
          /> :
          <IconButton 
            className={styles.button}
            icon={faEllipsisVertical}
          />
      }
    </div>
  );
}

export default AddNoteButtonCarousel;