import React, { useEffect, useRef, useState } from 'react'
import { Flex, Section, Container, Box, Separator } from '@radix-ui/themes';

import store from '@renderer/utils/store'
import pagesSlice, { fetchSelectedPageThunk } from '@renderer/actions/pages.slice'
import { fetchNotesThunk } from '@renderer/actions/notes.slice'
import { fetchNotepadsThunk } from '@renderer/actions/notepads.slice'
import Searchbar from '@renderer/_components/Searchbar';
import ResizableSide from '@renderer/_components/utils/ResizableSide';
/*
import ResizableSide from '@renderer/components/ResizableSide'
import Groups from '@renderer/components/Groups'
import AlertBox from '@renderer/components/AlertBox'
import NotesBoard from '@renderer/components/NotesBoard'
import AddNoteInput from '@renderer/components/AddNoteInput'
import SearchBar from '@renderer/components/SearchBar'
import styles from '@renderer/styles/home.module.css'
*/

export default function Home() {
  const [state, setState] = useState({
    sidebarInitialAperture: undefined,
  })
  const [context, setContext] = useState({
    commons: {
      search: '',
      sidebarToggleHash: undefined,
    },
    pages: {
      selectedPageID: undefined,
    }
  })

  useEffect(() => {
    store.monitor(
      (state: any) => ({
        search: state.commons.search,
        selectedPageID: state.pages.selectedPageID,
        sidebarToggleHash: state.commons.sidebarToggleHash
      }), 
      (state: any) => {
        setContext({
          commons:  {
            search: state.commons.search,
            sidebarToggleHash: state.commons.sidebarToggleHash,
          },
          pages: {
            selectedPageID: state.pages.selectedPageID
          }
        })
      }
    )
  }, [])

  useEffect(() => {
    // Fetch selected page
    let promise: any = undefined
    if (context.pages.selectedPageID === undefined) {
      const { setSelectedPage } = pagesSlice.actions
      store.dispatch(setSelectedPage({ value: undefined }))
    } else {
      store.dispatch(fetchSelectedPageThunk({
        pageID: context.pages.selectedPageID
      }))
    }
    return () => {
      promise && promise.abort()
    }
  }, [context.pages.selectedPageID])

  useEffect(() => {
    // Fetch notes
    const { search } = context.commons
    const { selectedPageID } = context.pages
    const promise = store.dispatch(fetchNotesThunk({ 
      page: 1, 
      search: search,
      pageID: selectedPageID,
    }))
    return () => {
      promise.abort()
    }
  }, [context.commons.search, context.pages.selectedPageID])

  useEffect(() => {
    // Fetch notepads
    const promise = store.dispatch(fetchNotepadsThunk({ 
      page: 1, 
      search: context.pages.selectedPageID === undefined ? context.commons.search  : ''
    }))
    return () => {
      promise.abort()
    }
  }, [context.commons.search, context.pages.selectedPageID])

  useEffect(() => {
    (async () => {
      const { setSelectedPageID } = pagesSlice.actions
      const selectedPageID = await window.electronAPI.settings.selectedPageID.get()
      store.dispatch(setSelectedPageID({ value: selectedPageID }))
    })()
  }, [])

  useEffect(() => {
    const controller = new AbortController();
    new Promise<number>(async (resolve, reject) => {
      const result = await window.electronAPI.settings.sidebarAperture.get()
      if (!controller.signal.aborted) {
        resolve(result)
      }
      reject('Sidebar aperture could not be retrived from storage')
    }).then((aperture) => {
      setState({ sidebarInitialAperture: aperture })
    })
  }, [])

  return (
    <Flex
      width='100%'
      height='100dvh'
      display='flex'
      direction='column'
      gap='0'
      justify='start'
      align='stretch'
    >
      <Section
        test-id='header'
        size='1'
      >
        <Flex
          display='flex'
          direction='row'
          gap='1'
          justify='center'
          align='center'
          px='6'
        >
          <Box
            flexGrow='1'
            maxWidth='768px'
          >
            <Searchbar />
          </Box>
        </Flex>
      </Section>
      <Separator 
        color='yellow'
        orientation='horizontal'
        size='4'
      />
      <Flex
        display='flex'
        direction='row'
        gap='0'
        justify='start'
        align='stretch'
        flexGrow='1'
      >
        <ResizableSide
          open={globals.ENVIRONMENT === 'testing' ? true : undefined}
          minWidth='64px'
          maxWidth='520px'
          sidebarToggleHash={context.commons.sidebarToggleHash}
          separator={'#'}
          initialApeture={state.sidebarInitialAperture}
          onApertureChange={(aperture) => {
            (async () => {
              await window.electronAPI.settings.sidebarAperture
              .set({ sidebarAperture: aperture })
            })()
          }}
        >
          <Box
            style={{ backgroundColor: 'red' }}
          >
            .
          </Box>
        </ResizableSide>
        <Box 
          flexGrow='1'
          style={{ backgroundColor: 'green' }}
        >
          .
        </Box>
      </Flex>
    </Flex>
  );
  /*
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <SearchBar />
      </div>
      <div className={styles['content-container']}>
        <AlertBox 
          className={styles.alert} 
        />
        <div className={styles.content}>
          <ResizableSide>
            <Groups 
              className={styles.groups}
            />
          </ResizableSide>
          <div className={styles['notes-frame']}>
            <NotesBoard 
              className={styles['notes-board']}
            />
            <AddNoteInput 
              className={styles['add-note-input']}
            />
          </div>
        </div>
      </div>
    </div>
  )
  */
}
