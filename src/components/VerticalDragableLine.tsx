import React, { useRef, useEffect, useState } from "react"

import store from "@src/store"
import styles from '@styles/vertical-dragable-line.module.css'

export default function VerticalDragableLine ({
  className='',
  resizableRef
}: {
  className?: string,
  resizableRef: React.MutableRefObject<any>
}) {
  const [state, setState] = useState({ aperture: 1.0 })
  const [context, setContext] = useState({ isSidebarOpen: true })
  const verticalLineRef = useRef<HTMLDivElement>(null)
  const minWidthRef = useRef<number>(null)
  const maxWidthRef = useRef<number>(null)

  useEffect(() => {
    store.monitor(
      (state) => state.commons.isSidebarOpen,
      (state) => setContext({ isSidebarOpen: state.commons.isSidebarOpen })
    )
  }, [])

  useEffect(() => {
    if (!resizableRef.current) 
      return

    if (context.isSidebarOpen) {
      setState({ aperture: 1.0 })
    } else {
      setState({ aperture: 0.0 })
    }
  }, [resizableRef.current, context.isSidebarOpen])

  useEffect(() => {
    if (!resizableRef.current) 
      return

    const style = getComputedStyle(resizableRef.current)
    minWidthRef.current = parseFloat(style.minWidth.match(/\d/g).join(''))
    maxWidthRef.current = parseFloat(style.maxWidth.match(/\d/g).join(''))
    resizableRef.current.classList.add(styles['with-transition'])
  }, [resizableRef.current])

  useEffect(() => {
    // Resize based on aperture var
    if (!resizableRef.current) 
      return

    let { aperture } = state
    if (aperture < 0.0) aperture = 0.0
    if (aperture > 1.0) aperture = 1.0

    const width = minWidthRef.current + (aperture * (maxWidthRef.current - minWidthRef.current))
    resizableRef.current.style.width = `${width}px`
  }, [resizableRef.current, state.aperture])

  useEffect(() => {
    /**************************************************************************
     * Set listeners
    **************************************************************************/
    if (!verticalLineRef.current) 
      return
    if (!resizableRef.current) 
      return

    const origin = { from: 0 }
    const onMouseMove = (event: MouseEvent) => {
      event.preventDefault()
      if (!verticalLineRef.current) 
        return

      const { left } = resizableRef.current.getBoundingClientRect()
      setState({
        aperture:
          (event.clientX - (2 * minWidthRef.current) - left) / 
          (maxWidthRef.current - minWidthRef.current),
      })
    }
    const onMouseDown = () => {
      resizableRef.current.classList.remove(styles['with-transition'])
      origin.from = verticalLineRef.current.getBoundingClientRect().left
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
    maxWidthRef.current,
  ])

  return (
    <div
      className={`${className} ${styles['vertical-line']}`}
      ref={verticalLineRef}
    />
  )
}