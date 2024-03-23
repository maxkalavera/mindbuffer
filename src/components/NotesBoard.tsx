import React, { useRef } from 'react'

import { useContext } from '@providers/Context'
import TextNote from "@components/TextNote"
import styles from "@styles/notes-board.module.css"
import { useEffect, useState } from 'react'

import type { ContextState } from '@ts/providers/Context.types'

function NotesBoard({
  className=''
}: {
  className?: string
}) {
  const { board, searchBar, setState } = useContext()
  const [scrollHeight, setScrollHeight] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const scrollBottom = () => {
    if (containerRef.current === null) return
    containerRef.current.scrollTop = containerRef.current.scrollHeight
  }

  useEffect(() => {
    if (containerRef.current === null) return
    if (!board.scrollBottom.value) return
    scrollBottom()
    board.scrollBottom.set({ value: false})
  }, [containerRef.current, board.scrollBottom.value])

  useEffect(() => {
    if (containerRef.current === null) return
    if (!board.notes.hasNextPage.value) return

    const listener = () => {
      const { scrollTop } = containerRef.current
      if (scrollTop <= 0) {
        setScrollHeight(containerRef.current.scrollHeight)
        board.notes.page.increase()
      }
    }
    containerRef.current.addEventListener('scroll', listener, {passive: true})
    return () => containerRef.current.removeEventListener('scroll', listener)
  }, [containerRef.current, board.notes.hasNextPage.value])

  useEffect(() => {
    if (containerRef.current === null) return
    if (board.notes.page.value > 1) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight - scrollHeight
    }
  }, [containerRef.current, board.notes.page.value])

  return (
    <div className={`${styles.container} ${className}`}
      ref={containerRef}
    >
      {
        board.notes.values.map((item: any, index: number) => (
          <TextNote 
            key={index}
            className={styles.textnote}
            note={item}
          />
        ))
      }
    </div>
  );
}

export default NotesBoard;