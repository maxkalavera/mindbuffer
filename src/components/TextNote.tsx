import React, { useEffect, useRef } from "react"
import { marked } from "marked"
import DOMPurify from 'dompurify'
import { faEllipsisVertical, faCopy, faTrash } from '@fortawesome/free-solid-svg-icons'

import { useAlert } from '@providers/Alert'
import { useModal } from '@providers/Modal'
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
        __ENVIRONMENT__ === 'testing' ? 'class:text-note:7BoiMerq5D' : ''
      ].join(' ')}
    >
      <div 
        className={`${mkStyles.markdown} ${styles.content}`} 
        ref={contentContainer}
      />
      <div className={styles.options}>
        <DropdownMenu
          className={
            __ENVIRONMENT__ === 'testing' ? 'class:note-options-button:TMKI1oxDBJ' : ''
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
              className: __ENVIRONMENT__ === 'testing' ? 'class:note-options-delete-button:CEXEVxvbnV' : '',
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