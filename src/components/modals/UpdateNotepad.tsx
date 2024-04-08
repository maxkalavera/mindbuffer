import React, { useEffect, useState } from "react"

import { useContext } from "@providers/Context"
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
  onSuccess?: (payload?: { value: NotepadPayload }, ...args: any[]) => any
  onCancel?: (...args: any[]) => any
}) {
  const { } = useContext()
  const { showModal, closeModal } = useModal()
  const [name, setName] = useState(data.name)

  useEffect(() => {
    setName(data.name)
  }, [data.name])

  const updateNotepad = (payload: { value: Notepad }) => {
    (async () => {
      await window.electronAPI.notepads.update(payload)
      //# notepads.update(payload)
      closeModal()  
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
            closeModal()
          }}
        />
        <Button
          label={'Save'}
          onClick={() => {
            const payload = {
              value: {
                ...data,
                name
              }
            }
            updateNotepad(payload)
            onSuccess(payload)
            closeModal()
          }}
        />
      </div>
    </div>
  )
}