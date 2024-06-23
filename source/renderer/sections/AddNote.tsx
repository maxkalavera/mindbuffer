import React, { useEffect, useState, useRef } from 'react'
import { Box, Flex, IconButton, TextArea } from '@radix-ui/themes'
import { ArrowRightIcon } from '@radix-ui/react-icons'

import store from "@renderer/utils/redux-store"
import { createNoteThunk } from "@renderer/actions/notes.slice"

import type { FlexProps  } from '@radix-ui/themes'

/* @ts-ignore */
const PLATFORM = navigator.userAgentData.platform

function AddNote ({
  onFocusChange=undefined,
  ...flexProps
}: FlexProps & {
  onFocusChange?: (value: boolean) => void
}) {
  const [state, setState] = useState({
    inputValue: '',
  })
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

  const createNote = async () => {
    if (state.inputValue.trim() === '') return

    store.dispatch(createNoteThunk({
      content: state.inputValue,
      pageID: context.selectedPageID || null,
    })).then(() => {
      // Show success
    })
    setState({ inputValue: '' })

  }

  // Listens to keyboard comands to send input
  // --------------------------------------------------------------------------
  const platformKey = (PLATFORM === 'macOS' ? 'Meta' : 'Control')
  const keyMap = useRef<{[key: string]: boolean}>({
    [platformKey]: false,
    'Enter': false,
  })
  const onKeyDown = (event: any) => {
    if (event.key in keyMap.current)
      keyMap.current[event.key] = true

    if (Object.values(keyMap.current).every((item) => item)) {
      createNote()
      Object.keys(keyMap.current).forEach((key) => keyMap.current[key] = false)
    }
  }
  
  const onKeyUp = (event: any) => {
    if (event.key in keyMap.current)
      keyMap.current[event.key] = false
  }

  return (
    <Flex
      direction='row'
      gap='2'
      justify='end'
      align='center'
      {...flexProps}
    >
      <Box flexGrow='1'>
        <TextArea
          size='1'
          value={state.inputValue}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp} 
          onChange={(event) => setState({ inputValue: event.target.value })}
          onFocus={() => onFocusChange(true)}
          onBlur={() => onFocusChange(false)}
        />
      </Box>
      <Box>
        <IconButton
          data-radius='full'
          size='2'
          disabled={state.inputValue.trim() === ''}
          onClick={createNote}
        >
          <ArrowRightIcon width='18' height='18' />
        </IconButton>
      </Box>

    </Flex>
  )
}

export default AddNote