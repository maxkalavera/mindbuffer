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
import type { Notepad } from "@ts/models/Notepads.types"

export default function Notepad ({
  data,
  className='',
  id='',
}: {
  data: Notepad,
  className?: string,
  id?: string,
}) {
  const { showModal } = useModal()

  return (
    <div className={`${className} ${styles.container}`}
      id={id}
    >
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
                  notepad={data}
                />, 'New Page'
              )
            },
            {
              label: 'Edit',
              icon: faPen,
              onClick: () => showModal(
                <UpdateNotepad
                  data={data}
                />, 
                'Edit Notepad'
              )
            },
            {
              label: 'Delete',
              icon: faTrash,
              onClick: () => showModal(
                <DeleteNotepad 
                  data={data}
                />, 
                'Delete Notepad'
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
          data.pages.values.map((item: any, index: number) => (
            <Page 
              key={index} 
              data={item.value} 
            />
          ))
        }
      </div>
    </div>
  )
}
