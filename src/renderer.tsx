import React from 'react'
import ReactDOM from 'react-dom/client'

import Router from '@components/Router'
import { ContextProvider } from '@providers/Context'
import { ModalProvider } from '@providers/Modal'
import { AlertProvider } from '@providers/Alert'
import '@styles/globals.css'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <ContextProvider>
      <AlertProvider>
        <ModalProvider>
          <Router />
        </ModalProvider>
      </AlertProvider>
    </ContextProvider>
  </React.StrictMode>
)
