import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { Provider as ReduxProvider } from 'react-redux'

import store from '@src/store'
import Router from '@components/Router'
//import { ContextProvider } from '@providers/Context'
import { ModalProvider } from '@providers/Modal'
import { AlertProvider } from '@providers/Alert'
import '@styles/globals.css'

const root = ReactDOM.createRoot(document.getElementById('root'))

window.globals = {
  paginationOffset: 20,
  associatedPagesPaginationOffset: 50,
}

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
