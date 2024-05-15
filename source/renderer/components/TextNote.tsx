import React, { useEffect, useRef } from "react"
import { marked } from "marked"
import DOMPurify from 'dompurify'
import { faEllipsisVertical, faCopy, faTrash } from '@fortawesome/free-solid-svg-icons'

import { useAlert } from '@renderer/providers/Alert'
import { useModal } from '@renderer/providers/Modal'
import DeleteNote from '@renderer/components/modals/DeleteNote'
import DropdownMenu from "@renderer/components/DropdownMenu"
import IconButton from '@renderer/components/IconButton'
import mkStyles from '@renderer/styles/markdown.module.css'
import styles from "@renderer/styles/text-note.module.css"
import { Note, NoteID } from "@commons/ts/models/Notes.types"

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
  const { showModal } = useModal()
  const { showAlert } = useAlert()

  useEffect(() => {
    if (!contentContainer.current)
      return
    let controller = new AbortController()
    new Promise(async (resolve, _) => {
      const parsed = await marked.parse(data.content)
      const purified = DOMPurify.sanitize(parsed)
      if (contentContainer.current && !controller.signal.aborted) {
        contentContainer.current.innerHTML = purified
      }
    })
    return () => controller.abort()
  }, [contentContainer.current, data.content])

  return (
    <div 
      className={[
        className,
        styles.container,
        globals.ENVIRONMENT === 'testing' ? 'class:text-note:7BoiMerq5D' : ''
      ].join(' ')}
    >
      <div 
        className={`${mkStyles.markdown} ${styles.content}`} 
        ref={contentContainer}
      />
      <div className={styles.options}>
        <DropdownMenu
          className={
            globals.ENVIRONMENT === 'testing' ? 'class:note-options-button:TMKI1oxDBJ' : ''
          }
          options={[
            {
              label: 'Copy',
              icon: faCopy,
              onClick: () => {
                navigator.clipboard.writeText(data.content) 
                showAlert({ message: 'Text copied to clipboard', type: 'success'})
              }
            },
            {
              label: 'Delete',
              icon: faTrash,
              className: globals.ENVIRONMENT === 'testing' ? 'class:note-options-delete-button:CEXEVxvbnV' : '',
              onClick: () => showModal(
                <DeleteNote 
                  value={data}
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