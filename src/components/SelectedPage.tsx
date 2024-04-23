import React from 'react'

import styles from "@styles/selected-page.module.css"

export default function SelectedPage ({
  className='',
}: {
  className?: string,
}) {
  return (
    <div 
      className={`${className} ${styles.container}`}
    >
      <h5 
        className={`secondary-h5 ${styles.notepad}`}
      >
        Work
      </h5>
      <h4
        className={`secondary-h4 ${styles.page}`}
      >
        List of pendings
      </h4>
    </div>
  )
}