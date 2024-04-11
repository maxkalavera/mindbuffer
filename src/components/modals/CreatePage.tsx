import React, { useState } from "react"

import { useModal } from '@providers/Modal'
import Input from '@components/Input'
import Button from "@components/Button"
import styles from "@styles/create-page-modal.module.css"

import type { PagePayload } from "@ts/models/Pages.types"
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
        className={styles.input}
        label={'Name:'}
        value={state.name} 
        onChange={(event) => setState((prev) => ({
          ...prev,
          name: event.target.value,
        }))}
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