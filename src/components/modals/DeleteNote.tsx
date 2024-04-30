import React from "react"

import store from "@src/store"
import { destroyNoteThunk } from "@src/actions/notes.slice"
import { useAlert } from "@providers/Alert"
import { useModal } from '@providers/Modal'
import Button from "@components/Button"
import styles from "@styles/delete-note-modal.module.css"

import type { Note } from "@ts/models/Notes.types"

export default function DeleteNote({
  value,
  className='',
  onSuccess=()=>null,
  onCancel=()=>null,
}: {
  value: Note
  onSuccess?: (...args: any[]) => any
  onCancel?: (...args: any[]) => any
  className?: string
}) {
  const { showAlert } = useAlert()
  const { closeModal } = useModal()

  const destroyNote = () => {
    store.dispatch(destroyNoteThunk({ value: value })).then(() => {
      showAlert({ message: 'Note deleted', type: 'success' })
    })
  }

  const _onCancel = () => {
    onCancel()
    closeModal()
  }

  const _onSuccess = () => {
    destroyNote()
    onSuccess()
    closeModal()
  }

  return (
    <div className={`${className} ${styles.container}`}>
    <div className={styles.container}>
      <p className={`secondary-p ${styles.content}`}>
        Are you sure you want to delete the item?
      </p>
      <div className={styles.options}>
        <Button
          className={__ENVIRONMENT__ === 'testing' ? `class:8574d9c791c54ac387a0eadeb60ad9e9` : ''}
          label={'Cancel'}
          onClick={_onCancel}
        />
        <Button
          className={__ENVIRONMENT__ === 'testing' ? `class:6012f7869d934c888ac9711da2eb0db7` : ''}
          label={'Delete'}
          onClick={_onSuccess}
        />
      </div>
    </div>
    </div>
  )
}