/// <reference path="../declarations.d.ts" />

import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider as ReduxProvider } from 'react-redux'

import store from '@renderer/utils/store'
import Router from '@renderer/components/Router'
import { ModalProvider } from '@renderer/providers/Modal'
import { AlertProvider } from '@renderer/providers/Alert'
import '@renderer/styles/globals.css'

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <React.StrictMode>
    <ReduxProvider store={store} >
      <AlertProvider>
        <ModalProvider>
          <Router />
        </ModalProvider>
      </AlertProvider>
    </ReduxProvider>
  </React.StrictMode>
)
