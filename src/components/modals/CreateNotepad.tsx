import React, { useState } from "react"

import store from "@src/store"
import { createNotepadThunk } from "@actions/notepads.slice"
import { useModal } from '@providers/Modal'
import Input from '@components/Input'
import Button from "@components/Button"
import styles from "@styles/create-notepad-modal.module.css"

import type { NotepadPayload } from "@ts/models/Notepads.types"

export default function CreateNotepad ({
  className='',
  onSuccess=()=>null,
  onCancel=()=>null,
}: {
  onSuccess?: (...args: any[]) => any
  onCancel?: (...args: any[]) => any
  className?: string
}) {
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
    }))
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
        className={styles.input}
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
          label={'Cancel'}
          onClick={_onCancel}
        />
        <Button
          label={'Send'}
          onClick={_onSuccess}
        />
      </div>
    </div>
  )
}