import React, { useState } from 'react'
import { Box, Flex, IconButton, Text } from '@radix-ui/themes'
import { DotsHorizontalIcon, PlusIcon, Pencil2Icon, TrashIcon } from '@radix-ui/react-icons'

import DropdownMenu from '@renderer/primitives/DropdownMenu'
import Page from '@renderer/components/Page'
import CreatePage from '@renderer/dialogs/CreatePage'
import UpdateNotepad from '@renderer/dialogs/UpdateNotepad'
import DeleteNotepad from '@renderer/dialogs/DeleteNotepad'

import type { FlexProps } from '@radix-ui/themes'
import type { NotepadType } from "@ts/models/Notepads.types"
import { PageType } from '@ts/models/Pages.types'

function Notepad ({
  data,
  loading=false,
  ...flexProps
} : FlexProps & {
  data: NotepadType,
  loading?: boolean,
}) {
  const [state, setState] = useState({
    isCreatePageOpen: false,
    isUpdateNotepadOpen: false,
    isDeleteNotepadOpen: false,
  })

  return (
    <>
      <>
        <CreatePage.Root
          open={state.isCreatePageOpen}
          onOpenChange={(isOpen) => setState((prev) => ({...prev, isCreatePageOpen: isOpen}))}
        >
          <CreatePage.Content notepad={data} />
        </CreatePage.Root>
        <UpdateNotepad.Root
          open={state.isUpdateNotepadOpen}
          onOpenChange={(isOpen) => setState((prev) => ({...prev, isUpdateNotepadOpen: isOpen}))}
        >
          <UpdateNotepad.Content notepad={data} />
        </UpdateNotepad.Root>      
        <DeleteNotepad.Root
          open={state.isDeleteNotepadOpen}
          onOpenChange={(isOpen) => setState((prev) => ({...prev, isDeleteNotepadOpen: isOpen}))}
        >
          <DeleteNotepad.Content notepad={data} />
        </DeleteNotepad.Root>
      </>
      <Flex
        direction='column'
        gap='2'
        justify='start'
        align='stretch'
        {...flexProps}
      >

        <Flex 
          direction='row'
          gap='4'
          justify='start'
          align='center'
        >
          <Box
            flexGrow='1'
          >
            <Text 
              size='2' 
              weight='bold'
            >
              {data.name}
            </Text>
          </Box>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <IconButton
                size='1'
                variant='ghost'
              >
                <DotsHorizontalIcon width='18' height='18' />
              </IconButton>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <DropdownMenu.Item
                onClick={() => setState((prev) => ({...prev, isCreatePageOpen: true}))}
              >
                Add page
                <PlusIcon width='16' height='16' />
              </DropdownMenu.Item>
              <DropdownMenu.Separator />
              <DropdownMenu.Item
                onClick={() => setState((prev) => ({...prev, isUpdateNotepadOpen: true}))}
              >
                Rename
                <Pencil2Icon width='16' height='16' />
              </DropdownMenu.Item>
              <DropdownMenu.Item 
                color="red"
                onClick={() => setState((prev) => ({...prev, isDeleteNotepadOpen: true}))}
              >
                Delete
                <TrashIcon width='16' height='16' />
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </Flex>
        <Flex
          direction='column'
          gap='0'
          justify='start'
          align='stretch'
        >
          {
            (data.pages ? data.pages : []).map((item: PageType) => (
              <Page 
                key={item.id} 
                data={item} 
              />
            ))
          }
        </Flex>
      </Flex>
    </>
  )
}

export default Notepad