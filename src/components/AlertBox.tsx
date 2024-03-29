import React from "react"

import { useAlert } from "@providers/Alert"
import styles from "@styles/alert-box.module.css"

function AlertBox ({
  className=''
}: {
  className?: string
}) {
  const { message } = useAlert()

  return (
    <div className={`${className} ${styles.container}`}>
      <small className={`tertiary-small ${styles.message}`}>{ message }</small>
    </div>
  )
}

export default AlertBox