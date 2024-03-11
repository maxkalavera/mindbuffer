import React, { useRef } from 'react'

import { useContext } from '@providers/Context'
import TextNote from "@components/TextNote"
import styles from "@styles/notes-board.module.css"
import { useEffect, useState } from 'react'

function NotesBoard({
  className=''
}: {
  className?: string
}) {
  const { dispatch, boardNotes, hasNextPage, page } = useContext()
  const [scrollTopReached, setScrollTopReached] = useState<boolean>(false)
  const [scrollHeight, setScrollHeight] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const scrollBottom = () => {
    if (containerRef.current === null) return
    containerRef.current.scrollTop = containerRef.current.scrollHeight    
  }

  useEffect(() => {
    dispatch({type: 'notes/queryBoardNotes'})
  }, [])

  /*
  useEffect(() => {
    scrollBottom()
  }, [containerRef.current])
  */

  useEffect(() => {
    if (containerRef.current === null) return
    const listener = () => {
      const { scrollTop } = containerRef.current
      if (!scrollTopReached && scrollTop <= 0) {
        setScrollTopReached(true)
      }
    }
    containerRef.current.addEventListener('scroll', listener, {passive: true})
    return () => containerRef.current.removeEventListener('scroll', listener)
  }, [containerRef.current, scrollTopReached])

  useEffect(() => {
    if (hasNextPage && scrollTopReached) {
      setScrollHeight(containerRef.current.scrollHeight)
      dispatch({type: 'notes/nextPage'})
      setScrollTopReached(false)
    }
  }, [hasNextPage, scrollTopReached])

  useEffect(() => {
    if (containerRef.current === null) return
    if (page === 1) {
      scrollBottom()
    } else {
      containerRef.current.scrollTop = containerRef.current.scrollHeight - scrollHeight
    }
  }, [containerRef.current, page])

  return (
    <div className={`${styles.container} ${className}`}
      ref={containerRef}
    >
      {
        boardNotes.map((item: typeof boardNotes[number], index: number) => (
          <TextNote 
            key={item.dataValues.id}
            className={styles.textnote}
            note={item}
          />
        ))
      }
    </div>
  );
}

export default NotesBoard;