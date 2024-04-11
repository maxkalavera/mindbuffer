import React, { useEffect, useState } from "react"

import store from "@src/store"
import { updateNotepadThunk } from "@src/actions/notepads.slice"
import { useModal } from '@providers/Modal'
import Input from '@components/Input'
import Button from "@components/Button"
import styles from "@styles/update-notepad-modal.module.css"

import type { Notepad, NotepadPayload } from "@ts/models/Notepads.types"

export default function UpdateNotepad ({
  data,
  className='',
  onSuccess=()=>null,
  onCancel=()=>null,
}: {
  data: Notepad,
  className?: string,
  onSuccess?: (...args: any[]) => any
  onCancel?: (...args: any[]) => any
}) {
  const { closeModal } = useModal()
  const [state, setState] = useState({
    name: '',
  })

  useEffect(() => {
    setState({
      name: data.name,
    })
  }, [JSON.stringify(data)])

  const updateNotepad = () => {
    store.dispatch(updateNotepadThunk({
      value: {
        ...data,
        ...state,
      }
    }))
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
        className={styles.input}
        label={'Name:'}
        value={state.name} 
        onChange={(event) => setState({
          name: event.target.value
        })}
      />
      <div className={styles.options}>
        <Button
          label={'Cancel'}
          onClick={_onCancel}
        />
        <Button
          label={'Save'}
          onClick={_onSuccess}
        />
      </div>
    </div>
  )
}