import React, { useState } from "react"

import store from "@renderer/utils/store"
import { useAlert } from "@renderer/providers/Alert"
import { createpageThunk } from "@renderer/actions/notepads.slice"
import { useModal } from '@renderer/providers/Modal'
import Input from '@renderer/components/Input'
import Button from "@renderer/components/Button"
import styles from "@renderer/styles/create-page-modal.module.css"

import type { NotepadType } from "@ts/models/Notepads.types"

export default function CreatePage ({
  notepad,
  className='',
  onSuccess=()=>null,
  onCancel=()=>null,
}: {
  notepad: NotepadType,
  className?: string,
  onSuccess?: (...args: any[]) => any,
  onCancel?: (...args: any[]) => any,
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

  const createPage = () => {
    store.dispatch(createpageThunk({
      name: state.name,
      notepadId: notepad.id
    })).then(() => {
      showAlert({ message: 'Page created', type: 'success' })
    })
  }

  const _onCancel = () => {
    onCancel()
    clearForm()
    closeModal()
  }

  const _onSuccess = () => {
    createPage()
    onSuccess()
    clearForm()
    closeModal()
  }

  return (
    <div className={`${className} ${styles.container}`}>
      <Input
        className={[
          styles.input,
          globals.ENVIRONMENT === 'testing' ? `class:page-modal-name-input-wrapper:o0Tmq3A18Z` : ''
        ].join(' ')}
        label={'Name:'}
        value={state.name}
        maxlength={50}
        onChange={(event) => setState((prev) => ({
          ...prev,
          name: event.target.value,
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