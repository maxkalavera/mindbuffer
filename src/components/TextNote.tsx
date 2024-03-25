import React, { useEffect, useRef } from "react"
import { marked } from "marked"
import DOMPurify from 'dompurify'
import { faEllipsisVertical, faCopy, faTrash } from '@fortawesome/free-solid-svg-icons'

import DeleteNote from '@components/modals/DeleteNote'
import DropdownMenu from "@components/DropdownMenu"
import IconButton from '@components/IconButton'
import { useAlert } from '@providers/Alert'
import { useModal } from '@providers/Modal'
import { useContext } from '@providers/Context'
import mkStyles from '@styles/markdown.module.css'
import styles from "@styles/text-note.module.css"
import { NoteID } from "@ts/models/Notes.types"

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
  const { board: { notes } } = useContext()

  const destroyNote = (id: NoteID) => {
    if (window.electronAPI.notes.destroy({ id }))
      notes.destroy({ id: id })
  }

  useEffect(() => {
    if (!contentContainer.current) return
    (async () => {
      const parsed = await marked.parse(note.content)
      const purified = DOMPurify.sanitize(parsed)
      contentContainer.current.innerHTML = purified
    })()
  }, [contentContainer.current, note.content])

  return (
    <div className={`${className} ${styles.container}`}
    >
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
                navigator.clipboard.writeText(note.content) 
                showAlert('Text copied to clipboard')
              }
            },
            {
              label: 'Delete',
              icon: faTrash,
              onClick: () => showModal(
                <DeleteNote 
                  onSuccess={() => {
                    destroyNote(note.id)
                    closeModal()
                    showAlert('Note deleted!')
                  }}
                  onCancel={() => {
                    closeModal()
                  }}
                />
              , 'Delete Note')
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