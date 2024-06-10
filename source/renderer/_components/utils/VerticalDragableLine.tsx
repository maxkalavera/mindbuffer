import React, { useRef, useEffect, useState } from "react"

import commonsSlice from "@renderer/actions/commons.slice"
import store from "@renderer/utils/store"
//import styles from '@renderer/styles/vertical-dragable-line.module.css'

const APERTURE_BIAS = 0.025

const normalize = (value) => {
  if (value >= 1.0) {
    return 1.0
  } else if (value <= 0.0) {
    return 0.0
  } else {
    return value
  }
}

export default function VerticalDragableLine ({
  resizableRef,
  minWidth,
  maxWidth,
  initialApeture,
  sidebarToggleHash,
  open,
  aperture,
  onApertureChange,
  separator,
}: {
  resizableRef: React.MutableRefObject<any>,
  minWidth: number,
  maxWidth: number,
  initialApeture: number,
  sidebarToggleHash: string | number,
  open: boolean,
  aperture: number,
  onApertureChange: (aperture: number) => void,
  separator: React.ReactNode,
}) {
  const [state, setState] = useState<{ aperture: number }>({ 
    aperture: initialApeture 
  })
  const verticalLineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open !== undefined) {
      setState({ aperture: open ? 1.0 : 0.0 })
    } else if (initialApeture !== undefined) {
      setState({ aperture: normalize(initialApeture) })
    } else if (aperture !== undefined) {
      setState({ aperture: normalize(aperture) })
    }
  }, [open, aperture, initialApeture])

  const apertureBufferRef = useRef<number>(1.0)
  useEffect(() => {
    if (
      sidebarToggleHash === undefined ||
      state.aperture === undefined ||
      open !== undefined ||
      aperture !== undefined
    ) {
      return
    }

    setState((prev) => ({
      ...prev,
      aperture: prev.aperture < APERTURE_BIAS ? apertureBufferRef.current : 0.0
    }))
    if (state.aperture > APERTURE_BIAS)
      apertureBufferRef.current = state.aperture
  }, [sidebarToggleHash])

  const isSidebarOpenRef = useRef<boolean>(undefined)
  useEffect(() => {
    if (!resizableRef.current) 
      return

    if (isSidebarOpenRef.current !== false && state.aperture < APERTURE_BIAS) {
      const { setIsSidebarOpen } = commonsSlice.actions
      store.dispatch(setIsSidebarOpen({ value: false }))
      isSidebarOpenRef.current = false
    } else if (isSidebarOpenRef.current !== true && state.aperture >= APERTURE_BIAS) {
      const { setIsSidebarOpen } = commonsSlice.actions
      store.dispatch(setIsSidebarOpen({ value: true }))
      isSidebarOpenRef.current = true
    }
  }, [
    resizableRef.current,
    state.aperture,
  ])

  useEffect(() => {
    // Resize based on aperture value
    if (resizableRef.current === undefined || state.aperture === undefined)
      return

    let { aperture } = state
    if (aperture < 0.0) aperture = 0.0
    if (aperture > 1.0) aperture = 1.0
    const width = minWidth + 
      (aperture * (maxWidth - minWidth))
    resizableRef.current.style.width = `${width}px`
  }, [resizableRef.current, state.aperture])


  /**************************************************************************
  * Set listeners
  **************************************************************************/
  useEffect(() => {
    if (
      verticalLineRef.current === undefined ||
      resizableRef.current === undefined ||
      open !== undefined ||
      aperture !== undefined
    ) {
      return
    }
    const origin = { from: 0 }
    const onMouseMove = (event: MouseEvent) => {
      event.preventDefault()
      if (!verticalLineRef.current) 
        return

      const { left } = resizableRef.current.getBoundingClientRect()
      setState({
        aperture:
          (event.clientX - (2 * minWidth) - left) / 
          (maxWidth - minWidth),
      })
    }
    const onMouseDown = () => {
      origin.from = verticalLineRef.current.getBoundingClientRect().left
      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
    }
    const onMouseUp = () => {
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
    minWidth,
    maxWidth,
  ])

  useEffect(() => {
    if (
      state.aperture === undefined || 
      onApertureChange === undefined
    ) {
      return
    }
    if (aperture === undefined && open === undefined) {
      onApertureChange(state.aperture)
    }
  }, [aperture, state.aperture])

  return (
    <div
      ref={verticalLineRef}
    >
      {separator}
    </div>
  )
}