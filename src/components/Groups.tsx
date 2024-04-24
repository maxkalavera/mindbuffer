import React, { useEffect, useRef, useState } from "react" 
import _ from 'lodash'
import { faLayerGroup, faPlus, faEllipsisH } from '@fortawesome/free-solid-svg-icons'

import SelectedPage from "@components/SelectedPage"
import commonsSlice from "@actions/commons.slice"
import InifiniteScroll from '@components/utils/InifiniteScroll'
import CreateNotepad from '@components/modals/CreateNotepad'
import Notepad from '@components/Notepad'
import IconButton from '@components/IconButton'
import { fetchPagesThunk } from "@actions/notepads.slice"
import { fetchNotepadsThunk } from '@actions/notepads.slice'
import { useModal } from '@providers/Modal'
import store from "@src/store"
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
      scrollEndHash: 0,
      loading: false,
      paginationMap: {} as {
        [key: number]: {
            page: number,
            hasNext: boolean;
            isLoading: boolean;
            hash: number;
        }
      }
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
        scrollEndHash: state.notepads.scrollEndHash,
        paginationMap: state.notepads.paginationMap,
        loading: state.notepads.loading,
      }),
      (state) => setContext((prev) => ({
        ...prev,
        notepads: {
          ...state.notepads,
          values: state.notepads.values,
          page: state.notepads.page,
          hasNextPage: state.notepads.hasNextPage,
          adjustScrollHash: state.notepads.adjustScrollHash,
          scrollEndHash: state.notepads.scrollEndHash,
          loading: state.notepads.loading,
          paginationMap: state.notepads.paginationMap,
        }
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

  const paginateOverScrolledOver = (elements: any[]) => {
    const forPagination = elements
    store.dispatch(fetchPagesThunk({
      notepads: forPagination,
      search: '',
    }))
  }

  return (
    <div 
      className={`${className} ${styles.container}`} 
    >
      <div
        className={`${styles.header}`}
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

      <SelectedPage 
        className={`${context.commons.isSidebarOpen ? '' : `${styles.transparent}` }`}
      />

      <InifiniteScroll
        className={`${context.commons.isSidebarOpen ? '' : styles.hide } ${styles.content}`}
        hasMore={context.notepads.hasNextPage}
        next={onScrollNext}
        loading={context.notepads.loading}
        adjustScrollHash={`${context.notepads.adjustScrollHash}`}
        scrollEndHash={`${context.notepads.scrollEndHash}`}
        scrolledOver={paginateOverScrolledOver}
        scrolledOverToID={(item) => parseInt(item.id)}
        scrolledOverHashMap={
          _.mapValues(context.notepads.paginationMap, (object: any) => object.hash)
        }
        items={
          context.notepads.values.map((item: any, key: number) => (
            <Notepad 
              id={`${item.id}`}
              key={key}
              data={item}
              loading={context.notepads.paginationMap[item.id].isLoading}
            />
          ))
        }
      />
    </div> 
  ) 
}
