import React from "react"

import store from "@src/store"
import { useAlert } from "@providers/Alert"
import { destroyNotepadThunk } from "@src/actions/notepads.slice"
import { useModal } from '@providers/Modal'
import Button from "@components/Button"
import styles from "@styles/delete-notepad-modal.module.css"
import { Notepad } from "@ts/models/Notepads.types"

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
          className={__ENVIRONMENT__ === 'testing' ? `class:modal-cancel-button:64CdoMr82v` : ''}
          label={'Cancel'}
          onClick={_onCancel}
        />
        <Button
          className={__ENVIRONMENT__ === 'testing' ? `class:modal-confirm-button:fHIbu0jVfe` : ''}
          label={'Delete'}
          onClick={_onSuccess}
        />
      </div>
    </div>
    </div>
  )
}