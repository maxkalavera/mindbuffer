import React, { useState, useEffect, useLayoutEffect } from 'react'
import { faEllipsisH, faTrash, faPen } from '@fortawesome/free-solid-svg-icons'

import { setSelectedPageIDThunk } from '@renderer/actions/pages.slice'
import store from '@renderer/utils/store'
import { useModal } from '@renderer/providers/Modal'
import UpdatePage from '@renderer/components/modals/UpdatePage'
import DeletePage from '@renderer/components/modals/DeletePage'
import DropdownMenu from "@renderer/components/DropdownMenu"
import IconButton from '@renderer/components/IconButton'
import styles from '@renderer/styles/page.module.css'

import type { Page } from '@commons/ts/models/Pages.types'

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

  useLayoutEffect(() => {
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

  useEffect(() => {
    const { pages: { selectedPageID } } = store.getState()
    setContext({ selectedPageID: selectedPageID })
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
    <div 
      className={[
        className,
        styles.container,
        isSelected ? styles.container__selected : '',
        globals.ENVIRONMENT === 'testing' ? 'class:page:8o3bzP8yoT' : ''
      ].join(' ')}
    >
        <div className={styles['vertical-line']}></div>
        <p 
          className={`secondary-p ${styles.label}`}
          onClick={onPageSelected}
        >
          { data.name }
        </p>
        <DropdownMenu
          className={globals.ENVIRONMENT === 'testing' ? 'class:page-options-button:WvlSIUCzRC' : ''}
          options={[
            {
              label: 'Edit',
              icon: faPen,
              className: globals.ENVIRONMENT === 'testing' ? 'class:page-options-edit-button:1bWdLl8T87' : '',
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
              className: globals.ENVIRONMENT === 'testing' ? 'class:page-options-delete-button:excgDO3li2' : '',
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