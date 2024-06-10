import React, { useEffect, useState } from 'react'
import _ from 'lodash'
import { Box, Card, Dialog, Flex, Heading, IconButton } from '@radix-ui/themes'
import { LayersIcon, PlusIcon } from '@radix-ui/react-icons'

import store from '@renderer/utils/store'
import commonsSlice from '@renderer/actions/commons.slice'
import CreateNotepad from '@renderer/components/CreateNotepad'

import type { BoxProps } from '@radix-ui/themes'

function SidebarHeader(props: BoxProps) {

  const toggleIsSidebarOpen = () => {
    const { mutateSidebarToggleHash } = commonsSlice.actions
    store.dispatch(mutateSidebarToggleHash())
  }

  return (
    <Flex
      data-testid='sidebar-header'
      width='100%'
      direction='row'
      gap='4'
      justify='start'
      align='center'
    >
      <IconButton
        style={{
          cursor: 'pointer',
          color:'var(--gray-12)'
        }}
        variant='ghost'
        onClick={toggleIsSidebarOpen}
      >
        <LayersIcon 
          width={20}
          height={20}
        />
      </IconButton>
      <Box
        minWidth='0px'
        flexBasis='0px'
        flexGrow='1'
        flexShrink='1'
        overflowX='clip'
      >
        <Heading
          size='2'
          weight='bold'
          wrap='nowrap'
        >
          Notepads / Pages
        </Heading>
      </Box>
      <CreateNotepad />
    </Flex>
  )
}

export default SidebarHeader