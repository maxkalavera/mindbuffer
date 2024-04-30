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
    if (!contentContainer.current) return
    (async () => {
      const parsed = await marked.parse(data.content)
      const purified = DOMPurify.sanitize(parsed)
      contentContainer.current.innerHTML = purified
    })()
  }, [contentContainer.current, data.content])

  return (
    <div 
      className={[
        className,
        styles.container,
        __ENVIRONMENT__ === 'testing' ? 'class:88ca791f00cd44539162be4e1c7a30eb' : ''
      ].join(' ')}
    >
      <div 
        className={`${mkStyles.markdown} ${styles.content}`} 
        ref={contentContainer}
      />
      <div className={styles.options}>
        <DropdownMenu
          className={
            __ENVIRONMENT__ === 'testing' ? 'class:0c7cb38404c34f6ba51ebe56b10b142f' : ''
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
              className: __ENVIRONMENT__ === 'testing' ? 'class:8c80d40c1eee414cbdab38ddca3130e5' : '',
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