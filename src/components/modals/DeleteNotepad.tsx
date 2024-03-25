import React from "react"

import Button from "@components/Button"

import styles from "@styles/delete-notepad-modal.module.css"

export default function DeleteNotepad({
  className='',
  onSuccess=()=>null,
  onCancel=()=>null,
}: {
  onSuccess?: (...args: any[]) => any
  onCancel?: (...args: any[]) => any
  className?: string
}) {
  return (
    <div className={`${className} ${styles.container}`}>
    <div className={styles.container}>
      <p className={`secondary-p ${styles.content}`}>
        Are you sure you want to delete this notepad?
      </p>
      <div className={styles.options}>
        <Button
          label={'Cancel'}
          onClick={onCancel}
        />
        <Button
          label={'Delete'}
          onClick={onSuccess}
        />
      </div>
    </div>
    </div>
  )
}