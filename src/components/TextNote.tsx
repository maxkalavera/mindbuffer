import React, { useEffect, useRef } from "react"
import { faEllipsisVertical, faCopy, faTrash } from '@fortawesome/free-solid-svg-icons'

import ModalContent from '@components/ModalContent'
import DropdownMenu from "@components/DropdownMenu"
import IconButton from '@components/IconButton'
import { useAlert } from '@providers/Alert'
import { useModal } from '@providers/Modal'
import { useContext } from '@providers/Context'
import styles from "@styles/text-note.module.css"

function TextNote({
  className='',
  note,
}: {
  className?: string,
  note: {[key: string]: any}
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { showModal, closeModal } = useModal()
  const { showAlert } = useAlert()
  const { dispatch } = useContext()

  useEffect(() => {
    if (textareaRef.current)
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }, [textareaRef.current])
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <textarea 
          ref={textareaRef} 
          className={styles.textarea} 
          defaultValue={note.dataValues.content}
          disabled
        />
      </div>
      <div className={styles.options}>
        <DropdownMenu
          options={[
            {
              label: 'Copy',
              icon: faCopy,
              onClick: () => {
                navigator.clipboard.writeText(note.dataValues.content) 
                showAlert('Text copied to clipboard')
              }
            },
            {
              label: 'Delete',
              icon: faTrash,
              onClick: () => showModal(
                <ModalContent 
                  text='Are you sure you want to delete the note?'
                  primary={{
                    label: 'Delete',
                    onClick: () => {
                      dispatch({
                        type: 'notes/delete',
                        payload: note.dataValues.id
                      })
                      closeModal()
                      showAlert('Note deleted!')
                    }
                  }}
                  secondary={{
                    label: 'Cancel',
                    onClick: () => closeModal()
                  }}
                />
              )
            }
          ]}
        >
          <IconButton
            className={styles['options-button']}
            icon={faEllipsisVertical}
          />
        </DropdownMenu>
      </div>
    </div>
  );
}

export default TextNote;