import React, { useContext, useState } from 'react'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

import IconButton from '@components/IconButton'
import styles from '@styles/modal.module.css'

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
  const [title, setTitle] = useState<string>('')
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null)
  const showModal = (content: JSX.Element, title='') => {
    if (!isModalOpen) {
      setModalContent(content)
      setIsModalOpen(true)
      setTitle(title)
    }
  }
  const closeModal = () => {
    setIsModalOpen(false)
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
          'display': isModalOpen ? 'block' : 'none'
        }}
      >
        <div className={styles.content}>
          <div className={styles.header}>
            <h4 className={`secondary-h4 ${styles.title}`}>{title}</h4>
            <IconButton 
              className={styles['close-button']}
              icon={faXmark}
              onClick={closeModal}
            />
          </div>
          { modalContent }
        </div>
      </section>
    </context.Provider>
  )
}

export {
  ModalProvider,
  useModal
}