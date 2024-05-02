import { faArrowRight, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'

import settings from '@utils/settings'
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
            id={__ENVIRONMENT__ === 'testing' ? 'id:create-note-button:j2OnOhuazV' : ''}
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