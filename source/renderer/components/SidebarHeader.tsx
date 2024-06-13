import React from 'react'
import { Box, Flex, Heading, IconButton } from '@radix-ui/themes'
import { LayersIcon, PlusIcon } from '@radix-ui/react-icons'

import store from '@renderer/utils/store'
import commonsSlice from '@renderer/actions/commons.slice'
import CreateNotepad from '@renderer/dialogs/CreateNotepad'

import type { FlexProps } from '@radix-ui/themes'

function SidebarHeader(props: FlexProps) {

  const toggleIsSidebarOpen = () => {
    const { mutateSidebarToggleHash } = commonsSlice.actions
    store.dispatch(mutateSidebarToggleHash())
  }

  return (
    <Flex
      p='2'
      data-testid='sidebar-header'
      direction='row'
      gap='4'
      justify='start'
      align='center'
      overflow='clip'
      {...props}
    >
      <Box
        asChild={true}
      >
        <IconButton
          size='1'
          variant='ghost'
          onClick={toggleIsSidebarOpen}
        >
          <LayersIcon 
            width={20}
            height={20}
          />
        </IconButton>
      </Box>
      <Box
        minWidth='0'
        flexGrow='1'
        flexShrink='1'
      >
        <Heading
          size='2'
          weight='bold'
          wrap='nowrap'
        >
          Notepads / Pages
        </Heading>
      </Box>
      <CreateNotepad.Root>
        <CreateNotepad.Trigger>
          <Box
            asChild={true}
          >
            <IconButton
              size='1'
              variant='ghost'
            >
              <PlusIcon 
                width={20}
                height={20}
              />
            </IconButton>
          </Box>
        </CreateNotepad.Trigger>
        <CreateNotepad.Content
          maxWidth='520px'
        />
      </CreateNotepad.Root>
    </Flex>
  )
}

export default SidebarHeader