/// <reference path="../declarations.d.ts" />

import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { Provider as ReduxProvider } from 'react-redux'
import { Theme } from '@radix-ui/themes'

import store from '@renderer/utils/store'
import Router from '@renderer/components/Router'
import { ModalProvider } from '@renderer/providers/Modal'
import { AlertProvider } from '@renderer/providers/Alert'
import '@radix-ui/themes/styles.css'
import './renderer.css'
//import '@renderer/styles/globals.css'

const root = ReactDOM.createRoot(document.getElementById('root'))

const ThemeWrapper = ({ children }) => {
  return (
    <Theme 
      appearance='dark'
      accentColor='yellow'
      grayColor='sand'
      radius='large'
      scaling="105%"
      panelBackground='translucent'
    >
      {children}
    </Theme>
  )
}

root.render(
  <React.StrictMode>
    <ReduxProvider store={store} >
      <ThemeWrapper>
        <AlertProvider>
          <ModalProvider>
            <Router />
          </ModalProvider>
        </AlertProvider>
      </ThemeWrapper>
    </ReduxProvider>
  </React.StrictMode>
)
