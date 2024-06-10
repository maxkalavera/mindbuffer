import React, { useState } from 'react'
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
import { createpageThunk } from "@renderer/actions/notepads.slice"

import type { NotepadType } from "@ts/models/Notepads.types"

function CreatePage({
  notepad,
}: {
  notepad: NotepadType,
}) {
  const [state, setState] = useState({
    name: '',
  })

  const clearForm = () => {
    setState({
      name: '',
    })
  }

  const createPage = () => {
    store.dispatch(createpageThunk({
      name: state.name,
      notepadId: notepad.id
    })).then(() => {
      // Show Alert of success
    })
  }

  const _onCancel = () => {
    clearForm()
  }

  const _onSuccess = () => {
    createPage()
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

export default CreatePage