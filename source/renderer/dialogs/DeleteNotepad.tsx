import React, { useState } from 'react'
import { 
  AlertDialog,
  Button,
  Flex, 
} from '@radix-ui/themes'

import store from "@renderer/utils/store"
import { destroyNotepadThunk } from "@renderer/actions/notepads.slice"

import type { NotepadType } from "@ts/models/Notepads.types"

function DeleteNotepadContent(
  {
    notepad,
    ...aditionalProps
  }: Parameters<typeof AlertDialog.Content>[0] & {
    notepad: NotepadType,
  }
) {
  const destroyNotepad = () => {
    store.dispatch(destroyNotepadThunk({ value: notepad })).then(() => {
      // Show alert
    })
  }

  const _onCancel = () => {
  }

  const _onSuccess = () => {
    destroyNotepad()
  }

  return (
    <AlertDialog.Content
      {...aditionalProps}
    >
      <AlertDialog.Title size='2'>
        Delete notepad
      </AlertDialog.Title>
      <AlertDialog.Description size="2">
        Are you sure? all the notes and pages associated with this notepad will also be deleted.
      </AlertDialog.Description>
      <Flex gap="3" mt="4" justify="end">
        <AlertDialog.Cancel>
          <Button 
            variant="soft" 
            color="gray"
            onClick={_onCancel}
          >
            Cancel
          </Button>
        </AlertDialog.Cancel>
        <AlertDialog.Action>
          <Button 
            variant="solid" 
            color="red"
            onClick={_onSuccess}
          >
            Delete
          </Button>
        </AlertDialog.Action>
      </Flex>
    </AlertDialog.Content>
  )
}

export default {
  ...AlertDialog,
  Content: DeleteNotepadContent,
}