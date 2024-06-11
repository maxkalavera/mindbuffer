import React, { useState } from 'react'
import { 
  Dialog, 
  Flex, 
  Button,
  TextField, 
  Text
} from '@radix-ui/themes'

import store from "@renderer/utils/store"
import { createNotepadThunk } from "@renderer/actions/notepads.slice"

function CreateNotepadContent(props: Parameters<typeof Dialog.Content>[0]) {
  const [state, setState] = useState({
    name: '',
  })

  const clearForm = () => {
    setState({
      name: '',
    })
  }

  const createNotepad = () => {
    store.dispatch(createNotepadThunk({
      name: state.name
    })).then(() => {
      // Show success
    })
  }

  const _onCancel = () => {
    clearForm()
  }

  const _onSuccess = () => {
    createNotepad()
    clearForm()
  }

  return (
    <Dialog.Content
      {...props}
    >
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
  )
}

export default {
  ...Dialog,
  Content: CreateNotepadContent,
}