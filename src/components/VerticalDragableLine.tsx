import React, { useRef, useEffect, useState } from "react"

import styles from '@styles/vertical-dragable-line.module.css'

export default function VerticalDragableLine ({
  className='',
  aperture=0.0,
  onApertureChange=() => null,
  resizableRef
}: {
  className?: string,
  aperture?:number,
  isOpen?: boolean,
  onApertureChange?: (value: number) => any
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

    if (aperture === 1.0) openFrame()
    else if (aperture === 0.0) closeFrame()

  }, [resizableRef.current, aperture])

  useEffect(() => {
    if (resizableRef.current === null) return
    const style = getComputedStyle(resizableRef.current)
    minWidthRef.current = parseFloat(style.minWidth.match(/\d/g).join(''))
    maxWidthRef.current = parseFloat(style.maxWidth.match(/\d/g).join(''))
    resizableRef.current.classList.add(styles['with-transition'])
  }, [resizableRef.current])

  useEffect(() => {
    // Resize based on aperture var
    if (resizableRef.current === null) return
    if (aperture < 0.0) aperture = 0.0
    if (aperture > 1.0) aperture = 1.0
    const width = minWidthRef.current + (aperture * (maxWidthRef.current - minWidthRef.current))
    resizableRef.current.style.width = `${width}px`
  }, [resizableRef.current, aperture])

  useEffect(() => {
    /**************************************************************************
     * Set listeners
    **************************************************************************/
    if (verticalLineRef.current === null) return
    if (resizableRef.current === null) return

    const origin = {
      from: 0
    }
    const onMouseMove = (event: MouseEvent) => {
      event.preventDefault()
      if (verticalLineRef.current === null) return
      const from = origin.from
      const to = event.clientX
      const apertureDiff = (to - from) / (maxWidthRef.current - minWidthRef.current)
      let newAperture = aperture + apertureDiff
      if (newAperture < 0.0) newAperture = 0.0
      if (newAperture > 1.0) newAperture = 1.0
      onApertureChange(newAperture)
    }
    const onMouseDown = () => {
      resizableRef.current.classList.remove(styles['with-transition'])
      origin.from = verticalLineRef.current.getBoundingClientRect().right
      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
    }
    const onMouseUp = () => {
      resizableRef.current.classList.add(styles['with-transition'])
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
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