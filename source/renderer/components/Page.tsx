import React, { useState, useLayoutEffect } from 'react'
import { Flex, Separator, Text, DropdownMenu, IconButton, Button, Box } from '@radix-ui/themes'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'

import store from '@renderer/utils/store'
import UpdatePage from '@renderer/dialogs/UpdatePage'
import DeletePage from '@renderer/dialogs/DeletePage'
import { setSelectedPageIDThunk } from '@renderer/actions/pages.slice'

import type { FlexProps } from '@radix-ui/themes'
import type { PageType } from "@ts/models/Pages.types"

function Page ({
  data,
  loading=false,
  ...flexProps
} : FlexProps & {
  data: PageType,
  loading?: boolean,
}) {
  const [state, setState] = useState({
    isUpdatePageOpen: false,
    isDeletePageOpen: false,
  })
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

  const onPageSelected = () => {
    store.dispatch(setSelectedPageIDThunk({
      value: context.selectedPageID !== data.id ? 
        data.id :
        undefined
    }))
  }

  return (
    <>
      <>
        <UpdatePage.Root
          open={state.isUpdatePageOpen}
          onOpenChange={(isOpen) => setState((prev) => ({...prev, isUpdatePageOpen: isOpen}))}
        >
          <UpdatePage.Content page={data} />
        </UpdatePage.Root>
        <DeletePage.Root
          open={state.isDeletePageOpen}
          onOpenChange={(isOpen) => setState((prev) => ({...prev, isDeletePageOpen: isOpen}))}
        >
          <DeletePage.Content page={data} />
        </DeletePage.Root>
      </>
      <Flex 
        direction='row'
        gap='4'
        justify='start'
        align='center'
        {...flexProps}
      >
        <Separator 
          color='yellow'
          orientation='vertical'
          size='1'
        />

        <Box
          flexGrow='1'
        >
          <Button
            variant='ghost'
            onClick={onPageSelected}
          >
            <Text 
              size='2' 
              weight='bold'
            >
              {data.name}
            </Text>
          </Button>
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
                onClick={() => setState((prev) => ({...prev, isUpdatePageOpen: true}))}
              >
                Rename
              </DropdownMenu.Item>
              <DropdownMenu.Item 
                color="red"
                onClick={() => setState((prev) => ({...prev, isDeletePageOpen: true}))}
              >
                Delete
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
      </Flex>
    </>
  )
}

export default Page