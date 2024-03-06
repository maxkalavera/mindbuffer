import React from "react"

import Button from "@components/Button"
import styles from "@styles/modal-content.module.css"

function ModalContent({
  text='',
  primary={
    label: '',
    onClick: null
  },
  secondary={
    label: '',
    onClick: null
  },
}:{
  text?: string,
  primary?: {
    label: string,
    onClick: ((...args: any[]) => any) | null
  },
  secondary?: {
    label: string,
    onClick: ((...args: any[]) => any) | null
  }
}) {
  return (
    <div className={styles.container}>
      <p className={`secondary-p ${styles.content}`}>
        {text}
      </p>
      <div className={styles.options}>
        <Button
          label={secondary.label}
          onClick={secondary.onClick}
        />
        <Button
          label={primary.label}
          onClick={primary.onClick}
        />
      </div>
    </div>
  )
}

export default ModalContent