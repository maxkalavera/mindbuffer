import React, { useState } from "react"

import { useContext } from "@providers/Context"
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
  onSuccess?: (payload?: { data: NotepadPayload }, ...args: any[]) => any
  onCancel?: (...args: any[]) => any
  className?: string
}) {
  const { notepads } = useContext()
  const { closeModal } = useModal()
  const [name, setName] = useState('')

  const clearForm = () => {
    setName('')
  }

  const createNotepad = (payload: { data: NotepadPayload }) => {
    (async () => {
      const notepad = await window.electronAPI.notepads.create(payload)
      if (notepad === undefined) return
      notepads.add({ values: [notepad]})
    })()
  }

  return (
    <div className={`${className} ${styles.container}`}>
      <Input
        className={styles.input}
        label={'Name:'}
        value={name} 
        onChange={(event) => setName(event.target.value)}
      />
      <div className={styles.options}>
        <Button
          label={'Cancel'}
          onClick={() => {
            onCancel()
            clearForm()
            closeModal()
          }}
        />
        <Button
          label={'Send'}
          onClick={() => {
            const payload = {
              data: {
                name
              }
            }
            createNotepad(payload)
            onSuccess(payload)
            clearForm()
            closeModal()
          }}
        />
      </div>
    </div>
  )
}