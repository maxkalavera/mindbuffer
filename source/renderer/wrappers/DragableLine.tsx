import React, { useRef, useEffect, useState, useCallback } from "react"

interface DragableLinePropsType {
  style?: React.CSSProperties,
  containerRef: React.MutableRefObject<HTMLDivElement>,
  resizableRef: React.MutableRefObject<HTMLElement>,
  initialApeture: number,
  sidebarToggleHash: string | number,
  open: boolean,
  aperture: number,
  direction: 'right' | 'left' | 'top' | 'bottom'
  //minSize: number,
  //maxSize: number,
  minWidth: string | number,
  maxWidth: string | number,
  minHeight: string | number,
  maxHeight:  string | number,
  onApertureChange: (aperture: number) => void,
  onOpen: () => void,
  onClose: () => void,
  separator: React.ReactNode,
}

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
  containerRef,
  resizableRef,
  initialApeture,
  sidebarToggleHash,
  open,
  aperture,
  direction,
  //minSize,
  //maxSize,
  minWidth,
  maxWidth,
  minHeight,
  maxHeight,
  onApertureChange,
  onOpen,
  onClose,
  separator,
}: DragableLinePropsType) {
  const [state, _setState] = useState<StateType>({ 
    aperture: initialApeture || 0.0,
    afterSidebarToggleHash: 0,
  })
  const setState: React.Dispatch<React.SetStateAction<StateType>> = (state) => {
    _setState((prev) => {
      const resState = typeof state === 'function' ? state(prev) : state
      return {
        ...resState,
        aperture: normalize(resState.aperture)
      }
    })
  }
  const dragableLineRef = useRef<HTMLDivElement>(null)

  const getBoundaries = useCallback(() => {
    if (resizableRef.current === undefined) {
      return {
        minWidth: 0,
        maxWidth: 0,
        minHeight: 0,
        maxHeight: 0,
        deltaX: 0,
        deltaY: 0,
      }
    }

    const parse = (value: string | number) => {
      return typeof value === 'string' ? parseInt(value) : value
    }

    const parent = resizableRef.current.parentElement.parentElement
    const { width, height } = parent.getBoundingClientRect()
    const boundaries = {
      minWidth: parse(minWidth) || 0,
      maxWidth: Math.min(parse(maxWidth) || Infinity, width),
      minHeight: parse(minHeight) || 0,
      maxHeight: Math.min(parse(maxHeight) || Infinity, height),
      deltaX: 0,
      deltaY: 0,
    }
    boundaries.deltaX = Math.abs(boundaries.maxWidth - boundaries.minWidth)
    boundaries.deltaY = Math.abs(boundaries.maxHeight - boundaries.minHeight)
    return boundaries
  }, [
    resizableRef.current,
    minWidth,
    maxWidth,
    minHeight,
    maxHeight
  ])

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

    const boundaries = getBoundaries()
    if (direction === 'left' || direction === 'right') {
      const amplitude = boundaries.minWidth + (aperture * boundaries.deltaX)
      resizableRef.current.style.width = `${amplitude}px`
    } else {
      const amplitude = boundaries.minHeight + (aperture * boundaries.deltaY)
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
    const origin: { current: { x: number, y: number} } = { current: undefined}
    const onMouseMove = (event: MouseEvent) => {
      event.preventDefault()
      if (!dragableLineRef.current) 
        return

      const boundaries = getBoundaries()
      const isHorizontal = direction === 'right' || direction === 'left'
      const delta = { x: event.clientX - origin.current.x, y: event.clientY - origin.current.y}
      let step = delta[isHorizontal ? 'x' : 'y'] / (isHorizontal ? boundaries.deltaX : boundaries.deltaY)

      step = direction === 'right' || direction === 'bottom' ? step : -step
      setState((prev) => ({
        ...prev,
        aperture: prev.aperture + step,
      }))
      origin.current = { x: event.clientX, y: event.clientY }
    }
    const onMouseDown = (event) => {
      origin.current = { x: event.clientX, y: event.clientY }
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
      onOpen && onOpen()
      isSidebarOpenRef.current = true
    } else if (isSidebarOpenRef.current !== false && state.aperture < APERTURE_BIAS) {
      onClose && onClose()
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