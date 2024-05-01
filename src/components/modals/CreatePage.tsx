import React, { useState } from "react"

import store from "@src/store"
import { useAlert } from "@providers/Alert"
import { createpageThunk } from "@src/actions/notepads.slice"
import { useModal } from '@providers/Modal'
import Input from '@components/Input'
import Button from "@components/Button"
import styles from "@styles/create-page-modal.module.css"

import type { Notepad } from "@ts/models/Notepads.types"

export default function CreatePage ({
  notepad,
  className='',
  onSuccess=()=>null,
  onCancel=()=>null,
}: {
  notepad: Notepad
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
          __ENVIRONMENT__ === 'testing' ? `class:a4629e7124c34a9bbed19980588f183a` : ''
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
          className={__ENVIRONMENT__ === 'testing' ? `class:8574d9c791c54ac387a0eadeb60ad9e9` : ''}
          label={'Cancel'}
          onClick={_onCancel}
        />
        <Button
          className={__ENVIRONMENT__ === 'testing' ? `class:6012f7869d934c888ac9711da2eb0db7` : ''}
          label={'Send'}
          onClick={_onSuccess}
        />
      </div>
    </div>
  )
}