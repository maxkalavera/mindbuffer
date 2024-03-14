import React from "react"
import { faEllipsisH, faTrash } from '@fortawesome/free-solid-svg-icons'

import DropdownMenu from "@components/DropdownMenu"
import Page from '@components/Page'
import IconButton from '@components/IconButton'
import styles from '@styles/notepad.module.css'

export default function Denotepad ({
  className='',
  data={}
}: {
  className?: string,
  data: any
}) {
  return (
    <div className={`${className} ${styles.container}`}>
      <div className={styles.header}>
        <h4 className={`secondary-h4 ${styles.label}`}>
          { data.name }
        </h4>
        <DropdownMenu
          type='clickable'
          options={[
            {
              label: 'Delete',
              icon: faTrash,
              onClick: () => {

              }
            }
          ]}
        >
          <IconButton
            className={styles['options-button']}
            icon={faEllipsisH}
          />
        </DropdownMenu>
      </div>

      <div className={styles.content}>
        {
          data.pages.map((item: any, index: number) => (
            <Page 
              key={index} 
              data={item} 
            />
          ))
        }
      </div>
    </div>
  )
}