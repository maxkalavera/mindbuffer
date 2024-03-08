import React, { useContext, useState, useRef } from 'react'

const INITIAL_STATE = {}

const context = React.createContext(INITIAL_STATE)

function useAlert (): any {
  return useContext(context)
}

function AlertProvider ({
  children=[],
  alertDuration=3000,
}: {
  children?: JSX.Element | JSX.Element[]
  alertDuration?: number
}) {
  const [message, setMessage] = useState<string>('')
  const [isAlertActive, setIsAlertActive] = useState<boolean>(false)
  const timer = useRef<NodeJS.Timeout>(null)

  const showAlert = (message: string) => {
    setMessage(message)
    setIsAlertActive(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      closeAlert()
    }, alertDuration)
  }

  const closeAlert = () => {
    setIsAlertActive(false)
    setMessage('')
    clearTimeout(timer.current)
  }

  return (
    <context.Provider
      value={{
        message,
        isAlertActive,
        showAlert,
        closeAlert
      }}
    >
    {children}
    </context.Provider>
  )
}

export {
  useAlert,
  AlertProvider
}