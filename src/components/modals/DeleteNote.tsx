import React from "react"


import { destroyNoteThunk } from "@src/actions/notes.slice"
import store from "@src/store"
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
  const { closeModal } = useModal()

  const destroyNote = () => {
    store.dispatch(destroyNoteThunk({ value: value }))
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
          label={'Cancel'}
          onClick={_onCancel}
        />
        <Button
          label={'Delete'}
          onClick={_onSuccess}
        />
      </div>
    </div>
    </div>
  )
}