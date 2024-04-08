import React, { useEffect, useRef } from "react"
import { marked } from "marked"
import DOMPurify from 'dompurify'
import { faEllipsisVertical, faCopy, faTrash } from '@fortawesome/free-solid-svg-icons'

import { useAlert } from '@providers/Alert'
import { useModal } from '@providers/Modal'
import { useContext } from '@providers/Context'
import DeleteNote from '@components/modals/DeleteNote'
import DropdownMenu from "@components/DropdownMenu"
import IconButton from '@components/IconButton'
import mkStyles from '@styles/markdown.module.css'
import styles from "@styles/text-note.module.css"
import { Note, NoteID } from "@ts/models/Notes.types"

marked.use({
  async: true,
  pedantic: false,
  gfm: true,
  breaks: true,
})

function TextNote({
  className='',
  data,
}: {
  className?: string,
  data: Note
}) {
  const contentContainer = useRef<HTMLDivElement>(null)
  const { showModal, closeModal } = useModal()
  const { showAlert } = useAlert()
    //const { state: { models: { notes } } } = useContext()

  useEffect(() => {
    if (!contentContainer.current) return
    (async () => {
      const parsed = await marked.parse(data.content)
      const purified = DOMPurify.sanitize(parsed)
      contentContainer.current.innerHTML = purified
    })()
  }, [contentContainer.current, data.content])

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
                navigator.clipboard.writeText(data.content) 
                showAlert('Text copied to clipboard')
              }
            },
            {
              label: 'Delete',
              icon: faTrash,
              onClick: () => showModal(
                <DeleteNote 
                  data={data}
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