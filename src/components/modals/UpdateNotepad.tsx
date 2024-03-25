import React, { useEffect, useState } from "react"

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
  onSuccess?: (payload: { value: NotepadPayload }, ...args: any[]) => any
  onCancel?: (...args: any[]) => any
}) {
  const [name, setName] = useState(data.name)

  useEffect(() => {
    setName(data.name)
  }, [data.name])

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
          }}
        />
        <Button
          label={'Save'}
          onClick={() => {
            onSuccess({
              value: {
                ...data,
                name
              }
            })
          }}
        />
      </div>
    </div>
  )
}