import React from "react"

import { useAlert } from "@renderer/providers/Alert"
import styles from "@renderer/styles/alert-box.module.css"

function AlertBox ({
  className=''
}: {
  className?: string
}) {
  const { 
    message,
    type,
    isAlertActive,
  } = useAlert()

  return (
    <div className={`${className} ${styles.container}`}>
      <small className={`tertiary-small ${styles[type]}`}>{ message }</small>
    </div>
  )
}

export default AlertBox