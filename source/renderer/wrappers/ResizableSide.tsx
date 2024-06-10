import React, { useEffect, useRef, useState } from "react"

import VerticalDragableLine from './VerticalDragableLine'
//import styles from "@renderer/styles/resizable-side.module.css" 

export default function ResizableSide ({
  children=undefined,
  minWidth='64px',
  maxWidth='768px',
  initialApeture=undefined,
  sidebarToggleHash=undefined,
  open=undefined,
  aperture=undefined,
  onApertureChange=undefined,
  separator=undefined,
}: {
  children?: React.ReactNode,
  minWidth?: string,
  maxWidth?: string,
  initialApeture?: number,
  sidebarToggleHash?: string | number,
  open?: boolean,
  aperture?: number,
  onApertureChange?: (aperture: number) => void,
  separator?: React.ReactNode,
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
      //className={`${className} ${styles.container}`} 
      ref={containerRef}
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        flexWrap: 'nowrap',
      }}
    >
      { children }
      <VerticalDragableLine
        resizableRef={resizableRef}
        minWidth={parseInt(minWidth)}
        maxWidth={parseInt(maxWidth)}
        initialApeture={initialApeture}
        sidebarToggleHash={sidebarToggleHash}
        open={open}
        aperture={aperture}
        onApertureChange={onApertureChange}
        separator={separator}
      />
    </div>
  )
}