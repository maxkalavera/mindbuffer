import React, { useEffect, useState } from "react" 
import { faLayerGroup, faPlus, faEllipsisH } from '@fortawesome/free-solid-svg-icons'

import { fetchNotepadsThunk } from '@actions/notepads.slice'
import commonsSlice from "@actions/commons.slice"
import store from "@src/store"
import InifiniteScroll from '@components/utils/InifiniteScroll'
import CreateNotepad from '@components/modals/CreateNotepad'
import { useModal } from '@providers/Modal'
import Notepad from '@components/Notepad'
import IconButton from '@components/IconButton'
import styles from "@styles/groups.module.css" 

export default function Groups({ 
  className='',
}: { 
  className?: string,
}) {
  const [context, setContext] = useState({
    commons: {
      isSidebarOpen: true,
      search: '',
    },
    notepads: {
      values: [],
      page: 1,
      hasNextPage: true,
      adjustScrollHash: 0,
      scrollBeginingHash: 0,
    }
  })
  const { showModal } = useModal()

  useEffect(() => {
    store.monitor(
      (state) => ({
        isSidebarOpen: state.commons.isSidebarOpen,
        search: state.commons.search,
      }),
      (state) => setContext((prev) => ({
        ...prev,
        commons: {
          isSidebarOpen: state.commons.isSidebarOpen,
          search: state.commons.search,
        }
      }))
    )
  }, [])

  useEffect(() => {
    store.monitor(
      (state) => ({
        values: state.notepads.values,
        page: state.notepads.values,
        hasNextPage: state.notepads.hasNextPage,
        adjustScrollHash: state.notes.adjustScrollHash,
        scrollBeginingHash: state.notes.scrollBeginingHash,
      }),
      (state) => setContext((prev) => ({
        ...prev,
        notepads: state.notepads
      }))
    )
  })

  const toggleIsSidebarOpen = () => {
    const { mutateSidebarToggleHash } = commonsSlice.actions
    store.dispatch(mutateSidebarToggleHash())
  }

  const onScrollNext = () => {
    store.dispatch(fetchNotepadsThunk({
      page: context.notepads.page + 1,
      search: context.commons.search,
    }))   
  }

  return (
    <div 
      className={`${className} ${styles.container}`} 
    >
      <div
        className={styles.header}
      >
        <IconButton
          className={styles['show-frame-button']}
          icon={faLayerGroup}
          onClick={toggleIsSidebarOpen}
        />
        <h4 
          className={`secondary-h4 ${styles['header-title']}`}
        >
          Notepads / Pages
        </h4>
        <IconButton
          className={styles['add-button']} 
          icon={faPlus}
          onClick={() => showModal(
            <CreateNotepad />, 
            'New Notepad'
          )}
        />
      </div>

      <InifiniteScroll
        className={`${context.commons.isSidebarOpen ? null : styles.hide } ${styles.content}`}
        hasMore={false}
        next={onScrollNext}
        scrollBeginingHash={`${context.notepads.scrollBeginingHash}`}
        adjustScrollHash={`${context.notepads.adjustScrollHash}`}
        scrolledOver={(elements) => {
          //console.log('SCROLLED OVER', elements.map((item) => item.id))
          /*
          actions.models.pages.increasePagination({
            values:  elements.map((item) => ({
              id: parseInt(item.id)
            }))
          })
          */
        }}
        items={
          context.notepads.values.map((item: any, key: number) => (
            <Notepad 
              id={`${item.id}`}
              key={key}
              data={item} 
            />
          ))
        }
      />
    </div> 
  ) 
}
