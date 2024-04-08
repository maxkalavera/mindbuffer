import React from "react"

import { useContext } from "@providers/Context"
import { useModal } from '@providers/Modal'
import Button from "@components/Button"
import styles from "@styles/delete-page-modal.module.css"

import type { Page } from "@ts/models/Pages.types"

export default function DeletePage({
  data,
  className='',
  onSuccess=()=>null,
  onCancel=()=>null,
}: {
  data: Page,
  onSuccess?: (...args: any[]) => any
  onCancel?: (...args: any[]) => any
  className?: string
}) {
  const { } = useContext()
  const { closeModal } = useModal()

  const deletePage = () => {
    (async () => {
      const payload = { id: data.id }
      await window.electronAPI.pages.destroy(payload)
      //# notepads.pages.destroy({ value: data })
    })()
  }

  return (
    <div className={`${className} ${styles.container}`}>
    <div className={styles.container}>
      <p className={`secondary-p ${styles.content}`}>
        Are you sure you want to delete this page?
      </p>
      <div className={styles.options}>
        <Button
          label={'Cancel'}
          onClick={() => {
            onCancel()
            closeModal()
          }}
        />
        <Button
          label={'Delete'}
          onClick={() => {
            deletePage()
            onSuccess()
            closeModal()
          }}
        />
      </div>
    </div>
    </div>
  )
}