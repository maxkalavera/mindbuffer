import React, { useState } from "react"

import Input from '@components/Input'
import Button from "@components/Button"

import styles from "@styles/create-page-modal.module.css"

export default function CreatePage ({
  className='',
  onSuccess=()=>null,
  onCancel=()=>null,
}: {
  onSuccess?: (payload: any, ...args: any[]) => any
  onCancel?: (...args: any[]) => any
  className?: string
}) {
  const [name, setName] = useState('')

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
          label={'Send'}
          onClick={() => onSuccess({
            name
          })}
        />
      </div>
    </div>
  )
}