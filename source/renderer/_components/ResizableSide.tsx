import React, { useEffect, useRef, useState } from "react"

import VerticalDragableLine from '@renderer/components/VerticalDragableLine'
import styles from "@renderer/styles/resizable-side.module.css" 

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