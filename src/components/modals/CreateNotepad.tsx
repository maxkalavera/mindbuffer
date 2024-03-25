import React, { useState } from "react"

import Input from '@components/Input'
import Button from "@components/Button"
import styles from "@styles/create-notepad-modal.module.css"


import type { NotepadPayload } from "@ts/models/Notepads.types"

export default function CreateNotepad ({
  className='',
  onSuccess=()=>null,
  onCancel=()=>null,
}: {
  onSuccess?: (payload: { data: NotepadPayload }, ...args: any[]) => any
  onCancel?: (...args: any[]) => any
  className?: string
}) {
  const [name, setName] = useState('')

  const clearForm = () => {
    setName('')
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
          }}
        />
        <Button
          label={'Send'}
          onClick={() => {
            onSuccess({
              data: {
                name
              }
            })
            clearForm()
          }}
        />
      </div>
    </div>
  )
}