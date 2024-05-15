import React, { useContext, useState, useRef } from 'react'

const INITIAL_STATE: {
  message: string,
  type: 'primary' | 'secondary' | 'success' | 'danger' | 'warning',
  isAlertActive: boolean,
  showAlert: ({ message, type, }: {
    message: string;
    type?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
}) => void,
  closeAlert: () => void,
} = {
  message: '',
  type: 'primary',
  isAlertActive: false,
  showAlert: undefined,
  closeAlert: undefined,
}

const context = React.createContext<typeof INITIAL_STATE>(INITIAL_STATE)

function useAlert (): typeof INITIAL_STATE {
  return useContext(context)
}

function AlertProvider ({
  children=[],
  alertDuration=3000,
}: {
  children?: JSX.Element | JSX.Element[]
  alertDuration?: number
}) {
  const [state, setState] = useState<{
    message: (typeof INITIAL_STATE)['message'],
    type: (typeof INITIAL_STATE)['type'],
    isAlertActive: (typeof INITIAL_STATE)['isAlertActive'],
  }>({
    message: '',
    type: 'primary',
    isAlertActive: false,
  })
  const timer = useRef<NodeJS.Timeout>(null)

  const showAlert = ({
    message,
    type='primary',
  }: {
    message: (typeof state)['message'],
    type?: (typeof state)['type'],
  }) => {
    setState({
      message,
      type,
      isAlertActive: true,
    })
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      closeAlert()
    }, alertDuration)
  }

  const closeAlert = () => {
    setState((prev) => ({
      ...prev,
      message: '',
      isAlertActive: false,
    }))
    clearTimeout(timer.current)
  }

  return (
    <context.Provider
      value={{
        ...state,
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