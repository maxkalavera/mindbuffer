import React from "react"

import { useAlert } from '@providers/Alert'
import { useModal } from '@providers/Modal'
import { useContext } from '@providers/Context'
import Button from "@components/Button"
import styles from "@styles/delete-note-modal.module.css"

import type { Note, NoteID } from "@ts/models/Notes.types"

export default function DeleteNote({
  data,
  className='',
  onSuccess=()=>null,
  onCancel=()=>null,
}: {
  data: Note
  onSuccess?: (...args: any[]) => any
  onCancel?: (...args: any[]) => any
  className?: string
}) {
  const { closeModal } = useModal()
  const { board: { notes } } = useContext()
  const { showAlert } = useAlert()

  const destroyNote = () => {
    if (window.electronAPI.notes.destroy({ id: data.id })) {
      notes.destroy({ id: data.id })
      showAlert('Note deleted!')
    }
  }

  return (
    <div className={`${className} ${styles.container}`}>
    <div className={styles.container}>
      <p className={`secondary-p ${styles.content}`}>
        Are you sure you want to delete the note?
      </p>
      <div className={styles.options}>
        <Button
          label={'Cancel'}
          onClick={() => {
            onCancel()
            closeModal()
          }}
        />
        <Button
          label={'Delete'}
          onClick={() => {
            destroyNote()
            onSuccess()
            closeModal()
          }}
        />
      </div>
    </div>
    </div>
  )
}