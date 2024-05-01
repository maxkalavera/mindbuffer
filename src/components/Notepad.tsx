import React from "react"
import { faEllipsisH, faTrash, faPen, faPlus } from '@fortawesome/free-solid-svg-icons'

import ElipsisSpinner from "@src/components/spinners/ElipsisSpinner"
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
      className={`${className} ${styles.container}`}
      id={id}
    >
      <div className={styles.header}>
        <h4 className={`secondary-h4 ${styles.label}`}>
          { data.name } 
        </h4>
        <DropdownMenu
          className={__ENVIRONMENT__ === 'testing' ? 'class:1111038c21384acd8519b8b0de8ee56f' : ''}
          options={[
            {
              label: 'New Page',
              icon: faPlus,
              className: __ENVIRONMENT__ === 'testing' ? 'class:abe3cef1d3f74a02891a715fa2316b07' : '',
              onClick: () => showModal(
                <CreatePage 
                  notepad={data}
                />, 'New Page'
              )
            },
            {
              label: 'Edit',
              icon: faPen,
              className: __ENVIRONMENT__ === 'testing' ? 'class:6fa0c084fc5747cf9c9ae554788c5c14' : '',
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
              className: __ENVIRONMENT__ === 'testing' ? 'class:dcf43c19345a4a4590b5a5b971e2d439' : '',
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
          data.pages.map((item: any, index: number) => (
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
