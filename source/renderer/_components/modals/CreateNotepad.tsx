import React, { useState } from "react"

import store from "@renderer/utils/store"
import { useAlert } from "@renderer/providers/Alert"
import { createNotepadThunk } from "@renderer/actions/notepads.slice"
import { useModal } from '@renderer/providers/Modal'
import Input from '@renderer/components/Input'
import Button from "@renderer/components/Button"
import styles from "@renderer/styles/create-notepad-modal.module.css"

export default function CreateNotepad ({
  className='',
  onSuccess=()=>null,
  onCancel=()=>null,
}: {
  onSuccess?: (...args: any[]) => any
  onCancel?: (...args: any[]) => any
  className?: string
}) {
  const { showAlert } = useAlert()
  const { closeModal } = useModal()
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
      showAlert({ message: 'Notepad created', type: 'success' })
    })
  }
  const _onCancel = () => {
    onCancel()
    clearForm()
    closeModal()
  }

  const _onSuccess = () => {
    createNotepad()
    onSuccess()
    clearForm()
    closeModal()
  }

  return (
    <div className={`${className} ${styles.container}`}>
      <Input
        className={[
          styles.input,
          globals.ENVIRONMENT === 'testing' ? 'class:create-notepad-name-input:hWmi28rONe' : ''
        ].join(' ')}
        label={'Name:'}
        value={state.name}
        maxlength={50}
        onChange={(event) => setState((prev) => ({
          ...prev,
          name: event.target.value
        }))}
        onEnter={_onSuccess}
      />
      <div className={styles.options}>
        <Button
          className={globals.ENVIRONMENT === 'testing' ? `class:modal-cancel-button:64CdoMr82v` : ''}
          label={'Cancel'}
          onClick={_onCancel}
        />
        <Button
          className={globals.ENVIRONMENT === 'testing' ? `class:modal-confirm-button:fHIbu0jVfe` : ''}
          label={'Send'}
          onClick={_onSuccess}
        />
      </div>
    </div>
  )
}