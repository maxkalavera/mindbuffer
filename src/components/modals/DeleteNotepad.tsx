import React from "react"

import { useContext } from "@providers/Context"
import { useModal } from '@providers/Modal'
import Button from "@components/Button"
import styles from "@styles/delete-notepad-modal.module.css"
import { Notepad } from "@ts/models/Notepads.types"

export default function DeleteNotepad({
  data,
  className='',
  onSuccess=()=>null,
  onCancel=()=>null,
}: {
  data: Notepad,
  onSuccess?: (...args: any[]) => any
  onCancel?: (...args: any[]) => any
  className?: string
}) {
  const { } = useContext()
  const { closeModal } = useModal()

  const destroyNotepad = () => {
    (async () => {
      const payload = {
        id: data.id
      }
      await window.electronAPI.notepads.destroy(payload)
      ///# notepads.destroy(payload)
      closeModal()
    })()
  }

  return (
    <div className={`${className} ${styles.container}`}>
    <div className={styles.container}>
      <p className={`secondary-p ${styles.content}`}>
        Are you sure you want to delete this notepad?
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
            destroyNotepad()
            onSuccess()
            closeModal()
          }}
        />
      </div>
    </div>
    </div>
  )
}