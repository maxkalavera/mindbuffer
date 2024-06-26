import React from 'react'
import { Box, Flex, Heading, IconButton } from '@radix-ui/themes'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLayerGroup, faPlus, faPlusSquare, faCirclePlus } from '@fortawesome/free-solid-svg-icons';

import store from '@renderer/utils/redux-store'
import commonsSlice from '@renderer/actions/commons.slice'
import CreateNotepad from '@renderer/dialogs/CreateNotepad'

import type { FlexProps } from '@radix-ui/themes'

function SidebarHeader({
  isSidebarOpen=true,
  ...flexProps
}: FlexProps & { 
  isSidebarOpen?: boolean
}) {

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
      {...flexProps}
    >
      <Box
        asChild={true}
      >
        <IconButton
          size='1'
          variant='ghost'
          onClick={toggleIsSidebarOpen}
        >
          <FontAwesomeIcon
            size='1x'
            icon={faLayerGroup}
          />
        </IconButton>
      </Box>
      <Box
        className={isSidebarOpen ? '' : 'hidden'}
        minWidth='0'
        flexGrow='1'
        flexShrink='1'
      >
        <Heading
          size='2'
          weight='bold'
          wrap='nowrap'
          style={{
            overflowX: 'clip'
          }}
        >
          Notepads / Pages
        </Heading>
      </Box>
      <CreateNotepad.Root>
        <CreateNotepad.Trigger>
          <Box
            className={isSidebarOpen ? '' : 'hidden'}
            asChild={true}
          >
            <IconButton
              size='1'
              variant='ghost'
            >
              <FontAwesomeIcon
                size='1x'
                icon={faPlus}
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