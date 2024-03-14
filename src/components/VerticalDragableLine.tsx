import React, { useRef, useEffect, useState } from "react"

import styles from '@styles/vertical-dragable-line.module.css'

export default function VerticalDragableLine ({
  className='',
  openness=0.0,
  isOpen=false,
  onOpenessChange=() => null,
  resizableRef
}: {
  className?: string,
  openness?:number,
  isOpen?: boolean,
  onOpenessChange?: (value: number) => any
  resizableRef: React.MutableRefObject<any>
}) {
  const verticalLineRef = useRef<HTMLDivElement>(null)
  const minWidthRef = useRef<number>(null)
  const maxWidthRef = useRef<number>(null)

  const openFrame = () => {
    if (resizableRef.current === null) return
    const style = getComputedStyle(resizableRef.current)
    resizableRef.current.style.width = style.maxWidth
  }

  const closeFrame = () => {
    if (resizableRef.current === null) return
    const style = getComputedStyle(resizableRef.current)
    resizableRef.current.style.width = style.minWidth
  }

  useEffect(() => {
    if (resizableRef.current === null) return

    if (openness === 1.0) openFrame()
    else if (openness === 0.0) closeFrame()

  }, [resizableRef.current, openness])

  useEffect(() => {
    if (resizableRef.current === null) return
    const style = getComputedStyle(resizableRef.current)
    minWidthRef.current = parseFloat(style.minWidth.match(/\d/g).join(''))
    maxWidthRef.current = parseFloat(style.maxWidth.match(/\d/g).join(''))
  }, [resizableRef.current])

  useEffect(() => {
    if (verticalLineRef.current === null) return
    if (resizableRef.current === null) return

    const origin = {
      right: verticalLineRef.current.getBoundingClientRect().right
    }
    const onMouseMove = (event: MouseEvent) => {
      event.preventDefault()
      if (verticalLineRef.current === null) return
      const style = getComputedStyle(resizableRef.current)
      const destination = event.clientX
      origin.right = verticalLineRef.current.getBoundingClientRect().right
      const { width } = resizableRef.current.getBoundingClientRect()
      const resWidth = width + (destination - origin.right)
      resizableRef.current.style.width = `${resWidth}px`

      let norm = (resWidth - minWidthRef.current) / (maxWidthRef.current - minWidthRef.current)
      if (norm < 0.0) norm = 0.0
      if (norm > 1.0) norm = 1.0
      onOpenessChange(norm)
    }
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }
    const onMouseDown = () => {
      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
    }
    verticalLineRef.current.addEventListener('mousedown', onMouseDown)
    return () => {
      if (verticalLineRef.current)
        verticalLineRef.current.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }

  }, [
    verticalLineRef.current, 
    resizableRef.current, 
    minWidthRef.current, 
    maxWidthRef.current
  ])

  return (
    <div
      className={styles['vertical-line']}
      ref={verticalLineRef}
    ></div>
  )
}