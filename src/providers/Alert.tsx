import React, { useContext, useState } from 'react'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

import IconButton from '@components/IconButton'
import styles from '@styles/alert.module.css'

const INITIAL_STATE = {}

const context = React.createContext(INITIAL_STATE)

function useAlert (): any {
  return useContext(context)
}

function AlertProvider ({
  children=[]
}: {
  children?: JSX.Element | JSX.Element[]
}) {
  const [message, setMessage] = useState<string>('')
  const [isAlertActive, setIsAlertActive] = useState<boolean>(false)

  const showAlert = (message: string) => {
    setMessage(message)
    setIsAlertActive(true)
  }

  const closeAlert = () => {
    setIsAlertActive(false)
  }

  return (
    <context.Provider
      value={{
        showAlert,
        closeAlert
      }}
    >
    {children}
    <section
      className={styles.container}
      style={{
        'display': isAlertActive ? 'block' : 'none'
      }}
    >
    <div 
      className={styles.content} 
    >
      <h4 className={`secondary-h4 ${styles.message}`}>{ message }</h4>
      <IconButton 
        className={styles['close-button']}
        icon={faXmark}
        onClick={closeAlert}
      />
    </div>
    </section>
    </context.Provider>
  )
}

export {
  useAlert,
  AlertProvider
}