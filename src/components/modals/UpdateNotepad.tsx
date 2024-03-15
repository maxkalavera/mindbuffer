import React, { useState } from "react"

import Input from '@components/Input'
import Button from "@components/Button"

import styles from "@styles/update-notepad-modal.module.css"

export default function UpdateNotepad ({
  className='',
  data={},
  onSuccess=()=>null,
  onCancel=()=>null,
}: {
  className?: string,
  data: any,
  onSuccess?: (payload: any, ...args: any[]) => any
  onCancel?: (...args: any[]) => any
}) {
  const [name, setName] = useState(data.name)

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
          onClick={onCancel}
        />
        <Button
          label={'Save'}
          onClick={() => onSuccess({
            ...data,
            name
          })}
        />
      </div>
    </div>
  )
}