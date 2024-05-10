/// <reference path="./renderer.d.ts" />

import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
//import { Provider as ReduxProvider } from 'react-redux'

//import store from '@src/store'
//import Router from '@components/Router'
//import { ContextProvider } from '@providers/Context'
//import { ModalProvider } from '@providers/Modal'
//import { AlertProvider } from '@providers/Alert'
//import '@styles/globals.css'

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <React.StrictMode>
    <h1>Hello world!</h1>
  </React.StrictMode>
)

/*
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
*/