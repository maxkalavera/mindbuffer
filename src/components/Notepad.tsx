import React from "react"
import { faEllipsisH, faTrash, faPen, faPlus } from '@fortawesome/free-solid-svg-icons'

import UpdateNotepad from '@components/modals/UpdateNotepad'
import DeleteNotepad from '@components/modals/DeleteNotepad'
import { useModal } from '@providers/Modal'
import CreatePage from '@components/modals/CreatePage'
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
  const { showModal, closeModal } = useModal()

  return (
    <div className={`${className} ${styles.container}`}>
      <div className={styles.header}>
        <h4 className={`secondary-h4 ${styles.label}`}>
          { data.name }
        </h4>
        <DropdownMenu
          options={[
            {
              label: 'New Page',
              icon: faPlus,
              onClick: () => showModal(
                <CreatePage 
                  onSuccess={(payload: any) => {
  
                  }}
                  onCancel={() => closeModal()}
                />, 'New Page'
              )
            },
            {
              label: 'Edit',
              icon: faPen,
              onClick: () => showModal(
                <UpdateNotepad
                  data={data}
                  onSuccess={(payload: any) => {
  
                  }}
                  onCancel={() => closeModal()}
                />, 'Edit Notepad'
              )
            },
            {
              label: 'Delete',
              icon: faTrash,
              onClick: () => showModal(
                <DeleteNotepad 
                  onSuccess={(payload: any) => {
  
                  }}
                  onCancel={() => closeModal()}
                />, 'Delete Notepad'
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

      <div className={styles.content}>
        {
          [].map((item: any, index: number) => (
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