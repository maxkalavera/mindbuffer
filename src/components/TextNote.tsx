import React, { useEffect, useRef } from "react"
import { marked } from "marked"
import DOMPurify from 'dompurify'
import { faEllipsisVertical, faCopy, faTrash } from '@fortawesome/free-solid-svg-icons'

import ModalContent from '@components/ModalContent'
import DropdownMenu from "@components/DropdownMenu"
import IconButton from '@components/IconButton'
import { useAlert } from '@providers/Alert'
import { useModal } from '@providers/Modal'
import { useContext } from '@providers/Context'
import mkStyles from '@styles/markdown.module.css'
import styles from "@styles/text-note.module.css"

marked.use({
  async: true,
  pedantic: false,
  gfm: true,
  breaks: true,
})

function TextNote({
  className='',
  note,
}: {
  className?: string,
  note: {[key: string]: any}
}) {
  const contentContainer = useRef<HTMLDivElement>(null)
  const { showModal, closeModal } = useModal()
  const { showAlert } = useAlert()
  const { dispatch } = useContext()

  useEffect(() => {
    if (!contentContainer.current) return
    (async () => {
      const parsed = await marked.parse(note.dataValues.content)
      const purified = DOMPurify.sanitize(parsed)
      contentContainer.current.innerHTML = purified
    })()
  }, [contentContainer.current, note.dataValues.content])

  return (
    <div className={`${className} ${styles.container}`}>
      <div 
        className={`${mkStyles.markdown} ${styles.content}`} 
        ref={contentContainer}
      />
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