import React, { useState } from "react"

import { useContext } from "@providers/Context"
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
  onSuccess?: (payload?: { data: PagePayload }, ...args: any[]) => any,
  onCancel?: (...args: any[]) => any,
}) {
  const { notepads } = useContext()
  const { closeModal } = useModal()
  const [name, setName] = useState('')

  const clearForm = () => {
    setName('')
  }

  const createPage = (payload: { data: PagePayload }) => {
    (async () => {
      const page = await window.electronAPI.pages.create(payload)
      notepads.pages.add({ values: [page]})
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
            clearForm()
            closeModal()
          }}
        />
        <Button
          label={'Send'}
          onClick={() => {
            const payload = {  
              data: {
                name,
                notepadId: notepad.id
              }
            }
            createPage(payload)
            onSuccess(payload)
            clearForm()
            closeModal()
          }}
        />
      </div>
    </div>
  )
}