import React, { useRef, useEffect, useState } from "react"

interface StateType { 
  aperture: number,
  afterSidebarToggleHash: number,
}

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

export default function DragableLine ({
  style={},
  resizableRef,
  minSize,
  maxSize,
  initialApeture,
  sidebarToggleHash,
  open,
  aperture,
  direction,
  onApertureChange,
  onOpen,
  onClose,
  separator,
}: {
  style?: React.CSSProperties,
  resizableRef: React.MutableRefObject<HTMLElement>,
  minSize: number,
  maxSize: number,
  initialApeture: number,
  sidebarToggleHash: string | number,
  open: boolean,
  aperture: number,
  direction: 'right' | 'left' | 'top' | 'bottom'
  onApertureChange: (aperture: number) => void,
  onOpen: () => void,
  onClose: () => void,
  separator: React.ReactNode,
}) {
  const [state, _setState] = useState<StateType>({ 
    aperture: initialApeture,
    afterSidebarToggleHash: 0,
  })
  const setState: React.Dispatch<React.SetStateAction<StateType>> = (state) => {
    if (typeof state === 'object') {
      _setState({
        ...state,
        aperture: normalize(state.aperture)
      })
    }
    return _setState(state)
  }
  const dragableLineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Set aperture from open and initial apertre variables
    if (open !== undefined) {
      setState((prev) => ({ 
        ...prev,
        aperture: open ? 1.0 : 0.0,
      }))
    } else if (initialApeture !== undefined) {
      setState((prev) => ({ 
        ...prev, 
        aperture: initialApeture 
      }))
    }
  }, [
    open,
    initialApeture,
  ])

  const apertureBufferRef = useRef<number>(1.0)
  useEffect(() => {
    // Toggle sidebar openess
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
      aperture: normalize(prev.aperture < APERTURE_BIAS ? apertureBufferRef.current : 0.0),
      afterSidebarToggleHash: prev.afterSidebarToggleHash += 1
    }))
    if (state.aperture > APERTURE_BIAS)
      apertureBufferRef.current = state.aperture
  }, [sidebarToggleHash])

  useEffect(() => {
    resizableRef.current?.classList.add('resizable-side__transition')
    setTimeout(() => {
      resizableRef.current?.classList.remove('resizable-side__transition')
    }, 0.5 * 1000)
  }, [state.afterSidebarToggleHash])
  
  useEffect(() => {
    // Resize based on aperture value
    if (resizableRef.current === undefined || state.aperture === undefined)
      return

    let { aperture } = state
    if (aperture < 0.0) aperture = 0.0
    if (aperture > 1.0) aperture = 1.0

    const amplitude = minSize + (aperture * (maxSize - minSize))
    if (direction === 'left' || direction === 'right') {
      resizableRef.current.style.width = `${amplitude}px`
    } else {
      resizableRef.current.style.height = `${amplitude}px`
    }
  }, [resizableRef.current, state.aperture])


  /**************************************************************************
  * Set listeners
  **************************************************************************/
  useEffect(() => {
    if (
      dragableLineRef.current === undefined ||
      resizableRef.current === undefined ||
      open !== undefined ||
      aperture !== undefined
    ) {
      return
    }

    resizableRef.current?.classList.remove('resizable-side__transition')
    const origin = { from: 0 }
    const onMouseMove = (event: MouseEvent) => {
      event.preventDefault()
      if (!dragableLineRef.current) 
        return

      if (direction === 'right') {
        const { left } = resizableRef.current.getBoundingClientRect()
        setState((prev) => ({
          ...prev,
          aperture: normalize(
            (event.clientX - minSize - left) / (maxSize - minSize))
        }))
      } else if (direction === 'left') {
        const { right } = resizableRef.current.getBoundingClientRect()
        setState((prev) => ({
          ...prev,
          aperture: normalize(
            (right - event.clientX - minSize) / (maxSize - minSize))
        }))
      } else if (direction === 'bottom') {
        const { top } = resizableRef.current.getBoundingClientRect()
        setState((prev) => ({
          ...prev,
          aperture: normalize(
            (event.clientY - minSize - top) / (maxSize - minSize))
        }))
      } else if (direction === 'top') {
        const { bottom } = resizableRef.current.getBoundingClientRect()
        setState((prev) => ({
          ...prev,
          aperture: normalize(
            (bottom - event.clientX - minSize) / (maxSize - minSize))
        }))
      }
    }
    const onMouseDown = () => {
      origin.from = dragableLineRef.current.getBoundingClientRect().left
      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
    }
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }
    dragableLineRef.current.addEventListener('mousedown', onMouseDown)
    return () => {
      if (dragableLineRef.current)
        dragableLineRef.current.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }

  }, [
    dragableLineRef.current, 
    resizableRef.current, 
    minSize,
    maxSize,
  ])

  /**************************************************************************
  * Trigger events
  **************************************************************************/

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

  const isSidebarOpenRef = useRef<boolean>(undefined)
  useEffect(() => {
    // Update value of sidebarOpen on context actions
    if (!resizableRef.current) 
      return

    if (isSidebarOpenRef.current !== true && state.aperture >= APERTURE_BIAS) {
      onOpen()
      isSidebarOpenRef.current = true
    } else if (isSidebarOpenRef.current !== false && state.aperture < APERTURE_BIAS) {
      onClose()
      isSidebarOpenRef.current = false
    }
  }, [
    resizableRef.current,
    state.aperture,
  ])

  /**************************************************************************
  * Return JSX component
  **************************************************************************/
  return (
    <div
      data-testid='dragable-line'
      ref={dragableLineRef}
      style={style}
    >
      {separator}
    </div>
  )
}