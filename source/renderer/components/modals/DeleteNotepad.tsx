import React from "react"

import store from "@renderer/utils/store"
import { useAlert } from "@renderer/providers/Alert"
import { destroyNotepadThunk } from "@renderer/actions/notepads.slice"
import { useModal } from '@renderer/providers/Modal'
import Button from "@renderer/components/Button"
import styles from "@renderer/styles/delete-notepad-modal.module.css"
import { Notepad } from "@commons/ts/models/Notepads.types"

export default function DeleteNotepad({
  value,
  className='',
  onSuccess=()=>null,
  onCancel=()=>null,
}: {
  value: Notepad,
  onSuccess?: (...args: any[]) => any
  onCancel?: (...args: any[]) => any
  className?: string
}) {
  const { showAlert } = useAlert()
  const { closeModal } = useModal()

  const destroyNotepad = () => {
    store.dispatch(destroyNotepadThunk({ value: value })).then(() => {
      showAlert({ message: 'Notepad deleted', type: 'success' })
    })
  }

  const _onCancel = () => {
    onCancel()
    closeModal()
  }

  const _onSuccess = () => {
    destroyNotepad()
    onSuccess()
    closeModal()
  }

  return (
    <div className={`${className} ${styles.container}`}>
    <div className={styles.container}>
      <p className={`secondary-p ${styles.content}`}>
        Are you sure you want to delete this item?
      </p>
      <div className={styles.options}>
        <Button
          className={globals.ENVIRONMENT === 'testing' ? `class:modal-cancel-button:64CdoMr82v` : ''}
          label={'Cancel'}
          onClick={_onCancel}
        />
        <Button
          className={globals.ENVIRONMENT === 'testing' ? `class:modal-confirm-button:fHIbu0jVfe` : ''}
          label={'Delete'}
          onClick={_onSuccess}
        />
      </div>
    </div>
    </div>
  )
}