import React from "react"
import { faEllipsisH, faTrash, faPen, faPlus } from '@fortawesome/free-solid-svg-icons'

import { useContext } from "@providers/Context"
import UpdateNotepad from '@components/modals/UpdateNotepad'
import DeleteNotepad from '@components/modals/DeleteNotepad'
import { useModal } from '@providers/Modal'
import CreatePage from '@components/modals/CreatePage'
import DropdownMenu from "@components/DropdownMenu"
import Page from '@components/Page'
import IconButton from '@components/IconButton'
import styles from '@styles/notepad.module.css'

import type { Notepad, NotepadID } from "@ts/models/Notepads.types"

export default function Notepad ({
  data,
  className='',
}: {
  data: Notepad,
  className?: string,
}) {
  const { notepads } = useContext()
  const { showModal, closeModal } = useModal()

  const updateNotepad = (payload: { value: Notepad }) => {
    window.electronAPI.notepads.update(payload)
    notepads.update(payload)
    closeModal()
  }

  const destroyNotepad = (payload: { id: NotepadID}) => {
    window.electronAPI.notepads.destroy(payload)
    notepads.destroy(payload)
    closeModal()
  }

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
                  onSuccess={updateNotepad}
                  onCancel={() => closeModal()}
                />, 'Edit Notepad'
              )
            },
            {
              label: 'Delete',
              icon: faTrash,
              onClick: () => showModal(
                <DeleteNotepad 
                  onSuccess={() => destroyNotepad({ id: data.id })}
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