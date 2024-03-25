import React from 'react'
import { faEllipsisH, faTrash, faPen } from '@fortawesome/free-solid-svg-icons'

import { useModal } from '@providers/Modal'
import UpdatePage from '@components/modals/UpdatePage'
import DeletePage from '@components/modals/DeletePage'
import DropdownMenu from "@components/DropdownMenu"
import IconButton from '@components/IconButton'
import styles from '@styles/page.module.css'

import type { Page } from '@ts/models/Pages.types'

export default function Page ({
  data,
  className='',
}: {
  data: Page,
  className?: string,
}) {
  const { showModal, closeModal } = useModal()

  return (
    <div className={`${className} ${styles.container}`}>
        <div className={styles['vertical-line']}></div>
        <p className={`secondary-p ${styles.label}`}>
          { data.name }
        </p>
        <DropdownMenu
          options={[
            {
              label: 'Edit',
              icon: faPen,
              onClick: () => showModal(
                <UpdatePage
                  data={data}
                  onSuccess={(payload: any) => {
                    closeModal()
                  }}
                  onCancel={() => closeModal()}
                />, 'Edit Page'
              )
            },
            {
              label: 'Delete',
              icon: faTrash,
              onClick: () => showModal(
                <DeletePage 
                  onSuccess={(payload: any) => {
  
                  }}
                  onCancel={() => closeModal()}
                />, 'Delete Page'
              )
            }
          ]}
        >
          <IconButton
            className={styles['options-button']}
            icon={faEllipsisH}
          />
        </DropdownMenu>
    </div>
  )
}