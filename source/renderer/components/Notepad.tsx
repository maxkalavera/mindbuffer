import React from "react"
import { faEllipsisH, faTrash, faPen, faPlus } from '@fortawesome/free-solid-svg-icons'

import ElipsisSpinner from "@renderer/components/spinners/ElipsisSpinner"
import UpdateNotepad from '@renderer/components/modals/UpdateNotepad'
import DeleteNotepad from '@renderer/components/modals/DeleteNotepad'
import { useModal } from '@renderer/providers/Modal'
import CreatePage from '@renderer/components/modals/CreatePage'
import DropdownMenu from "@renderer/components/DropdownMenu"
import Page from '@renderer/components/Page'
import IconButton from '@renderer/components/IconButton'
import styles from '@renderer/styles/notepad.module.css'
import type { Notepad } from "@commons/ts/models/Notepads.types"

export default function Notepad ({
  data,
  className='',
  id='',
  loading=false,
}: {
  data: Notepad,
  className?: string,
  id?: string,
  loading?: boolean,
}) {
  const { showModal } = useModal()

  return (
    <div 
      className={[
        className,
        styles.container,
        globals.ENVIRONMENT === 'testing' ? 'class:notepad:8iwbWkd5Y1' : ''
      ].join(' ')}
      id={id}
    >
      <div className={styles.header}>
        <h4 className={`secondary-h4 ${styles.label}`}>
          { data.name } 
        </h4>
        <DropdownMenu
          className={globals.ENVIRONMENT === 'testing' ? 'class:notepad-options-button:GrWzrbooC9' : ''}
          options={[
            {
              label: 'New Page',
              icon: faPlus,
              className: globals.ENVIRONMENT === 'testing' ? 'class:notepad-options-create-page-button:LLAk9dX9bP' : '',
              onClick: () => showModal(
                <CreatePage 
                  notepad={data}
                />, 'New Page'
              )
            },
            {
              label: 'Edit',
              icon: faPen,
              className: globals.ENVIRONMENT === 'testing' ? 'class:notepad-options-edit-button:OJSSF5T46S' : '',
              onClick: () => showModal(
                <UpdateNotepad
                  value={data}
                />, 
                'Edit Notepad'
              )
            },
            {
              label: 'Delete',
              icon: faTrash,
              className: globals.ENVIRONMENT === 'testing' ? 'class:notepad-options-delete-button:r6ukcuDrQL' : '',
              onClick: () => showModal(
                <DeleteNotepad 
                  value={data}
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
          (data.pages ? data.pages : []).map((item: any, index: number) => (
            <Page 
              key={index} 
              data={item} 
            />
          ))
        }
        {
          loading ? 
          (
            <div className={styles['loader-row']}>
              <ElipsisSpinner />
            </div>
          ) : 
          null
        }
      </div>
    </div>
  )
}
