import React, { useState, useEffect } from 'react'
import { faEllipsisH, faTrash, faPen } from '@fortawesome/free-solid-svg-icons'

import commonsSlice from '@src/actions/commons.slice'
import store from '@src/store'
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
  const { showModal } = useModal()
  const [context, setContext] = useState({
    selectedPageID: undefined,
  })

  useEffect(() => {
    store.monitor(
      (state) => ({
        selectedPageID: state.commons.selectedPageID
      }), 
      (state) => {
        setContext({
          selectedPageID: state.commons.selectedPageID
        })
      }
    )
  }, [])

  const onPageSelected = () => {
    const { setSelectedPageID } = commonsSlice.actions
    store.dispatch(setSelectedPageID({
      value: context.selectedPageID !== data.id ? 
        data.id :
        undefined
    }))
  }

  return (
    <div className={`${className} ${styles.container}`}>
        <div className={styles['vertical-line']}></div>
        <p 
          className={`secondary-p ${styles.label}`}
          onClick={onPageSelected}
        >
          { data.name }
        </p>
        <DropdownMenu
          options={[
            {
              label: 'Edit',
              icon: faPen,
              onClick: () => showModal(
                <UpdatePage
                  value={data}
                />, 
                'Edit Page'
              )
            },
            {
              label: 'Delete',
              icon: faTrash,
              onClick: () => showModal(
                <DeletePage 
                  value={data}
                />, 
                'Delete Page'
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