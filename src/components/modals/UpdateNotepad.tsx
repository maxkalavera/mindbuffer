import React, { useEffect, useState } from "react"

import store from "@src/store"
import { useAlert } from "@providers/Alert"
import { updateNotepadThunk } from "@src/actions/notepads.slice"
import { useModal } from '@providers/Modal'
import Input from '@components/Input'
import Button from "@components/Button"
import styles from "@styles/update-notepad-modal.module.css"

import type { Notepad } from "@ts/models/Notepads.types"

export default function UpdateNotepad ({
  value,
  className='',
  onSuccess=()=>null,
  onCancel=()=>null,
}: {
  value: Notepad,
  className?: string,
  onSuccess?: (...args: any[]) => any
  onCancel?: (...args: any[]) => any
}) {
  const { showAlert } = useAlert()
  const { closeModal } = useModal()
  const [state, setState] = useState({
    name: '',
  })

  useEffect(() => {
    setState({
      name: value.name,
    })
  }, [JSON.stringify(value)])

  const updateNotepad = () => {
    store.dispatch(updateNotepadThunk({
      value: {
        ...value,
        ...state,
      }
    })).then(() => {
      showAlert({ message: 'Notepad updated', type: 'success' })
    })
  }

  const _onCancel = () => {
    onCancel()
    closeModal()
  }

  const _onSuccess = () => {
    updateNotepad()
    onSuccess()
    closeModal()
  }

  return (
    <div className={`${className} ${styles.container}`}>
      <Input
        className={[
          styles.input,
          __ENVIRONMENT__ === 'testing' ? 'class:create-notepad-name-input:hWmi28rONe' : ''
        ].join(' ')}
        label={'Name:'}
        value={state.name}
        maxlength={50}
        onChange={(event) => setState({
          name: event.target.value
        })}
        onEnter={_onSuccess}
      />
      <div className={styles.options}>
        <Button
          className={__ENVIRONMENT__ === 'testing' ? `class:modal-cancel-button:64CdoMr82v` : ''}
          label={'Cancel'}
          onClick={_onCancel}
        />
        <Button
          className={__ENVIRONMENT__ === 'testing' ? `class:modal-confirm-button:fHIbu0jVfe` : ''}
          label={'Save'}
          onClick={_onSuccess}
        />
      </div>
    </div>
  )
}