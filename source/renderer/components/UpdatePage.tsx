import React, { useState, useEffect } from 'react'
import { 
  Dialog, 
  Flex, 
  Button,
  IconButton, 
  TextField, 
  Text
} from '@radix-ui/themes'
import { PlusIcon } from '@radix-ui/react-icons'

import store from "@renderer/utils/store"
import { updatePageThunk } from "@renderer/actions/notepads.slice"

import type { PageType } from "@ts/models/Pages.types"

function UpdatePage({
  page,
}: {
  page: PageType,
}) {
  const [state, setState] = useState({
    name: '',
  })

  useEffect(() => {
    setState({
      name: page.name,
    })
  }, [JSON.stringify(page)])

  const updatePage = () => {
    store.dispatch(updatePageThunk({
      value: {
        ...page,
        name: state.name,
      }
    })).then(() => {
      // Show success
    })
  }

  const clearForm = () => {
    setState({
      name: '',
    })
  }

  const _onCancel = () => {
    clearForm()
  }

  const _onSuccess = () => {
    updatePage()
    clearForm()
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <IconButton
          style={{
            cursor: 'pointer',
            color:'var(--gray-12)'
          }}
          variant='ghost'
        >
          <PlusIcon 
          
            width={20}
            height={20}
          />
        </IconButton>
      </Dialog.Trigger>

      <Dialog.Content maxWidth='520px'>
        <Dialog.Title size='2'>
          Create notepad
        </Dialog.Title>

        <Flex 
          direction='column'
          gap='3'
        >
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Name
            </Text>
            <TextField.Root 
              size='2'
              value={state.name}
              onChange={(event) => setState({ name: event.target.value })}
            />
          </label>
        </Flex>

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button
              variant="soft"
              color="gray"
              onClick={_onCancel}
            >
              Cancel
            </Button>
          </Dialog.Close>
          <Dialog.Close>
            <Button
              onClick={_onSuccess}
            >
              Save
            </Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  )
}

export default UpdatePage