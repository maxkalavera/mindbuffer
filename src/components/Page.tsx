import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import IconButton from '@components/IconButton'

import styles from "@styles/page.module.css"

function Page({
  name='',
  count=0,
}) {
  return (
    <div className={styles.container}>
      <h4 className={`secondary-h4 ${styles.label}`}>{name}</h4>
      <div className={styles.options}>
        <div className={styles.badge}>
          <h4 className={`secondary-h4 ${styles['badge-label']}`}>
            {count}
          </h4>
        </div>
        <IconButton 
          icon={faEllipsisVertical}
        />
      </div>
    </div>
  );
}

export default Page;