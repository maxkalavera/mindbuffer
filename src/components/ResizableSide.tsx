import React, { useEffect, useRef, useState } from "react"

import store from "@src/store"
import styles from "@styles/resizable-side.module.css" 

import VerticalDragableLine from '@components/VerticalDragableLine'

export default function ResizableSide ({
  className='',
  children=undefined,
}: {
  className?: string,
  children?: React.ReactNode,
}) {
  const containerRef = useRef<HTMLDivElement>()
  const resizableRef = useRef<any>()

  useEffect(() => {
    if (!containerRef.current)
      return
      resizableRef.current = containerRef.current.firstChild
  }, [containerRef.current])

  return (
    <div
      className={`${className} ${styles.container}`} 
      ref={containerRef}
    >
      { children }
      <VerticalDragableLine 
        resizableRef={resizableRef}
      />
    </div>
  )
}