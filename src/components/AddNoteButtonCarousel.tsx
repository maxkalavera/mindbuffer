import { faArrowRight, faMicrophone, faImage, faFile, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'

import IconButton from "@components/IconButton"
import styles from "@styles/add-note-button-carousel.module.css"

function AddNoteButtonCarousel({
  isSaveActive=false,
  onSave=()=>null
}: {
  isSaveActive?: boolean
  onSave?: () => void
}) {
  return (
    <div className={`${styles.container} ${!isSaveActive ? styles['display-menu-on-hover'] : ''}`}>
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
        isSaveActive ?
          <IconButton 
            className={`${styles.button} ${styles.save}`}
            icon={faArrowRight}
            onClick={onSave}
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