import React, { useState, useEffect } from 'react'
import { faEllipsisH, faTrash, faPen } from '@fortawesome/free-solid-svg-icons'

import { setSelectedPageIDThunk } from '@actions/pages.slice'
import pagesSlice from '@actions/pages.slice'
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
        selectedPageID: state.pages.selectedPageID
      }), 
      (state) => {
        setContext({
          selectedPageID: state.pages.selectedPageID
        })
      }
    )
  }, [])

  const onPageSelected = () => {
    store.dispatch(setSelectedPageIDThunk({
      value: context.selectedPageID !== data.id ? 
        data.id :
        undefined
    }))
  }

  const isSelected = context.selectedPageID === data.id
  return (
    <div className={`${className} ${styles.container} ${isSelected ? styles.container__selected : null}`}>
        <div className={styles['vertical-line']}></div>
        <p 
          className={`secondary-p ${styles.label}`}
          onClick={onPageSelected}
        >
          { data.name }
        </p>
        <DropdownMenu
          className={__ENVIRONMENT__ === 'testing' ? 'class:b26dec9002c64d349cf9d449394b6c33' : ''}
          options={[
            {
              label: 'Edit',
              icon: faPen,
              className: __ENVIRONMENT__ === 'testing' ? 'class:85850df7af5542a5951cf31d9b8c4a2d' : '',
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
              className: __ENVIRONMENT__ === 'testing' ? 'class:b97c8ab4fd60487289b6523663e34c92' : '',
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