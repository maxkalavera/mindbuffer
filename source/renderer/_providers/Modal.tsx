import React, { useContext, useState } from 'react'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

import IconButton from '@renderer/components/IconButton'
import styles from '@renderer/styles/modal.module.css'

const INITIAL_STATE = {}

const context = React.createContext(INITIAL_STATE)

function useModal (): any {
  return useContext(context)
}

function ModalProvider ({
  children=[]
}: {
  children?: JSX.Element | JSX.Element[]
}) {
  const [state, setState] = useState<{
    title: string,
    isModalOpen: boolean,
    modalContent: JSX.Element | null, 
  }>({
    title: '',
    isModalOpen: false,
    modalContent: null, 
  })
  const showModal = (content: JSX.Element, title='') => {
    if (!state.isModalOpen) {
      setState({
        title: title,
        isModalOpen: true,
        modalContent: content, 
      })
    }
  }
  const closeModal = () => {
    setState({
      title: '',
      isModalOpen: false,
      modalContent: null, 
    })
  }

  return (
    <context.Provider
      value={{
        showModal,
        closeModal
      }}
    >
      {children}
      <section 
        className={`${styles.container}`}
        style={{
          'display': state.isModalOpen ? 'block' : 'none'
        }}
      >
        <div className={styles.content}>
          <div className={styles.header}>
            <h4 className={`secondary-h4 ${styles.title}`}>{state.title}</h4>
            <IconButton 
              className={styles['close-button']}
              icon={faXmark}
              onClick={closeModal}
            />
          </div>
          { state.modalContent }
        </div>
      </section>
    </context.Provider>
  )
}

export {
  ModalProvider,
  useModal
}