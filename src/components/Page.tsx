import React, { useState, useEffect, useLayoutEffect } from 'react'
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
        __ENVIRONMENT__ === 'testing' ? 'class:page:8o3bzP8yoT' : ''
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
          className={__ENVIRONMENT__ === 'testing' ? 'class:page-options-button:WvlSIUCzRC' : ''}
          options={[
            {
              label: 'Edit',
              icon: faPen,
              className: __ENVIRONMENT__ === 'testing' ? 'class:page-options-edit-button:1bWdLl8T87' : '',
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
              className: __ENVIRONMENT__ === 'testing' ? 'class:page-options-delete-button:excgDO3li2' : '',
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