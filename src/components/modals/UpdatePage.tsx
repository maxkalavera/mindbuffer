import React, { useEffect, useState } from "react"

import { useContext } from "@providers/Context"
import { useModal } from '@providers/Modal'
import Input from '@components/Input'
import Button from "@components/Button"
import styles from "@styles/update-page-modal.module.css"

export default function UpdatePage ({
  className='',
  data={},
  onSuccess=()=>null,
  onCancel=()=>null,
}: {
  className?: string,
  data: any,
  onSuccess?: (payload?: any, ...args: any[]) => any
  onCancel?: (...args: any[]) => any
}) {
  const { notepads } = useContext()
  const { closeModal } = useModal()
  const [name, setName] = useState(data.name)

  useEffect(() => {
    setName(data.name)
  }, [data.name])

  const updatePage = () => {
    (async () => {
      const payload = { value: {
        ...data,
        name
      } }
      await window.electronAPI.pages.update(payload)
      notepads.pages.update(payload)
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
            updatePage()
            onSuccess()
            closeModal()
          }}
        />
      </div>
    </div>
  )
}